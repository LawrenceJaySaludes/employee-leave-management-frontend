export const mockUser = {
  id: 1,
  name: "System Administrator",
  email: "admin@example.com",
  role: "admin",
  department: "Human Resources",
  created_at: "2026-01-15T08:00:00Z",
};

export const mockDashboardData = {
  total_employees: 25,
  total_leave_types: 12,
  total_leave_requests: 48,
  pending_requests: 8,
  approved_requests: 32,
  rejected_requests: 8,
  monthly_requests: [
    { month: 1, total: 5 },
    { month: 2, total: 8 },
    { month: 3, total: 12 },
    { month: 4, total: 7 },
    { month: 5, total: 10 },
    { month: 6, total: 6 },
    { month: 7, total: 4 },
  ],
  recent_requests: [
    {
      id: 1,
      user_id: 2,
      user: { id: 2, name: "Maria Santos" },
      leaveType: { id: 1, name: "Annual Leave" },
      start_date: "2026-07-21",
      end_date: "2026-07-25",
      total_days: 5,
      status: "pending",
      reason: "Family vacation to the province",
    },
    {
      id: 2,
      user_id: 3,
      user: { id: 3, name: "Juan Dela Cruz" },
      leaveType: { id: 2, name: "Sick Leave" },
      start_date: "2026-07-18",
      end_date: "2026-07-19",
      total_days: 2,
      status: "approved",
      reason: "Medical check-up and recovery",
      approved_by: "System Administrator",
      approved_at: "2026-07-17T09:30:00Z",
    },
    {
      id: 3,
      user_id: 4,
      user: { id: 4, name: "Ana Reyes" },
      leaveType: { id: 3, name: "Emergency Leave" },
      start_date: "2026-07-20",
      end_date: "2026-07-20",
      total_days: 1,
      status: "rejected",
      reason: "Family emergency",
      approved_by: "System Administrator",
      approved_at: "2026-07-20T08:15:00Z",
    },
    {
      id: 4,
      user_id: 5,
      user: { id: 5, name: "Carlos Garcia" },
      leaveType: { id: 1, name: "Annual Leave" },
      start_date: "2026-08-01",
      end_date: "2026-08-05",
      total_days: 5,
      status: "pending",
      reason: "Travel plans to Cebu",
    },
    {
      id: 5,
      user_id: 6,
      user: { id: 6, name: "Elena Mendoza" },
      leaveType: { id: 5, name: "Paternity Leave" },
      start_date: "2026-07-28",
      end_date: "2026-08-03",
      total_days: 7,
      status: "approved",
      reason: "Expecting our first child",
      approved_by: "System Administrator",
      approved_at: "2026-07-25T14:00:00Z",
    },
  ],
};

export const mockEmployees = [
  { id: 1, name: "System Administrator", email: "admin@example.com", department: "Human Resources" },
  { id: 2, name: "Maria Santos", email: "maria@example.com", department: "Engineering" },
  { id: 3, name: "Juan Dela Cruz", email: "juan@example.com", department: "Engineering" },
  { id: 4, name: "Ana Reyes", email: "ana@example.com", department: "Marketing" },
  { id: 5, name: "Carlos Garcia", email: "carlos@example.com", department: "Finance" },
  { id: 6, name: "Elena Mendoza", email: "elena@example.com", department: "Human Resources" },
  { id: 7, name: "Pedro Villanueva", email: "pedro@example.com", department: "Engineering" },
  { id: 8, name: "Sofia Lim", email: "sofia@example.com", department: "Marketing" },
  { id: 9, name: "Miguel Torres", email: "miguel@example.com", department: "Finance" },
  { id: 10, name: "Isabella Cruz", email: "isabella@example.com", department: "Operations" },
  { id: 11, name: "Andres Ramos", email: "andres@example.com", department: "Engineering" },
  { id: 12, name: "Camille Sy", email: "camille@example.com", department: "Marketing" },
  { id: 13, name: "Rafael Bautista", email: "rafael@example.com", department: "Operations" },
  { id: 14, name: "Nicole Tan", email: "nicole@example.com", department: "Finance" },
  { id: 15, name: "Dominic Lee", email: "dominic@example.com", department: "Engineering" },
];

export const mockLeaveTypes = [
  { id: 1, name: "Annual Leave", description: "Vacation leave for personal time off", days_allowed: 15, is_paid: true, status: true },
  { id: 2, name: "Sick Leave", description: "Medical leave for health-related absences", days_allowed: 10, is_paid: true, status: true },
  { id: 3, name: "Emergency Leave", description: "Leave for unforeseen emergencies", days_allowed: 5, is_paid: true, status: true },
  { id: 4, name: "Maternity Leave", description: "Leave for expecting mothers", days_allowed: 105, is_paid: true, status: true },
  { id: 5, name: "Paternity Leave", description: "Leave for new fathers", days_allowed: 7, is_paid: true, status: true },
  { id: 6, name: "Bereavement Leave", description: "Leave for the loss of an immediate family member", days_allowed: 5, is_paid: true, status: true },
  { id: 7, name: "Solo Parent Leave", description: "Leave for solo parents as mandated by law", days_allowed: 7, is_paid: true, status: true },
  { id: 8, name: "Study Leave", description: "Leave for educational pursuits and examinations", days_allowed: 10, is_paid: true, status: true },
  { id: 9, name: "Birthday Leave", description: "Leave on the employee's birthday", days_allowed: 1, is_paid: true, status: true },
  { id: 10, name: "Compensatory Leave", description: "Offset leave for overtime or holiday work", days_allowed: 5, is_paid: true, status: true },
  { id: 11, name: "Special Leave", description: "Leave granted for special circumstances", days_allowed: 15, is_paid: true, status: true },
  { id: 12, name: "Unpaid Leave", description: "Leave without pay", days_allowed: 365, is_paid: false, status: true },
];

