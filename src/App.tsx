import './styles/App.css'
import { BrowserRouter } from "react-router-dom";
// import ClassManagement from './pages/ClassManagement.tsx';
import UserManagementPage from './pages/UserManagement.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <UserManagementPage/>
    </BrowserRouter>
  );
}

export default App;