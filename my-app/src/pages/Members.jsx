import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { isAuthenticated } from '../utils/auth';
import { memberService } from '../services/memberService';
import Navbar from '../components/Navbar';
import './Members.css';

function Members() {
  const [members, setMembers] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    memberId: '',
    email: '',
    billDue: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await memberService.getMembers({
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        search: debouncedSearchTerm,
      });
      setMembers(data.content || []);
      setTotalRows(data.totalElements || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    fetchMembers();
  }, [fetchMembers]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await memberService.updateMember(editingId, form);
      } else {
        await memberService.createMember(form);
      }
      await fetchMembers();
      setForm({ name: '', memberId: '', email: '', billDue: '' });
      setShowForm(false);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = useCallback((member) => {
    setForm({
      name: member.name,
      memberId: member.memberId,
      email: member.email,
      billDue: member.billDue,
    });
    setEditingId(member.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = () => {
    setForm({ name: '', memberId: '', email: '', billDue: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    
    try {
      setLoading(true);
      await memberService.deleteMember(id);
      await fetchMembers();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchMembers]);

  const columns = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 1.3, minWidth: 160 },
      { field: 'memberId', headerName: 'Member ID', flex: 1, minWidth: 130 },
      { field: 'email', headerName: 'Email', flex: 1.6, minWidth: 200 },
      {
        field: 'billDue',
        headerName: 'Bill Due Date',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : '',
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
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(params.row.id)}
              className="btn-delete"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleEdit, loading]
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
                    disabled={editingId !== null}
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
                  <label>Bill Due Date</label>
                  <input
                    name="billDue"
                    type="date"
                    value={form.billDue}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
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
