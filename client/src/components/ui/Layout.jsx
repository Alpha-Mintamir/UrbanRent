import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from './Header';

const Layout = () => {
  const location = useLocation();
  
  return (
    <>
      <Header />
      <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col pt-20">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
