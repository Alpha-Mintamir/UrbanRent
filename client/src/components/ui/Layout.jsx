import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import Footer from './Footer';
import Home from '@/pages/Home';

const Layout = () => {
  return (
    <>
      <Header />
      <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col">
        <Home />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
