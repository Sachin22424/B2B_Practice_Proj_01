import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUserProfile, getCurrentUserRoles, isAuthenticated } from '../utils/auth';
import { canModifyAdminRole, isAdmin, ROLE_OPTIONS, ROLES } from '../utils/rbac';
import { useMembers } from '../hooks/useMembers';
import './Roles.css';

function Roles() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [infoMessage, setInfoMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const navigate = useNavigate();

  const authenticated = isAuthenticated();
  const currentRoles = getCurrentUserRoles();
  const currentProfile = getCurrentUserProfile();
  const admin = isAdmin(currentRoles);
  const superAdmin = canModifyAdminRole(currentProfile.memberId);

  const {
    members,
    totalRows,
    loading,
    error,
    updateMember,
  } = useMembers({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    search: debouncedSearchTerm,
    enabled: authenticated && admin,
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 400);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    if (!authenticated) {
      navigate('/');
      return;
    }

    if (!admin) {
      navigate('/members');
    }
  }, [admin, authenticated, navigate]);

  const handleAssignRoles = useCallback(async (member, roles) => {
    if (!admin) return;

    const nextRoles = roles.length > 0 ? roles : ['AUDITOR'];
    const currentMemberRoles = Array.isArray(member.roles) && member.roles.length > 0
      ? member.roles
      : ['AUDITOR'];

    const adminRoleChanged = currentMemberRoles.includes(ROLES.ADMIN) !== nextRoles.includes(ROLES.ADMIN);
    if (adminRoleChanged && !superAdmin) {
      setInfoMessage('Only Super Admin (B2B-001) can add or remove ADMIN role.');
      return;
    }

    setInfoMessage('');

    await updateMember(member.id, {
      name: member.name,
      memberId: member.memberId,
      email: member.email,
      activeFrom: member.activeFrom,
      activeTill: member.activeTill,
      status: member.status,
      roles: nextRoles,
    });
  }, [admin, superAdmin, updateMember]);

  const handleOpenRoleDialog = useCallback((member) => {
    if (!admin) return;

    const currentMemberRoles = Array.isArray(member.roles) && member.roles.length > 0
      ? member.roles
      : ['AUDITOR'];

    setSelectedMember(member);
    setSelectedRoles(currentMemberRoles);
    setInfoMessage('');
    setDialogOpen(true);
  }, [admin]);

  const handleToggleDialogRole = useCallback((role, checked) => {
    if (!superAdmin && role === ROLES.ADMIN) {
      return;
    }

    setSelectedRoles((prev) => {
      if (checked) {
        return prev.includes(role) ? prev : [...prev, role];
      }
      return prev.filter((existingRole) => existingRole !== role);
    });
  }, [superAdmin]);

  const handleSaveRoleDialog = useCallback(async () => {
    if (!selectedMember) return;

    await handleAssignRoles(selectedMember, selectedRoles);
    setDialogOpen(false);
    setSelectedMember(null);
    setSelectedRoles([]);
  }, [handleAssignRoles, selectedMember, selectedRoles]);

  const columns = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 1.4, minWidth: 180 },
      { field: 'memberId', headerName: 'Member ID', flex: 1, minWidth: 140 },
      {
        field: 'roles',
        headerName: 'Roles',
        flex: 1.8,
        minWidth: 260,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const roleValues = Array.isArray(params.row.roles) && params.row.roles.length > 0
            ? params.row.roles
            : ['AUDITOR'];

          return (
            <div className="roles-row">
              {roleValues.map((role) => (
                <span key={`${params.row.id}-${role}`} className="roles-pill">
                  {role}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Actions',
        minWidth: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <button
            type="button"
            className="roles-manage-btn"
            disabled={loading || !admin}
            onClick={() => handleOpenRoleDialog(params.row)}
          >
            Manage
          </button>
        ),
      },
    ],
    [admin, handleOpenRoleDialog, loading]
  );

  return (
    <div className="roles-page-container">
      <Navbar onToggle={setSidebarCollapsed} />

      <div className={`roles-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="roles-content">
          {error && <div className="alert alert-error">{error}</div>}
          {infoMessage && <div className="alert alert-error">{infoMessage}</div>}

          <div className="roles-card">
            <h2>Role Management</h2>
            {superAdmin ? (
              <p>Super Admin access: you can add or remove ADMIN role, and manage all other roles.</p>
            ) : (
              <p>Admin access: you can manage all roles except adding or removing ADMIN role.</p>
            )}
          </div>

          <div className="roles-toolbar">
            <input
              type="text"
              className="roles-search-input"
              placeholder="Search by name, member ID or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPaginationModel((prev) => ({ ...prev, page: 0 }));
              }}
            />
          </div>

          <div className="roles-table-card">
            <DataGrid
              rows={members}
              columns={columns}
              loading={loading}
              rowCount={totalRows}
              getRowId={(row) => row.id ?? row.memberId}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              className="roles-datagrid"
            />
          </div>

          {dialogOpen && selectedMember && (
            <div className="roles-dialog-backdrop" onClick={() => setDialogOpen(false)}>
              <div className="roles-dialog" onClick={(e) => e.stopPropagation()}>
                <h3>Manage Roles</h3>
                <p>
                  <strong>{selectedMember.name}</strong> ({selectedMember.memberId})
                </p>

                <div className="roles-dialog-options">
                  {ROLE_OPTIONS.map((roleOption) => {
                    const isChecked = selectedRoles.includes(roleOption);
                    const isDisabled = !superAdmin && roleOption === ROLES.ADMIN;

                    return (
                      <label key={roleOption} className={`roles-checkbox ${isDisabled ? 'disabled' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={(e) => handleToggleDialogRole(roleOption, e.target.checked)}
                        />
                        <span>{roleOption}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="roles-dialog-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setDialogOpen(false);
                      setSelectedMember(null);
                      setSelectedRoles([]);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setSelectedRoles(['AUDITOR'])}
                  >
                    Reset to AUDITOR
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSaveRoleDialog}
                  >
                    Save Roles
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Roles;
