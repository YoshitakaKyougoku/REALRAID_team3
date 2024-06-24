const axios = require("axios");

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

if (!API_URL || !API_KEY) {
  throw new Error("API_URL または API_KEY が設定されていません。");
}

const generateText = async (
  originalMessage = "",
  lastMessage = "",
  maxTokens = 100
) => {
  if (!originalMessage) {
    console.log("プロンプトがありません。");
    throw new Error("プロンプトがありません。");
  }

  try {
    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              originalMessage +
              "と" +
              lastMessage +
              "の二つの文章がどれくらい似ているか10点満点で評価してください評価した点数のみ出力してください",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    // const response = await 'こんにちは'
    // console.log("chatgpt/" + response);

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

module.exports = { generateText };
