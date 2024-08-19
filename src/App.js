import React, { useState, useEffect } from 'react';
import './Clock.css';

const App = () => {
  const [time, setTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [hour, setHour] = useState(time.getHours() % 12 || 12);
  const [minute, setMinute] = useState(time.getMinutes());
  const [second, setSecond] = useState(time.getSeconds());
  const [ampm, setAmpm] = useState(time.getHours() >= 12 ? 'PM' : 'AM');

  useEffect(() => {
    const savedTime = localStorage.getItem('savedTime');
    const savedTimestamp = localStorage.getItem('savedTimestamp');
    if (savedTime && savedTimestamp) {
      const savedDate = new Date(JSON.parse(savedTime));
      const savedTimestampDate = new Date(JSON.parse(savedTimestamp));
      const now = new Date();

      const timeDifference = now - savedTimestampDate;

       const adjustedTime = new Date(savedDate.getTime() + timeDifference);
      setTime(adjustedTime);

      setHour(adjustedTime.getHours() % 12 || 12);
      setMinute(adjustedTime.getMinutes());
      setSecond(adjustedTime.getSeconds());
      setAmpm(adjustedTime.getHours() >= 12 ? 'PM' : 'AM');
    }
  }, []);

  useEffect(() => {
    if (!isEditing) {
      const timerId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = new Date(prevTime.getTime() + 1000);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [isEditing]);

  const handleSetTime = () => {
    const newTime = new Date();
    const hours24 = ampm === 'PM' ? hour % 12 + 12 : hour % 12;
    newTime.setHours(hours24, minute, second);
    setTime(newTime);

    localStorage.setItem('savedTime', JSON.stringify(newTime));
    localStorage.setItem('savedTimestamp', JSON.stringify(new Date()));

    setIsEditing(false);
  };

  const handleEditTime = () => {
    setIsEditing(true);
  };

  const formatTime = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <div className="clock-container">
      <h1 className="clock-display">
        {formatTime(time.getHours() % 12 || 12)}:
        {formatTime(time.getMinutes())}:
        {formatTime(time.getSeconds())} {time.getHours() >= 12 ? 'PM' : 'AM'}
      </h1>
      {!isEditing && (
        <div className="clock-controls">
          <button onClick={handleEditTime}>Set Time</button>
        </div>
      )}
      {isEditing && (
        <div className="input-group">
          <input
            type="number"
            value={hour}
            onChange={(e) => setHour(Number(e.target.value) % 12 || 12)}
            min="1"
            max="12"
          />{' '}
          :{' '}
          <input
            type="number"
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value) % 60)}
            min="0"
            max="59"
          />{' '}
          :{' '}
          <input
            type="number"
            value={second}
            onChange={(e) => setSecond(Number(e.target.value) % 60)}
            min="0"
            max="59"
          />
          <select
            value={ampm}
            onChange={(e) => setAmpm(e.target.value)}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
          <div className="clock-controls">
            <button onClick={handleSetTime}>Start Clock</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
