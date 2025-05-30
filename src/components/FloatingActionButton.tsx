import React, { useState } from 'react';
import { FaPlus, FaBook, FaClock } from 'react-icons/fa';

interface Props {
  onAddSubjectClick: () => void;
  onSetDeadlineClick: () => void;
}

const FloatingActionButton: React.FC<Props> = ({ onAddSubjectClick, onSetDeadlineClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 flex flex-col items-end"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {isOpen && (
        <button
          className="p-3 bg-blue-500 text-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110"
          onClick={onAddSubjectClick}
          style={{ transitionDelay: '50ms' }}
        >
          <FaBook size={20} />
        </button>
      )}
      {isOpen && (
        <button
          className="mr-16 p-3 bg-green-500 text-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110"
          onClick={onSetDeadlineClick}
          style={{ transitionDelay: '100ms' }}
        >
          <FaClock size={20} />
        </button>
      )}
      <button
        className="p-4 bg-cyan-500 text-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out hover:rotate-45"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaPlus size={24} />
      </button>
    </div>
  );
};

export default FloatingActionButton; 