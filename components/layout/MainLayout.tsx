
import React, { useState, ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar.tsx'; // Added .tsx extension

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#FFF1F5]">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FFF1F5] p-6 md:p-8">
          {children}
           {/* Placeholder for real-time chat support button removed
            <button
                title="Chat Support"
                className="fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
                <i className="fas fa-comments text-2xl"></i>
            </button>
            */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;