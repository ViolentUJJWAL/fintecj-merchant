import React, { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format

      setTime(`${hours}:${minutes}:${seconds} ${amPm}`);
      setDate(`${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`);
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Run immediately on mount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-end bg-gradient-to-r border-b-white text-white">
      <div className="text-center m-3">
        <div className="text-[14px] text-white text-right font-extralight mb-1">{time}</div>
        <div className="text-white font-thin text-[12px] mb-1">{date}</div>
      </div>
    </div>
  );
};

export default Timer;
