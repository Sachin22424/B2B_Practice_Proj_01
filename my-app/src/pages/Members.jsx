import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { getCurrentUserRoles, isAuthenticated } from '../utils/auth';
import { useMembers } from '../hooks/useMembers';
import { formatDate } from '../utils/date';
import { hasPermission, PERMISSIONS } from '../utils/rbac';
import Navbar from '../components/Navbar';
import './Members.css';

const INITIAL_FORM = {
  name: '',
  memberId: '',
  email: '',
  activeFrom: '',
  activeTill: '',
  status: true,
  roles: ['AUDITOR'],
};

function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const todayString = new Date().toISOString().split('T')[0];
  const activeTillMinDate =
    form.activeFrom && form.activeFrom > todayString ? form.activeFrom : todayString;

  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const currentUserRoles = getCurrentUserRoles();

  const canCreateMember = hasPermission(currentUserRoles, PERMISSIONS.MEMBER_CREATE);
  const canUpdateMember = hasPermission(currentUserRoles, PERMISSIONS.MEMBER_UPDATE);
  const canDeleteMember = hasPermission(currentUserRoles, PERMISSIONS.MEMBER_DELETE);
  const canToggleStatus = hasPermission(currentUserRoles, PERMISSIONS.MEMBER_TOGGLE_STATUS);

  const {
    members,
    totalRows,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember,
    toggleMemberStatus,
  } = useMembers({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    search: debouncedSearchTerm,
    enabled: authenticated,
  });

  useEffect(() => {
    if (!authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canCreateMember && !canUpdateMember) return;

    const payload = editingId
      ? form
      : { ...form, roles: ['AUDITOR'] };

    const success = editingId
      ? await updateMember(editingId, payload)
      : await createMember(payload);

    if (success) {
      setForm(INITIAL_FORM);
      setShowForm(false);
      setEditingId(null);
    }
  };

  const handleEdit = useCallback((member) => {
    setForm({
      name: member.name,
      memberId: member.memberId,
      email: member.email,
      activeFrom: member.activeFrom,
      activeTill: member.activeTill,
      status: member.status,
      roles: Array.isArray(member.roles) && member.roles.length > 0 ? member.roles : ['AUDITOR'],
    });
    setEditingId(member.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = () => {
    setForm(INITIAL_FORM);
    setShowForm(false);
    setEditingId(null);
  };

  const handleDeleteAction = useCallback(async (id) => {
    if (!canDeleteMember) return;
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    await deleteMember(id);
  }, [canDeleteMember, deleteMember]);

  const handleToggleStatus = useCallback(async (member) => {
    if (!canToggleStatus) return;
    await toggleMemberStatus(member);
  }, [canToggleStatus, toggleMemberStatus]);

  const columns = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 1.3, minWidth: 160 },
      { field: 'memberId', headerName: 'Member ID', flex: 1, minWidth: 130 },
      { field: 'email', headerName: 'Email', flex: 1.6, minWidth: 200 },
      {
        field: 'activeFrom',
        headerName: 'Active From',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => formatDate(params.row.activeFrom),
      },
      {
        field: 'activeTill',
        headerName: 'Active Till',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => formatDate(params.row.activeTill),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        minWidth: 130,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const isActive = Boolean(params.row.status);
          return (
            <button
              type="button"
              onClick={() => handleToggleStatus(params.row)}
              className={`btn-status ${isActive ? 'btn-status-disable' : 'btn-status-enable'}`}
              disabled={loading || !canToggleStatus}
            >
              {isActive ? 'Disable' : 'Enable'}
            </button>
          );
        },
      },
      {
        field: 'roles',
        headerName: 'Roles',
        flex: 1.2,
        minWidth: 220,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const roleValues = Array.isArray(params.row.roles) && params.row.roles.length > 0
            ? params.row.roles
            : ['AUDITOR'];

          return (
            <div className="roles-row">
              {roleValues.map((role) => (
                <span key={`${params.row.id}-${role}`} className="role-pill">
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
        sortable: false,
        filterable: false,
        minWidth: 160,
        renderCell: (params) => (
          <div className="action-buttons">
            <button
              onClick={() => handleEdit(params.row)}
              className="btn-edit"
              disabled={loading || !canUpdateMember}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteAction(params.row.id)}
              className="btn-delete"
              disabled={loading || !canDeleteMember}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [
      canDeleteMember,
      canToggleStatus,
      canUpdateMember,
      handleDeleteAction,
      handleEdit,
      handleToggleStatus,
      loading,
    ]
  );

  return (
    <div className="members-container">
      <Navbar onToggle={setSidebarCollapsed} />

      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="members-content">
        <div className="toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPaginationModel((prev) => ({ ...prev, page: 0 }));
              }}
              className="search-input"
            />
          </div>
          {canCreateMember && (
            <button
              onClick={() => {
                if (showForm) {
                  handleCancelEdit();
                } else {
                  setShowForm(true);
                }
              }}
              className="btn-primary"
            >
              {showForm ? 'Cancel' : '+ Add Member'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingId ? 'Edit Member' : 'Add New Member'}</h2>
            <form onSubmit={handleSubmit} className="member-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    minLength="2"
                  />
                </div>
                <div className="form-field">
                  <label>Member ID</label>
                  <input
                    name="memberId"
                    value={form.memberId}
                    onChange={handleChange}
                    placeholder="B2B-004"
                    required
                    minLength="3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Active From</label>
                  <input
                    name="activeFrom"
                    type="date"
                    value={form.activeFrom}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Active Till</label>
                  <input
                    name="activeTill"
                    type="date"
                    value={form.activeTill}
                    onChange={handleChange}
                    min={activeTillMinDate}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select
                    name="status"
                    value={String(form.status)}
                    onChange={handleChange}
                    required
                  >
                    <option value="true">Active</option>
                    <option value="false">Disable</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Member' : 'Add Member')}
              </button>
            </form>
          </div>
        )}

        <div className="table-card">
          <div className="table-header">
            <h2>Members List</h2>
            <span className="member-count">
              Showing {members.length} of {totalRows} members
            </span>
          </div>

          <div className="datagrid-container">
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
              className="members-datagrid"
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Members;
