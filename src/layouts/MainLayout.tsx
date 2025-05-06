import React from 'react';

interface Props {
    Header: React.ReactNode,
    Sidebar: React.ReactNode,
    Content: React.ReactNode
}
const MainLayout: React.FC<Props> = ({Header, Sidebar, Content}) => {
    return (
        <>
            {Header}
            <div className='flex'>
                {Sidebar}
                {Content}
            </div>
        </>
    );
};

export default MainLayout;