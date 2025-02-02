import { FC, useState, useEffect } from "react";
import styles from "./Timer.module.css";

interface TimerProps {
  totalTime: number;
  sendMessage: () => void;
}

const Timer: FC<TimerProps> = ({ totalTime, sendMessage }) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progressHeight, setProgressHeight] = useState(100);
  const [progressBarClass, setProgressBarClass] = useState(
    styles.progressBarInfo
  );

  useEffect(() => {
    // 残り時間をリセット
    setTimeLeft(totalTime);
    setProgressHeight(100);
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
        const newHeight = (newTime / totalTime) * 100;

        setProgressHeight(newHeight);

        if (newHeight < 20) {
          setProgressBarClass(styles.progressBarDanger);
        } else if (newHeight < 50) {
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
    <div className={styles.center}>
      <div className={styles.progress}>
        <div
          className={`${styles.progressBar} ${progressBarClass}`}
          style={{ height: `${progressHeight}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
