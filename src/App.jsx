import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const GRECalculatorTimerApp = () => {
  const [display, setDisplay] = useState("");
  const [memory, setMemory] = useState(0);

  // Timer States
  const [totalTime, setTotalTime] = useState(0); // Total time in minutes
  const [timerDuration, setTimerDuration] = useState(""); // Timer duration in seconds (empty initially)
  const [repeats, setRepeats] = useState(1);
  const [currentCount, setCurrentCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const audioRef = useRef(null);

  /** Utility to format seconds as mm:ss */
  const formatSeconds = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /** Timer Logic */
  /** Timer Logic */
  useEffect(() => {
    let timer;
  
    if (isRunning && currentCount > 0) {
      timer = setInterval(() => {
        setCurrentCount((prev) => prev - 1); // Decrease the count by 1 every second
      }, 1000);
    } else if (currentCount === 0 && isRunning) {
      // Stop the countdown when currentCount hits 0
      audioRef.current.play(); // Play beep sound when time reaches 00:00
  
      // Wait until the beep sound is played before resetting
      setTimeout(() => {
        if (repeatCount < repeats - 1) {
          setRepeatCount((prev) => prev + 1); // Increment repeat count
          setCurrentCount(timerDuration); // Reset timer for the next repeat
        } else {
          setIsRunning(false); // Stop the timer after the last repeat
        }
      }, 1000); // Delay the repeat count update for 1 second (to allow beep sound to play)
    }
  
    return () => clearInterval(timer); // Clean up the interval when component unmounts or when dependencies change
  }, [isRunning, currentCount, repeatCount, repeats, timerDuration]);
  
  /** Fix: Handle transitions correctly when the timer resets */
  useEffect(() => {
    if (currentCount === timerDuration && repeatCount > 0) {
      // Ensure the repeat count is updated when timer resets
      console.log(`Repeat ${repeatCount} completed`);
    }
  }, [currentCount, repeatCount, timerDuration]);
  
  const startTimer = () => {
    const totalSeconds = totalTime * 60; // Convert total time to seconds
    if (timerDuration > 0 && totalSeconds >= timerDuration * repeats) {
      setCurrentCount(timerDuration); // Start the timer with the initial duration
      setRepeatCount(0);
      setIsRunning(true);
    } else {
      alert("Ensure total time and timer duration are valid!");
    }
  };
  
  

  const stopTimer = () => setIsRunning(false);

  const handleTotalTimeChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setTotalTime(value);
  };

  const handleTimerDurationChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setTimerDuration(""); // Keep it empty if the field is cleared
    } else {
      setTimerDuration(parseInt(value, 10) || 0); // Ensure it stays a number or 0
    }
  };

  // Automatically update repeats when totalTime or timerDuration changes
  useEffect(() => {
    if (timerDuration > 0 && totalTime > 0) {
      setRepeats(Math.floor(totalTime * 60 / timerDuration)); // Calculate number of repeats
    }
  }, [totalTime, timerDuration]);

  const handleFocusClear = (setterFunction, value) => {
    setterFunction(value || ""); // Clear the value when the input is focused
  };

  // Add functionality for memory recall
  const recallMemory = () => {
    setDisplay(memory.toString());
  };

  // Calculate the square root
  const handleSquareRoot = () => {
    try {
      const result = Math.sqrt(parseFloat(display));
      setDisplay(result.toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  return (
    <div className="container">
      {/* Calculator Section */}
      <div className="section calculator">
        <h2>Calculator</h2>
        <div className="display">{display || "0"}</div>
        <div className="buttons">
          <button onClick={() => setMemory(0)}>MC</button>
          <button onClick={() => setDisplay("")}>CE</button>
          <button onClick={() => setMemory(memory + parseFloat(display || 0))}>
            M+
          </button>
          <button onClick={recallMemory}>MR</button> {/* MR Button */}
          <button onClick={() => setDisplay((prev) => prev + "/")}>÷</button>
          <button onClick={() => setDisplay((prev) => prev + "7")}>7</button>
          <button onClick={() => setDisplay((prev) => prev + "8")}>8</button>
          <button onClick={() => setDisplay((prev) => prev + "9")}>9</button>
          <button onClick={() => setDisplay((prev) => prev + "*")}>×</button>
          <button onClick={() => setDisplay((prev) => prev + "4")}>4</button>
          <button onClick={() => setDisplay((prev) => prev + "5")}>5</button>
          <button onClick={() => setDisplay((prev) => prev + "6")}>6</button>
          <button onClick={() => setDisplay((prev) => prev + "-")}>−</button>
          <button onClick={() => setDisplay((prev) => prev + "1")}>1</button>
          <button onClick={() => setDisplay((prev) => prev + "2")}>2</button>
          <button onClick={() => setDisplay((prev) => prev + "3")}>3</button>
          <button onClick={() => setDisplay((prev) => prev + "+")}>+</button>
          <button onClick={() => setDisplay((prev) => prev + "±")}>±</button>
          <button onClick={() => setDisplay((prev) => prev + "0")}>0</button>
          <button onClick={() => setDisplay((prev) => prev + ".")}>.</button>
          <button onClick={() => setDisplay(eval(display))}>=</button>
          <button onClick={() => setDisplay((prev) => prev + "(")}>(</button> {/* Left Bracket */}
          <button onClick={() => setDisplay((prev) => prev + ")")}>)</button> {/* Right Bracket */}
          <button onClick={handleSquareRoot}>√</button> {/* Square Root Button */}
        </div>
      </div>

      {/* Timer Section */}
      <div className="section timer">
        <h2>Timer</h2>
        <label>
          Total Time (minutes):
          <input
            type="number"
            placeholder="Enter total time in minutes"
            value={totalTime}
            onChange={handleTotalTimeChange}
            onFocus={() => handleFocusClear(setTotalTime, totalTime)}
            min="0"
          />
        </label>
        <label>
          Timer Duration (seconds):
          <input
            type="number"
            value={timerDuration || ""} // Ensure the value is empty when cleared
            onChange={handleTimerDurationChange}
            onFocus={() => handleFocusClear(setTimerDuration, timerDuration)}
            min="1"
          />
        </label>
        <label>
          Repeats:
          <input
            type="number"
            value={repeats}
            onChange={(e) => setRepeats(parseInt(e.target.value, 10) || 1)}
            min="1"
          />
        </label>
        <button onClick={startTimer} disabled={isRunning}>
          Start Timer
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          Stop Timer
        </button>
        <div className="timer-info">
          Remaining Time: {formatSeconds(currentCount)}
          <br />
          Repeat Count: {repeatCount}/{repeats}
        </div>
        <audio ref={audioRef} src="GRE Calculator and Timer\public\sound\BEEP__Beep_sound_effect_(256k).mp3" />
      </div>
    </div>
  );
};

export default GRECalculatorTimerApp;
