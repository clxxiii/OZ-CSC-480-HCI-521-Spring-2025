import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import LoginBox from './Login';
import Footer from './Footer';
import { AlertContext } from '../lib/Contexts';
import AlertMessage from './AlertMessage';
import { useContext, useState } from 'react';

const Layout = () => {
  const [showLogin, setShowLogin] = useState(null); //track whether to show the login modal
  const [showFooter, setShowFooter] = useState(true); // Track whether to show the footer

  const [alert] = useContext(AlertContext);

  const handleGoogleLogin = () => {
    //redirect user to the Google login page
    const PROXY_URL = import.meta.env.VITE_PROXY_URL || "http://localhost:9083"; 
    window.location.href = `${PROXY_URL}/users/auth/login`;
  };

  const handleGuestLogin = () => {
    //hide the login modal when user chooses to continue as a guest
    setShowLogin(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight;
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
      setShowFooter(!isScrollable || isAtBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container">
      <TopNavigation /> {/* display the top navigation bar with user data */}

      {alert && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4" style={{ zIndex: 1050 }}>
          <AlertMessage autoDismiss={true} />
        </div>
      )}

      <main>
        {showLogin && (
          // Display the login modal if user needs to log in
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
          >
            <LoginBox
              handleGoogleLogin={handleGoogleLogin}
              handleGuestLogin={handleGuestLogin}
            />
          </div>
        )}

        <Footer isVisible={showFooter} /> {/* Display the footer if conditions are met */}

        <Outlet /> {/* Render the appropriate page content based on the current route */}
      </main>
      {showFooter && <Footer />} {/* Conditionally display the footer */}
    </div>
  );
};

export default Layout; //export the Layout component for use in the app