import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCurrentUserRoles, logout } from '../utils/auth';
import { canViewBilling, canViewFinance, isAdmin } from '../utils/rbac';
import './Navbar.css';

function Navbar({ onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const currentUserRoles = getCurrentUserRoles();
  const showBilling = canViewBilling(currentUserRoles);
  const showFinance = canViewFinance(currentUserRoles);
  const showRolesPage = isAdmin(currentUserRoles);

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

        {showBilling && (
          <NavLink
            to="/billing"
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon">₹</span>
            {!isCollapsed && <span>Billing</span>}
          </NavLink>
        )}

        {showFinance && (
          <NavLink
            to="/finance"
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon">💰</span>
            {!isCollapsed && <span>Finance</span>}
          </NavLink>
        )}

        {showRolesPage && (
          <NavLink
            to="/roles"
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon">🛡️</span>
            {!isCollapsed && <span>Roles</span>}
          </NavLink>
        )}
      </div>

      <div className="sidebar-footer">
        <NavLink
          to="/profile"
          title="Profile"
          className={({ isActive }) => `profile-short-btn ${isActive ? 'active' : ''}`}
        >
          <span className="icon">👤</span>
          {!isCollapsed && <span>Profile</span>}
        </NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">⏻</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
