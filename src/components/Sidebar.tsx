import React, { useState } from 'react';
import '../styles/App.css'


interface MenuItem {
  label: string;
  link?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [activeItem, setActiveItem] = useState<string>('');

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleItemClick = (label: string) => {
    setActiveItem(label);
  };

  return (
    <div className="w-[300px] bg-white border-r border-gray-300 h-screen p-4 box-border font-poppins text-base">
      {menuItems.map((item) => (
        <div key={item.label} className="mb-2">
          {item.children ? (
            <>
              <div
                className={`flex items-center p-2 cursor-pointer rounded hover:bg-gray-100 ${
                  activeItem === item.label ? 'bg-[#21BAEA] text-white' : 'text-gray-800'
                }`}
                onClick={() => {
                  toggleMenu(item.label);
                  handleItemClick(item.label);
                }}
              >
                <span className="pr-2">{item.icon}</span>
                {item.label}
                <span className="ml-auto text-xs">{openMenus[item.label] ? '▲' : '▼'}</span>
              </div>
              <div
                className={`ml-4 overflow-hidden transition-all duration-300 ${
                  openMenus[item.label] ? 'max-h-[500px]' : 'max-h-0'
                }`}
              >
                {item.children.map((child) => (
                  <div key={child.label}>
                    <div
                      className={`flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-gray-100 ${
                        activeItem === child.label ? 'bg-[#21BAEA] text-white' : 'text-gray-700'
                      }`}
                      onClick={() => handleItemClick(child.label)}
                    >
                      <span className="pr-2">{child.icon}</span>
                      {child.label}
                    </div>
                    {child.children && (
                      <div
                        className={`ml-4 overflow-hidden transition-all duration-300 ${
                          openMenus[child.label] ? 'max-h-[500px]' : 'max-h-0'
                        }`}
                      >
                        {child.children.map((subChild) => (
                          <a
                            key={subChild.label}
                            href={subChild.link}
                            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 ${
                              activeItem === subChild.label ? 'bg-[#21BAEA] text-white' : 'text-gray-700'
                            }`}
                            onClick={() => handleItemClick(subChild.label)}
                          >
                            <span className="pr-2">{subChild.icon}</span>
                            {subChild.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <a
              href={item.link}
              className={`flex items-center p-2 cursor-pointer rounded hover:bg-gray-100 ${
                activeItem === item.label ? 'bg-[#21BAEA] text-white' : 'text-gray-800'
              }`}
              onClick={() => handleItemClick(item.label)}
            >
              <span className="pr-2">{item.icon}</span>
              {item.label}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
