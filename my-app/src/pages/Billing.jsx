import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUserRoles, isAuthenticated } from '../utils/auth';
import { canEditBilling, canViewBilling, isAdmin } from '../utils/rbac';
import './Billing.css';

function Billing() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [note, setNote] = useState('Sample billing note');
  const navigate = useNavigate();

  const authenticated = isAuthenticated();
  const roles = getCurrentUserRoles();

  useEffect(() => {
    if (!authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  const admin = isAdmin(roles);
  const canEdit = canEditBilling(roles);
  const canView = canViewBilling(roles);

  const getMessage = () => {
    if (admin) return 'You are Admin. You can do anything in Billing.';
    if (canEdit) return 'You can access and edit the billing page only, nothing else.';
    if (canView) return 'You can access billing in view-only mode.';
    return 'You cannot access the billing page.';
  };

  return (
    <div className="billing-page-container">
      <Navbar onToggle={setSidebarCollapsed} />

      <div className={`billing-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="billing-content">
          <div className="billing-card">
            <h2>Billing Page</h2>
            <p>{getMessage()}</p>

            {canView ? (
              <textarea
                className="billing-editor"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={!canEdit}
              />
            ) : null}

            {canEdit ? <button className="billing-btn">Save Billing</button> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;
