export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: string;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  password: string | null;
}

export interface Transaction {
  id: number;
  userId: number;
  userName?: string;
  type: string;
  category: string;
  title: string;
  note?: string;
  amount: number;
  occurredAt: string;
  slipPath?: string;
  createdAt: string;
}

export interface CategorySum {
  category: string;
  type: string;
  total: number;
}

export interface MonthlySum {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
  byCategory: CategorySum[];
  byMonth: MonthlySum[];
  recent: Transaction[];
}

export interface TransactionFilter {
  type?: string;
  category?: string;
}
