import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { Toaster } from 'react-hot-toast';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex relative">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#FFFFFF',
            color: '#1C1917',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '10px',
            padding: '12px 18px',
            border: '1px solid #EAE8E4',
            boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
          },
          success: {
            iconTheme: {
              primary: '#15803D',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#BE123C',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 z-10">
        <Navbar setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
