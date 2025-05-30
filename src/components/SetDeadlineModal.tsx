import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDeadlineSet: (datetime: string) => void;
}

const SetDeadlineModal: React.FC<Props> = ({ isOpen, onClose, onDeadlineSet }) => {
  const [datetime, setDatetime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (datetime) {
      onDeadlineSet(datetime);
      setDatetime('');
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 border-l-4 border-blue-500 pl-2">Set deadline for goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="datetime" className="block text-gray-700 text-sm font-bold mb-2">Select Date & Time</label>
            <input
              type="datetime-local"
              id="datetime"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Deadline
            </button>
            <button
              type="button"
              className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetDeadlineModal; 