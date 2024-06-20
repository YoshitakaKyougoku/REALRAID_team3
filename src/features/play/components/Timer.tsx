import React, { useState, useEffect } from "react";
import "../styles/Timer.css";

interface TimerProps {
  totalTime: number;
}

const Timer: React.FC<TimerProps> = ({ totalTime }) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progressWidth, setProgressWidth] = useState(100);
  const [progressBarClass, setProgressBarClass] = useState(
    "progress-bar progress-bar-info"
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      const newWidth = (timeLeft - 1) * (100 / totalTime);
      setProgressWidth(newWidth);

      if (newWidth < 20) {
        setProgressBarClass("progress-bar progress-bar-danger");
      } else if (newWidth < 50) {
        setProgressBarClass("progress-bar progress-bar-warning");
      } else {
        setProgressBarClass("progress-bar progress-bar-info");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, totalTime]);

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
