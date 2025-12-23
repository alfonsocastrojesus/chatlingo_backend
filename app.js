// importar dependencias

import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors({ origin: "https://taupe-beignet-6b8275.netlify.app" }));

const PORT = process.env.PORT || 3000;

// servir frontend
app.use("/", express.static("public"));

// middleware para procesar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// instancia OpenAI y API KEY

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ruta ,endopoint , url
app.post("/api/traducir", async (req, res) => {
  const { text, targetLang } = req.body;
  const promptSystem1 = "eres un traductor profesional";
  const promptSystem2 =
    "solo puedes responder con una traduccion directa del texto" +
    "cualquier otra respuesta o conversacion esta estrictamente prohibida";
  const promptUser = `traduce el siguiente texto al ${targetLang}:${text}`;
  // llamar al modelo de openAI

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: promptSystem1 },
        { role: "system", content: promptSystem2 },
        { role: "user", content: promptUser },
      ],
      max_completion_tokens: 500,
      response_format: { type: "text" },
    });

    const translatedText = completion.choices[0].message.content;
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "error al traducir, intenta de nuevo" });
  }
});

// servir el backend
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
