import { FaTh, FaChalkboardTeacher, FaUser, FaQuestionCircle } from "react-icons/fa";

const menuItems = [
    { label: 'Dashboard', link: '/dashboard', icon: <FaTh /> },
    { label: 'Users', link: '/users', icon: <FaUser /> },
    { label: 'Classes', link: '/classes', icon: <FaChalkboardTeacher /> },
    { label: 'Q&A', link: '/Q&A', icon: <FaQuestionCircle /> },
];

export default menuItems;