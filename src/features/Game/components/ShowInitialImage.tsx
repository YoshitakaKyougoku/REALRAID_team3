import React from "react";
import Image from "next/image";
import { useImageGenerator } from "@/features/Game/hooks/useImageGenerator";
import styles from "../styles/showInitialImage.module.css";

export default function ShowInitialImage() {
  const { imageData, isLoading, error } = useImageGenerator();

  return (
    <div className={styles.container}>
      <div>
        <p>お題</p>
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