export const mockMyRequests = [
  {
    id: 1,
    leave_type: "Annual Leave",
    start_date: "2026-07-21",
    end_date: "2026-07-25",
    total_days: 5,
    reason: "Family vacation to the province",
    status: "pending",
  },
  {
    id: 2,
    leave_type: "Sick Leave",
    start_date: "2026-06-10",
    end_date: "2026-06-11",
    total_days: 2,
    reason: "Flu and fever",
    status: "approved",
    approved_by: "System Administrator",
    approved_at: "2026-06-09T10:00:00Z",
  },
  {
    id: 3,
    leave_type: "Emergency Leave",
    start_date: "2026-05-15",
    end_date: "2026-05-15",
    total_days: 1,
    reason: "Urgent family matter",
    status: "approved",
    approved_by: "System Administrator",
    approved_at: "2026-05-15T07:30:00Z",
  },
  {
    id: 4,
    leave_type: "Annual Leave",
    start_date: "2026-08-01",
    end_date: "2026-08-03",
    total_days: 3,
    reason: "Long weekend getaway",
    status: "pending",
  },
  {
    id: 5,
    leave_type: "Sick Leave",
    start_date: "2026-04-05",
    end_date: "2026-04-06",
    total_days: 2,
    reason: "Dental surgery",
    status: "rejected",
    approved_by: "System Administrator",
    approved_at: "2026-04-05T11:00:00Z",
  },
];

export function mockPaginate(data, params = {}) {
  const page = params.page || 1;
  const perPage = params.per_page || 10;
  const search = (params.search || "").toLowerCase();
  const status = params.status || "";

  let filtered = data;
  if (search) {
    filtered = filtered.filter((item) =>
      Object.values(item).some(
        (v) => typeof v === "string" && v.toLowerCase().includes(search)
      )
    );
  }
  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paginatedData = filtered.slice(start, start + perPage);

  return {
    data: paginatedData,
    pagination: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  };
}

export const mockAllRequests = [
  {
    id: 1,
    employee: "Maria Santos",
    user_id: 2,
    leave_type: "Annual Leave",
    start_date: "2026-07-21",
    end_date: "2026-07-25",
    total_days: 5,
    reason: "Family vacation to the province",
    status: "pending",
  },
  {
    id: 2,
    employee: "Juan Dela Cruz",
    user_id: 3,
    leave_type: "Sick Leave",
    start_date: "2026-07-18",
    end_date: "2026-07-19",
    total_days: 2,
    reason: "Medical check-up and recovery",
    status: "approved",
    approved_by: "System Administrator",
    approved_at: "2026-07-17T09:30:00Z",
  },
  {
    id: 3,
    employee: "Ana Reyes",
    user_id: 4,
    leave_type: "Emergency Leave",
    start_date: "2026-07-20",
    end_date: "2026-07-20",
    total_days: 1,
    reason: "Family emergency",
    status: "rejected",
    approved_by: "System Administrator",
    approved_at: "2026-07-20T08:15:00Z",
  },
  {
    id: 4,
    employee: "Carlos Garcia",
    user_id: 5,
    leave_type: "Annual Leave",
    start_date: "2026-08-01",
    end_date: "2026-08-05",
    total_days: 5,
    reason: "Travel plans to Cebu",
    status: "pending",
  },
  {
    id: 5,
    employee: "Elena Mendoza",
    user_id: 6,
    leave_type: "Paternity Leave",
    start_date: "2026-07-28",
    end_date: "2026-08-03",
    total_days: 7,
    reason: "Expecting our first child",
    status: "approved",
    approved_by: "System Administrator",
    approved_at: "2026-07-25T14:00:00Z",
  },
  {
    id: 6,
    employee: "Pedro Villanueva",
    user_id: 7,
    leave_type: "Study Leave",
    start_date: "2026-08-10",
    end_date: "2026-08-12",
    total_days: 3,
    reason: "Professional certification exam",
    status: "pending",
  },
  {
    id: 7,
    employee: "Sofia Lim",
    user_id: 8,
    leave_type: "Annual Leave",
    start_date: "2026-07-14",
    end_date: "2026-07-18",
    total_days: 5,
    reason: "Personal travel abroad",
    status: "approved",
    approved_by: "System Administrator",
    approved_at: "2026-07-12T16:00:00Z",
  },
  {
    id: 8,
    employee: "Miguel Torres",
    user_id: 9,
    leave_type: "Birthday Leave",
    start_date: "2026-08-15",
    end_date: "2026-08-15",
    total_days: 1,
    reason: "My birthday",
    status: "pending",
  },
  {
    id: 9,
    employee: "Isabella Cruz",
    user_id: 10,
    leave_type: "Bereavement Leave",
    start_date: "2026-07-10",
    end_date: "2026-07-14",
    total_days: 5,
    reason: "Loss of a family member",
    status: "approved",
    approved_by: "System Administrator",
    approved_at: "2026-07-10T08:00:00Z",
  },
  {
    id: 10,
    employee: "Andres Ramos",
    user_id: 11,
    leave_type: "Compensatory Leave",
    start_date: "2026-08-07",
    end_date: "2026-08-08",
    total_days: 2,
    reason: "Overtime work last week",
    status: "pending",
  },
];
