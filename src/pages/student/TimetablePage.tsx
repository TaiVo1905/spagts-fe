import { Calendar } from '../../components/calendar/Calendar';
import { TimetableProvider } from '../../store/TimetableContext';

const TimetablePage = () => {
  return (
    <div className="container mx-auto px-6 pt-8">
      <h1 className="text-3xl font-bold mb-3 pl-4">My Timetable</h1>
      <TimetableProvider>
        <Calendar />
      </TimetableProvider>
    </div>
  );
};

export default TimetablePage;