import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css'
import 'tailwind-scrollbar';


interface MenuItem {
  label: string;
  link: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [activeItem, setActiveItem] = useState<string>('');

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleItemClick = (path: string) => {
    setActiveItem(path);
    navigate(path);
  };

  return (
    <div className="w-[300px] bg-(--light-color) border-r border-gray-300 p-4 box-border poppins-regular mt-0.5">
      <div className='overflow-auto h-[calc(100vh-120px)] tailwind-custom-scrollbar'>
      {menuItems.map((item) => (
        <div key={item.link} className="mb-2">
              <div
                className={`flex items-center p-2 cursor-pointer rounded hover:bg-(--primary-color)/30 ${
                  activeItem === item.link ? 'bg-(--primary-color) text-(--light-color)' : 'text-(--text-color)/60'
                }`}
                onClick={() => {
                  item.children && toggleMenu(item.label);
                  handleItemClick(item.link);
                }}
              >
                <span className="pr-2">{item.icon}</span>
                {item.label}
                {item.children && (<span className="ml-auto text-xs">{openMenus[item.label] ? '▲' : '▼'}</span>)}
              </div>
              <div
                className={`ml-4 overflow-hidden transition-all duration-300 ${
                  openMenus[item.label] ? '' : 'max-h-0'
                }`}
              >
                {item.children?.map((child) => (
                  <div key={child.link}>
                    <div
                      className={`flex items-center p-2 cursor-pointer rounded hover:bg-(--primary-color)/90 ${
                        activeItem === child.link ? 'bg-(--primary-color) text-(--text-color)' : 'text-(--text-color)/60'
                      }`}
                      onClick={() => {
                        child.children && toggleMenu(child.label);
                        handleItemClick(child.link);
                      }}
                    >
                      <span className="pr-2">{child.icon}</span>
                      {child.label}
                      {child.children && (<span className="ml-auto text-xs">{openMenus[child.label] ? '▲' : '▼'}</span>)}
                    </div>
                    {child.children && (
                      <div
                        className={`ml-4 overflow-hidden transition-all duration-300 ${
                          openMenus[child.label] ? '' : 'max-h-0'
                        }`}
                      >
                        {child.children.map((subChild) => (
                          <div
                            key={subChild.link}
                            className={`flex items-center gap-2 p-2 rounded hover:bg-(--primary-color)/90 ${
                              activeItem === subChild.link ? 'bg-(--primary-color) text-(--text-color)' : 'text-gray-700'
                            }`}
                            onClick={() => handleItemClick(subChild.link)}
                          >
                            <span className="pr-2">{subChild.icon}</span>
                            {subChild.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Sidebar;
