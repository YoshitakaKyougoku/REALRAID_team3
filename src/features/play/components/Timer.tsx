import React, { useState, useEffect, useContext } from "react";
import styles from "./Timer.module.css";
import { PlayContext } from "@/app/play/[id]/page";

interface TimerProps {
  totalTime: number;
}

const Timer: React.FC<TimerProps> = ({ totalTime }) => {
  const { isMyTurn, setIsMyTurn, sendMessage } = useContext(PlayContext);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progressWidth, setProgressWidth] = useState(100);
  const [progressBarClass, setProgressBarClass] = useState(
    styles.progressBarInfo
  );

  useEffect(() => {
    // 残り時間をリセット
    setTimeLeft(totalTime);
    setProgressWidth(100);
    setProgressBarClass(styles.progressBarInfo);
  }, [isMyTurn, totalTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      sendMessage();
      setIsMyTurn(false); // ターンが終わるのでフラグを下げる
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        const newWidth = (newTime / totalTime) * 100;

        setProgressWidth(newWidth);

        if (newWidth < 20) {
          setProgressBarClass(styles.progressBarDanger);
        } else if (newWidth < 50) {
          setProgressBarClass(styles.progressBarWarning);
        } else {
          setProgressBarClass(styles.progressBarInfo);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, totalTime, setIsMyTurn, sendMessage]);

  return (
    <div>
      <span className={styles.center}>
        残り{timeLeft > 0 ? timeLeft : "Over the time limit!"}秒
      </span>
      <div className={styles.progress}>
        <div
          className={`${styles.progressBar} ${progressBarClass}`}
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
