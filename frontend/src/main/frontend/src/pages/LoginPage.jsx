import React from 'react';
import Login from '../components/LogIn';

const LoginPage = ({ setIsAuthenticated, setIsGuest }) => {
  const handleGoogleLogin = () => {
    window.location.href = 'blank for now, replace with endpoint';
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Login handleGoogleLogin={handleGoogleLogin} handleGuestLogin={handleGuestLogin} />
    </div>
  );
};

export default LoginPage;
