export const ROLES = {
  ADMIN: 'ADMIN',
  BILLING: 'BILLING',
  FINANCE: 'FINANCE',
  AUDITOR: 'AUDITOR',
};

export const SUPER_ADMIN_MEMBER_ID = 'B2B-001';

export const PERMISSIONS = {
  MEMBER_CREATE: 'member.create',
  MEMBER_UPDATE: 'member.update',
  MEMBER_DELETE: 'member.delete',
  MEMBER_TOGGLE_STATUS: 'member.toggleStatus',
  ROLE_ASSIGN: 'role.assign',
  INVOICE_MANAGE: 'invoice.manage',
  BILLING_ADJUST_APPROVE: 'billing.adjust.approve',
  PAYMENT_PROCESS: 'payment.process',
  PAYMENT_HISTORY_VIEW: 'payment.history.view',
  PAYMENT_LOGS_VIEW: 'payment.logs.view',
  REPORTS_VIEW: 'reports.view',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.BILLING]: [
    PERMISSIONS.INVOICE_MANAGE,
    PERMISSIONS.BILLING_ADJUST_APPROVE,
  ],
  [ROLES.FINANCE]: [
    PERMISSIONS.PAYMENT_PROCESS,
    PERMISSIONS.PAYMENT_HISTORY_VIEW,
  ],
  [ROLES.AUDITOR]: [
    PERMISSIONS.PAYMENT_LOGS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],
};

export const hasPermission = (roles, permission) => {
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];
  return normalizedRoles.some((role) => {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  });
};

export const ROLE_OPTIONS = Object.values(ROLES);

export const hasRole = (roles, roleToCheck) => {
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];
  return normalizedRoles.includes(roleToCheck);
};

export const canEditBilling = (roles) => hasRole(roles, ROLES.ADMIN) || hasRole(roles, ROLES.BILLING);

export const canViewBilling = (roles) =>
  canEditBilling(roles) || hasRole(roles, ROLES.AUDITOR);

export const canEditFinance = (roles) => hasRole(roles, ROLES.ADMIN) || hasRole(roles, ROLES.FINANCE);

export const canViewFinance = (roles) =>
  canEditFinance(roles) || hasRole(roles, ROLES.AUDITOR);

export const isAdmin = (roles) => hasRole(roles, ROLES.ADMIN);

export const isSuperAdminUser = (memberId) => memberId === SUPER_ADMIN_MEMBER_ID;

export const canModifyAdminRole = (memberId) => isSuperAdminUser(memberId);
