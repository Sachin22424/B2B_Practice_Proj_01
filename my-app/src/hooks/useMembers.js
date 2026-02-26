import { useCallback, useEffect, useState } from 'react';
import { memberService } from '../services/memberService';

export function useMembers({ page, pageSize, search, enabled = true }) {
  const [members, setMembers] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) setLoading(true);
      const data = await memberService.getMembers({ page, pageSize, search });
      setMembers(data.content || []);
      setTotalRows(data.totalElements || 0);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to fetch members');
      return false;
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    if (!enabled) return;
    fetchMembers();
  }, [enabled, fetchMembers]);

  const createMember = useCallback(async (member) => {
    try {
      setLoading(true);
      await memberService.createMember(member);
      await fetchMembers({ showLoader: false });
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create member');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchMembers]);

  const updateMember = useCallback(async (id, member) => {
    try {
      setLoading(true);
      await memberService.updateMember(id, member);
      await fetchMembers({ showLoader: false });
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update member');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchMembers]);

  const deleteMember = useCallback(async (id) => {
    try {
      setLoading(true);
      await memberService.deleteMember(id);
      await fetchMembers({ showLoader: false });
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete member');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchMembers]);

  const toggleMemberStatus = useCallback(async (member) => {
    const updatedMember = {
      name: member.name,
      memberId: member.memberId,
      email: member.email,
      activeFrom: member.activeFrom,
      activeTill: member.activeTill,
      status: !member.status,
      roles: member.roles,
    };

    return updateMember(member.id, updatedMember);
  }, [updateMember]);

  return {
    members,
    totalRows,
    loading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    toggleMemberStatus,
  };
}
