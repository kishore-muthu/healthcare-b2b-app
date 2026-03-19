export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  status: 'Stable' | 'Critical' | 'Improving' | 'Admitted' | 'Discharged';
  ward: string;
  doctor: string;
  admittedDate: string;
  lastVisit: string;
  bloodType: string;
  phone: string;
  email: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygen: number;
  };
  avatar: string;
}

export interface DashboardStats {
  totalPatients: number;
  criticalCases: number;
  bedsAvailable: number;
  appointmentsToday: number;
  recoveryRate: number;
  avgStayDays: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'critical' | 'info' | 'success' | 'warning';
}
