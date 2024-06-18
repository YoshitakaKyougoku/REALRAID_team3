"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function ShowInitialImage() {
  const [imageData, setImageData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const prompt = "girl";
  const [error, setError] = useState("");
  const generateSize = "256x256";
  const isInitialRender = useRef(true);

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
  }, [prompt]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      generateImage();
    }
  }, [generateImage]);

  return (
    <div className="container">
      <div className="generate-form">
      </div>
      {error && (
        <div className="error-message">
          <pre>{error}</pre>
        </div>
      )}
      {isLoading
        ? "作成中..."
        : imageData && (
            <div className="generated-image-area">
              <figure>
                <Image
                  src={`data:image/png;base64,${imageData}`}
                  alt="Received Data"
                  width={512}
                  height={512}
                />
              </figure>
            </div>
          )}
    </div>
  );
}
