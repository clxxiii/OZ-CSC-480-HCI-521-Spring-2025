import { IoMdClose } from "react-icons/io";
import NotificationItem from "./Notification";

const NotificationDropdown = ({ isVisible, notifications, onRemoveNotification, onClearAll }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '50px', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      width: '250px',
      backgroundColor: 'white', 
      color: 'black', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      zIndex: 1050, 
      maxHeight: '300px', 
      overflowY: notifications.length > 3 ? 'auto' : 'visible', 
      height: notifications.length <= 3 ? 'auto' : '300px', 
    }}>

      {notifications.length === 0 ? (
        <div style={{
          padding: '4px',
          textAlign: 'center',
          color: '#888',
          fontSize: '12px',
          lineHeight: '20px'
        }}>
            
          No new notifications
        </div>
      ) : (
        <>
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={{...notification, isLast: index === notifications.length - 1 }}
              onRemove={() => onRemoveNotification(index)}
            />
          ))}
          
            {/* Clear All Button */}
          <div style={{ padding: '8px', textAlign: 'center' }}>
            <button
              onClick={onClearAll}
              style={{
                background: '#28a745', 
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px', 
                borderRadius: '20px',
                padding: '0px 30px', 
              }}
            >
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
