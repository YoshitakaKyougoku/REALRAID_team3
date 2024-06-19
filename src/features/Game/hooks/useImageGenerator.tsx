import { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const useImageGenerator = (initialPrompt = "girl", generateSize = "256x256") => {
  const [imageData, setImageData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const isInitialRender = useRef(true);
  const prompt = initialPrompt;

  const generateImage = useCallback(async () => {
    if (!prompt) {
      alert("プロンプトがありません。");
      return;
    }
    console.log("call");

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}images/generations`,
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

      setImageData(response.data.data[0]["b64_json"]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, generateSize, isLoading]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      // generateImage();
      console.log('call')
    }
  }, [generateImage]);

  return { imageData, isLoading, error, generateImage };
};
