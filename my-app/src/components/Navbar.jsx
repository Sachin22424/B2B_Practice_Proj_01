import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import './Navbar.css';

function Navbar({ onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        {!isCollapsed && <h2>B2B System</h2>}
      </div>

      <div className="sidebar-menu">
        <NavLink
          to="/members"
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon">▤</span>
          {!isCollapsed && <span>Members</span>}
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">⏻</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
