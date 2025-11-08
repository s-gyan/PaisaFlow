
export interface User {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name:string;
  members: User[];
  inviteCode: string;
}

export enum SplitType {
  Equally = 'Equally',
  Custom = 'Custom Amounts',
  Percentage = 'Percentages'
}

export interface SplitDetail {
  userId: string;
  amount: number;
  percentage?: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string; // User ID
  splitType: SplitType;
  splitDetails: SplitDetail[];
  date: string;
}

export interface Settlement {
  id: string;
  groupId: string;
  payerId: string; // User ID
  receiverId: string; // User ID
  amount: number;
  date: string;
}

export interface SimplifiedDebt {
    from: string; // User Name
    to: string; // User Name
    amount: number;
}
