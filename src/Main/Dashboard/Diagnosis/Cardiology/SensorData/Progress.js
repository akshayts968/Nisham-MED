import React, { useState, useEffect } from "react";

const ProgressRing = () => {
  const [progress, setProgress] = useState(0);

  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value += 1;
      setProgress(value);

      if (value >= 100) clearInterval(interval);
    }, 50);

  }, []);

  return (
    <div style={styles.wrapper}>
      <svg height={radius * 2} width={radius * 2}>

        {/* Background Circle */}
        <circle
          stroke="#2a2a2a"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress Circle */}
        <circle
          stroke="#ffd400"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.3s"
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

      </svg>

      <div style={styles.text}>
        <h1>{progress}%</h1>
        <p>ECG</p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "140px",
    height: "140px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#2f2f2f",
    borderRadius: "50%",
    boxShadow: "0 10px 20px rgba(0,0,0,0.4)"
  },
  text: {
    position: "absolute",
    textAlign: "center",
    color: "#ffd400"
  }
};

export default ProgressRing;