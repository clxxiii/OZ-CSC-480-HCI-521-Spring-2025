import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import QuoteUploadModal from "./QuoteUploadModal";
import { BsPersonCircle } from "react-icons/bs";
import '../TopNav.css';
import { UserContext } from "../lib/Contexts";
import logo from "../assets/logo.png"; 
import NotificationDropdown from "./NotificationDropdown";
import Input from "../components/Input";


const SearchNavigation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quoteText, setQuoteText] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useContext(UserContext);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleFetchNotifications = async () => {
    if (user && user.id) {
      try {
        const fetchedNotifications = await fetchNotifications(user.id);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
  };
  
  const handleRemoveNotification = async (index) => {
    try {
      const notificationId = notifications[index]._id;
      await deleteNotification(notificationId);
      setNotifications((prevNotifications) => prevNotifications.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to remove notification:", error);
    }
  };

  const handleClearAllNotifications = async () => {
    if (user && user.id) {
      try {
        await clearAllNotifications(user.id);
        setNotifications([]);
      } catch (error) {
        console.error("Failed to clear all notifications:", error);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); 
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light sticky-top custom-nav"
        style={{ backgroundColor: "#D6F0C2" }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Logo" style={{ height: "40px" }} />
          </Link>
<form
  onSubmit={handleSearchSubmit}
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    position: "relative", 
    maxWidth: "25vw",
  }}
>
  <Input
    type="text"
    placeholder="      Search by tag, author, or keyword..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="form-control"
    style={{
      height: "40px",
      fontSize: "12px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      maxWidth: "110px",
    }}
  />
  {!searchTerm && ( 
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-search"
      viewBox="0 0 16 16"
      style={{
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#888",
      }}
    >
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
    </svg>
  )}
</form>


          <div>
            <ul className="navbar-nav ml-auto">
              <li className={`nav-item ${isActive("/") ? "active" : ""}`}>
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className={`nav-item ${isActive("/add-quote") ? "active" : ""}`}>
                <span
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Quote
                </span>
              </li>
              {user ? (
                <li className={`nav-item ${isActive("/my-collection") ? "active" : ""}`}>
                  <Link className="nav-link" to="/my-collection">
                    My Collection
                  </Link>
                </li>
              ) : (
                <></>
              )}
              {user && user.admin === 1 && (
                <li className={`nav-item ${isActive("/admin") ? "active" : ""}`}>
                  <Link className="nav-link" to="/admin">
                    Admin Panel
                  </Link>
                </li>
              )}
              {!user ? (
                <li className="nav-item">
                  <button className="btn btn-dark" onClick={() => navigate("/login")}>
                    Sign in
                  </button>
                </li>
              ) : (
                <></>
              )}
              <li
                className="nav-item ml-3 mr-3"
                style={{ position: "relative" }}
                title={user?.Username || "Click sign in to sign in"}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    if (!isNotificationOpen) handleFetchNotifications();
                  }}
                >
                  {user && <BsPersonCircle size={40} style={{ color: "#146C43" }} />}

                  {/* Notification Dot */}
                  {notifications.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "-5px",
                        minWidth: "24px",
                        height: "24px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        border: "2px solid white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        padding: "2px",
                        lineHeight: 1,
                      }}
                    >
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                  )}
                </div>

                {/* Notification Dropdown */}
                <NotificationDropdown
                  isVisible={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  notifications={notifications}
                  onRemoveNotification={handleRemoveNotification}
                  onClearAll={handleClearAllNotifications}
                />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <QuoteUploadModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => setIsModalOpen(false)} 
        quoteText={quoteText}
        setQuoteText={setQuoteText}
      />
    </>
  );
};

export default SearchNavigation;