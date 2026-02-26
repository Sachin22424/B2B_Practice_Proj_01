import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUserProfile, isAuthenticated } from '../utils/auth';
import { isSuperAdminUser } from '../utils/rbac';
import './Profile.css';

function Profile() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const profile = getCurrentUserProfile();
  const isSuperAdmin = isSuperAdminUser(profile.memberId);

  const initials = useMemo(() => {
    return (profile.name || 'U')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }, [profile.name]);

  return (
    <div className="profile-page-container">
      <Navbar onToggle={setSidebarCollapsed} />

      <div className={`profile-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="profile-content">
          <div className="profile-card-page">
            <div className="profile-avatar-large">{initials || 'U'}</div>
            <h2>{profile.name}</h2>
            {isSuperAdmin && <div className="super-admin-badge">Super Admin</div>}
            <p><strong>Member ID:</strong> {profile.memberId}</p>
            <p><strong>Roles:</strong> {profile.roles.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
