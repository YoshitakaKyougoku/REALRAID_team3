import { ShowImage } from "@/features/play/components/ShowImage";
import Link from "next/link";
import styles from "./GameResult.module.css";

type GameResultProps = {
  chatgpt: string | null;
  initialPrompt: string | null;
  initialImage: string;
  previousMessage: string | null;
  generatedImage: string;
};
export const GameResult = ({
  chatgpt,
  initialPrompt,
  initialImage,
  previousMessage,
  generatedImage,
}: GameResultProps) => {
  return (
    <div className={styles.container}>
      <Link className={styles.link} href="/">トップに戻る</Link>
      <p className={styles.point}>ChatGPTによる採点：{chatgpt}/10</p>
      <div className={styles.results}>
        <p className={styles.heading}>お題</p>
        <p>{initialPrompt}</p>
        <div className={styles.image}>
          <ShowImage imageData={initialImage} />
        </div>
      </div>
      <div className={styles.results}>
        <p className={styles.heading}>生成された画像</p>
        <p>{previousMessage}</p>
        <div className={styles.image}>
          <ShowImage imageData={generatedImage} />
        </div>
      </div>
    </div>
  );
};
