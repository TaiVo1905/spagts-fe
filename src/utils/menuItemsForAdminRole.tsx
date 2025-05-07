import { FaTh, FaChalkboardTeacher, FaUser, FaQuestionCircle } from "react-icons/fa";

const menuItems = [
    { label: 'Dashboard', link: '/admin', icon: <FaTh /> },
    { label: 'Users', link: './user-management', icon: <FaUser /> },
    { label: 'Classes', link: './class-management', icon: <FaChalkboardTeacher /> },
    { label: 'Q&A', link: './Q&A', icon: <FaQuestionCircle /> },
];

export default menuItems;