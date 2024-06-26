const axios = require("axios");

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

if (!API_URL || !API_KEY) {
  throw new Error("API_URL または API_KEY が設定されていません。");
}

const generateAnswer = async (originalMessage = "", lastMessage = "") => {
  if (!originalMessage) {
    console.log("プロンプトがありません。");
    throw new Error("プロンプトがありません。");
  }

  try {
    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: "gpt-4",
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

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

const translate = async (message = "") => {
  try {
    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "『" + message + "』を英訳して",
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

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

const generatePrompt = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              "『（場所）で〜をしている（人物）』のような２０単語ほどの文章ひとつだけ作って。人物の特徴を詳しく書いて例）カフェでサングラスをかけてホットコーヒを飲んでいる女性",
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

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

module.exports = { generateAnswer, generatePrompt, translate };
