// src/pages/TimetablePage.tsx
import { Calendar } from '../../components/calendar/Calendar';
import { Toaster } from 'react-hot-toast';
import { TimetableProvider } from '../../store/TimetableContext';

const TimetablePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-3">My Timetable</h1>
      <TimetableProvider>
        <Calendar />
      </TimetableProvider>
      <Toaster position="top-right" />
    </div>
  );
};

export default TimetablePage;