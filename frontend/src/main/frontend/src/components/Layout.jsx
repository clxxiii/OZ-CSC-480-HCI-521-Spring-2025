import { useContext, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import SearchNavigation from './SearchNavigation';
import LoginBox from './Login';
import AlertMessage from './AlertMessage';
import { AlertContext } from '../lib/Contexts';

const Layout = () => {
  const [showLogin, setShowLogin] = useState(null); //track whether to show the login modal
  const [alert] = useContext(AlertContext);
  const location = useLocation();

  const handleGoogleLogin = () => {
    //redirect user to the Google login page
    const PROXY_URL = import.meta.env.VITE_PROXY_URL || "http://localhost:9083"; 
    window.location.href = `${PROXY_URL}/users/auth/login`;
  };

  const handleGuestLogin = () => {
    //hide the login modal when user chooses to continue as a guest
    setShowLogin(false);
  };

  const isLandingPage = location.pathname === "/"; 

  return (
    <div className="container">
      {isLandingPage ? <TopNavigation /> : <SearchNavigation />} 

      {alert && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4" style={{ zIndex: 1050 }}>
          <AlertMessage autoDismiss={true} />
        </div>
      )}

      <main>
        {showLogin && (
          //display the login modal if user needs to log in
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}>
              <LoginBox handleGoogleLogin={handleGoogleLogin} handleGuestLogin={handleGuestLogin}   />   
          </div>
        )}

        <Outlet /> {/* render the appropriate page content based on the current route */}
      </main>
    </div>
  );
};

export default Layout; //export the Layout component for use in the app
