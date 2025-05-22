import { Outlet } from 'react-router-dom';
import Studentcard from '../../components/St_Cart';


const TeacherPage = () => {
  return (
  <div className="flex-1 p-6">
    <Outlet/>
    <Studentcard />
  </div>

  );
};
export default TeacherPage;
