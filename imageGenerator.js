const axios = require('axios');

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

if (!API_URL || !API_KEY) {
  throw new Error("API_URL または API_KEY が設定されていません。");
}

const generateImage = async (prompt = "", generateSize = "256x256") => {
  if (!prompt) {
    throw new Error("プロンプトがありません。");
  }

  try {
    const response = await axios.post(
      `${API_URL}/images/generations`,
      {
        prompt,
        n: 1,
        size: generateSize,
        response_format: "b64_json",
        quality: "standard",
        model: "dall-e-2",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.data[0]["b64_json"];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

module.exports = { generateImage };
