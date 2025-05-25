import TeacherCart from '../../components/TeacherCart';
import StudentCard from '../../components/St_Cart';


const Dashboard = () => {
  return (
  <div className="flex-1 p-6">
    <TeacherCart />
    <StudentCard />
  </div>

  );
};
export default Dashboard;
