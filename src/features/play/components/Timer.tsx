import React, { useState, useEffect, useContext } from "react";
import styles from "./Timer.module.css";

interface TimerProps {
  userName: string | null;
  totalTime: number;
  sendMessage: () => void;
}

const Timer: React.FC<TimerProps> = ({ userName, totalTime, sendMessage }) => {
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
  }, [totalTime]);

  useEffect(() => {
    console.log("timeLeft", timeLeft);
    if (timeLeft === 0) {
      console.log("timeLeft === 0");
      sendMessage();
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
  }, [timeLeft, totalTime, sendMessage]);

  return (
    <div>
      <span className={styles.center}>
        {userName} のターンです
        <br />
        残り {timeLeft > 0 ? timeLeft : "時間切れ"} 秒
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
