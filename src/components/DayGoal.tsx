import React, { useState } from 'react';
import Button from './Button';

const DayGoal: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dayGoals, setDayGoals] = useState([
    '07/04 - 12/04/2025',
    '07/04 - 12/04/2025',
    '07/04 - 12/04/2025',
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  const handleAddDayGoal = () => {
    if (newGoal.trim()) {
      setDayGoals([...dayGoals, newGoal.trim()]);
      setNewGoal('');
      setIsAdding(false);
    }
  };

  return (
    <div className="pl-8  ml-5 my-2 border border-[#ccc] rounded-lg shadow w-[70%]">
      <div 
        className="flex gap-10 p-4 overflow-x-auto"
        style={{
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
        }}
      >
        <style>
          {`
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {dayGoals.map((text, index) => (
          <Button
            key={index}
            text={text}
            onClick={() => setSelectedIndex(index)}
            className={`flex-shrink-0 w-[225px] h-[48px] rounded-[10px] text-xl ${
              selectedIndex === index
                ? 'bg-[#21BAEA] text-white border border-[#21BAEA]'
                : 'bg-white text-black border border-[#ccc] hover:bg-gray-100 text-xl'
            }`}
          />
        ))}

        {isAdding ? (
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onBlur={handleAddDayGoal}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddDayGoal();
            }}
            autoFocus
            className="flex-shrink-0 w-[225px] h-[48px] px-2 border border-[#ccc] rounded-[10px]"
            placeholder="New DayGoal"
          />
        ) : (
          <Button
            text="+"
            onClick={() => setIsAdding(true)}
            className="flex-shrink-0 w-[48px] h-[48px] px-0 bg-white text-[#999] border-[#ccc] hover:bg-gray-100"
          />
        )}
      </div>
    </div>
  );
};

export default DayGoal;