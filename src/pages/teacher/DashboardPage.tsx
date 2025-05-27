import TeacherCart from '../../components/TeacherCart';
// import StudentCard from '../../components/St_Cart';
import StudentCardList from '../../components/StudentCardList';


const Dashboard = () => {
  return (
  <div className="flex-1 p-6">
    <TeacherCart />
    <StudentCardList />
  </div>

  );
};
export default Dashboard;
