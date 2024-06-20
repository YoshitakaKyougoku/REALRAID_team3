import React, { useState, useEffect, useContext } from "react";
import "../styles/Timer.css";
import { PlayContext } from "@/app/play/[id]/page";

interface TimerProps {
  totalTime: number;
}

const Timer: React.FC<TimerProps> = ({ totalTime }) => {
  const { isMyTurn, setIsMyTurn, sendMessage } = useContext(PlayContext);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progressWidth, setProgressWidth] = useState(100);
  const [progressBarClass, setProgressBarClass] = useState(
    "progress-bar progress-bar-info"
  );

  useEffect(() => {
    // 残り時間をリセット
    setTimeLeft(totalTime);
    setProgressWidth(100);
    setProgressBarClass("progress-bar progress-bar-info");
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
          setProgressBarClass("progress-bar progress-bar-danger");
        } else if (newWidth < 50) {
          setProgressBarClass("progress-bar progress-bar-warning");
        } else {
          setProgressBarClass("progress-bar progress-bar-info");
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, totalTime, setIsMyTurn, sendMessage]);

  return (
    <div>
      <h4>
        <span>{timeLeft > 0 ? timeLeft : "Over the time limit!"}</span> seconds
        left.
      </h4>
      <div className="progress">
        <div
          className={progressBarClass}
          style={{ width: `${progressWidth}%`, transition: "width 1s linear" }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
