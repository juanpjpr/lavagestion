declare namespace Express {
  interface Request {
    userId?: string;
    tenantId?: string;
    userRole?: 'OWNER' | 'EMPLOYEE';
  }
}
