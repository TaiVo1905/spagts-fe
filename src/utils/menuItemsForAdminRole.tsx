import { FaTh, FaChalkboardTeacher, FaUser, FaQuestionCircle } from "react-icons/fa";

const menuItems = [
    { label: 'Dashboard', link: '/admin/dashboard', icon: <FaTh /> },
    { label: 'Users', link: '/admin/user-management', icon: <FaUser /> },
    { label: 'Classes', link: '/admin/class-management', icon: <FaChalkboardTeacher /> },
    { label: 'Q&A', link: './Q&A', icon: <FaQuestionCircle /> },
];

export default menuItems;