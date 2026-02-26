import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUserRoles, isAuthenticated } from '../utils/auth';
import { canEditFinance, canViewFinance, isAdmin } from '../utils/rbac';
import './Finance.css';

function Finance() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [note, setNote] = useState('Sample finance note');
  const navigate = useNavigate();

  const authenticated = isAuthenticated();
  const roles = getCurrentUserRoles();

  useEffect(() => {
    if (!authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  const admin = isAdmin(roles);
  const canEdit = canEditFinance(roles);
  const canView = canViewFinance(roles);

  const getMessage = () => {
    if (admin) return 'You are Admin. You can do anything in Finance.';
    if (canEdit) return 'You can access and edit the finance page only, nothing else.';
    if (canView) return 'You can access finance in view-only mode.';
    return 'You cannot access the finance page.';
  };

  return (
    <div className="finance-page-container">
      <Navbar onToggle={setSidebarCollapsed} />

      <div className={`finance-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="finance-content">
          <div className="finance-card">
            <h2>Finance Page</h2>
            <p>{getMessage()}</p>

            {canView ? (
              <textarea
                className="finance-editor"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={!canEdit}
              />
            ) : null}

            {canEdit ? <button className="finance-btn">Save Finance</button> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finance;
