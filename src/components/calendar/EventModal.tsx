import { forwardRef, useEffect, useState } from 'react';

interface Event {
  id?: number;
  title: string;
  description?: string;
  start: Date | string;
  end: Date | string;
  allDay: boolean;
  color?: string;
}

interface EventModalProps {
  event: Event | null;
  onSave: (event: Event) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onClose: () => void;
}

export const EventModal = forwardRef<HTMLDialogElement, EventModalProps>(
  ({ event, onSave, onDelete, onClose }, ref) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<Event>({
      title: '',
      description: '',
      start: new Date(),
      end: new Date(),
      allDay: false,
      color: '#3b82f6',
    });
    const validate = () => {
  const newErrors: { [key: string]: string } = {};
  if (!formData.title.trim()) newErrors.title = 'Title is required';
  if (!formData.start) newErrors.start = 'Start time is required';
  if (!formData.end) newErrors.end = 'End time is required';
  if (formData.start && formData.end && (new Date(formData.end)) < (new Date(formData.start))) {
    console.log((new Date(formData.end)), (new Date(formData.start)))
    newErrors.end = 'End time must be after start time';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

    const formatDateForInput = (date: Date | string | undefined | null) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  // Convert to local time for input
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localISO = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  return localISO;
};

useEffect(() => {
  if (event) {
    setFormData({
      id: event.id,
      title: event.title,
      description: event.description || '',
      start: event.start ? new Date(event.start) : new Date(),
      end: event.end ? new Date(event.end) : new Date(event.start ? new Date(event.start).getTime() + 60 * 60 * 1000 : Date.now() + 60 * 60 * 1000),
      allDay: event.allDay,
      color: event.color || '#3b82f6',
    });
  }
}, [event]);

const parseLocalDateTime = (value: string) => {
  // value: '2025-05-08T00:00'
  const [date, time] = value.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  const checked = (e.target as HTMLInputElement).checked;

  if (name === 'start' || name === 'end') {
    setFormData({
      ...formData,
      [name]: parseLocalDateTime(value),
    });
  } else {
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  }
};

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
  await onSave(formData);
};

    return (
      <dialog ref={ref} className="modal">
        <div className="fixed inset-0 bg-(--text-color)50 flex items-center justify-center z-50"
          onClick={(e) => (e.target === e.currentTarget) && onClose()}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {event?.id ? 'Edit Event' : 'Create Event'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start</label>
                  <input
                    type="datetime-local"
                    name="start"
                    value={formatDateForInput(formData.start)}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.start ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.start && <p className="text-red-500 text-xs mt-1">{errors.start}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End</label>
                  <input
                    type="datetime-local"
                    name="end"
                    value={formatDateForInput(formData.end)}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.end ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.end && <p className="text-red-500 text-xs mt-1">{errors.end}</p>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="allDay"
                  checked={formData.allDay}
                  onChange={handleChange}
                  className="accent-blue-500"
                />
                <label className="text-sm font-medium">All Day Event</label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="#3b82f6">Blue</option>
                  <option value="#ef4444">Red</option>
                  <option value="#10b981">Green</option>
                  <option value="#f59e0b">Yellow</option>
                  <option value="#8b5cf6">Purple</option>
                </select>
              </div>
              <div className="flex justify-between items-center mt-4">
                {event?.id && onDelete && (
                  <button
                    type="button"
                    onClick={() => event?.id && onDelete(event.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    {event?.id ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </dialog>)
  }
);