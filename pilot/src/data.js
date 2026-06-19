// ── BerryX Pilot — Demo Mock Data ──

export const EMPLOYEES = [
  { id: 1, name: 'Arjun Mehta',   role: 'Field Sales Executive', zone: 'North Delhi', phone: '98100-11111', email: 'arjun@pharma.com',   salary: 42000, joinDate: '2022-03-15', status: 'Active',   avatar: 'AM', sales: 184200, target: 200000 },
  { id: 2, name: 'Priya Sharma',  role: 'Senior MR',             zone: 'South Delhi', phone: '98100-22222', email: 'priya@pharma.com',   salary: 55000, joinDate: '2021-07-01', status: 'Active',   avatar: 'PS', sales: 241500, target: 220000 },
  { id: 3, name: 'Rahul Gupta',   role: 'Area Manager',          zone: 'East Delhi',  phone: '98100-33333', email: 'rahul@pharma.com',   salary: 72000, joinDate: '2020-01-10', status: 'Active',   avatar: 'RG', sales: 315000, target: 300000 },
  { id: 4, name: 'Sneha Kapoor',  role: 'Field Sales Executive', zone: 'West Delhi',  phone: '98100-44444', email: 'sneha@pharma.com',   salary: 38000, joinDate: '2023-02-20', status: 'Active',   avatar: 'SK', sales: 127400, target: 150000 },
  { id: 5, name: 'Vikram Singh',  role: 'Senior MR',             zone: 'Noida',       phone: '98100-55555', email: 'vikram@pharma.com',  salary: 52000, joinDate: '2021-11-05', status: 'Active',   avatar: 'VS', sales: 198700, target: 200000 },
  { id: 6, name: 'Meena Joshi',   role: 'Field Sales Executive', zone: 'Gurugram',    phone: '98100-66666', email: 'meena@pharma.com',   salary: 40000, joinDate: '2022-08-12', status: 'Inactive', avatar: 'MJ', sales: 92000,  target: 150000 },
  { id: 7, name: 'Deepak Nair',   role: 'MR',                    zone: 'Faridabad',   phone: '98100-77777', email: 'deepak@pharma.com',  salary: 34000, joinDate: '2023-06-01', status: 'Active',   avatar: 'DN', sales: 156300, target: 160000 },
  { id: 8, name: 'Kavya Reddy',   role: 'Senior MR',             zone: 'Ghaziabad',   phone: '98100-88888', email: 'kavya@pharma.com',   salary: 50000, joinDate: '2022-01-18', status: 'Active',   avatar: 'KR', sales: 223100, target: 210000 },
];

export const PRODUCTS = [
  { id: 1,  name: 'AmoxiCure 500mg',    category: 'Antibiotic',     mrp: 145,  company: 'SunPharma', stock: 1240, minStock: 100, expiry: '2026-08',  hsn: '3004101',  batch: 'AMX2401' },
  { id: 2,  name: 'CardioShield 10mg',  category: 'Cardiac',        mrp: 320,  company: 'Cipla',     stock: 84,   minStock: 100, expiry: '2025-12',  hsn: '3004209',  batch: 'CRD2312' },
  { id: 3,  name: 'DiaboCare 500mg',    category: 'Anti-Diabetic',  mrp: 280,  company: 'Dr. Reddy', stock: 560,  minStock: 50,  expiry: '2027-03',  hsn: '3004901',  batch: 'DBC2501' },
  { id: 4,  name: 'NeuroCalm 25mg',     category: 'Neuro',          mrp: 195,  company: 'Alkem',     stock: 430,  minStock: 80,  expiry: '2026-11',  hsn: '3004901',  batch: 'NCL2406' },
  { id: 5,  name: 'OrthoFlex Gel',      category: 'Topical',        mrp: 220,  company: 'Mankind',   stock: 28,   minStock: 50,  expiry: '2026-06',  hsn: '3004902',  batch: 'OFG2402' },
  { id: 6,  name: 'VitaBoost B12',      category: 'Supplement',     mrp: 180,  company: 'Abbott',    stock: 890,  minStock: 100, expiry: '2027-01',  hsn: '2936210',  batch: 'VBB2501' },
  { id: 7,  name: 'AntiFungal Cream',   category: 'Topical',        mrp: 160,  company: 'GSK',       stock: 320,  minStock: 60,  expiry: '2026-09',  hsn: '3004904',  batch: 'AFC2407' },
  { id: 8,  name: 'GastroEase 20mg',    category: 'Gastro',         mrp: 130,  company: 'Zydus',     stock: 640,  minStock: 80,  expiry: '2026-07',  hsn: '3004905',  batch: 'GEZ2405' },
  { id: 9,  name: 'CoughRelief Syrup',  category: 'Respiratory',    mrp: 95,   company: 'Piramal',   stock: 12,   minStock: 50,  expiry: '2025-11',  hsn: '3004903',  batch: 'CRS2310' },
  { id: 10, name: 'HyperTrol 5mg',      category: 'Anti-Hypert.',   mrp: 175,  company: 'Lupin',     stock: 720,  minStock: 100, expiry: '2027-06',  hsn: '3004209',  batch: 'HYT2601' },
];

export const DOCTORS = [
  { id: 1, name: 'Dr. Anil Saxena',   specialty: 'Cardiologist',    hospital: 'AIIMS Delhi',        phone: '98200-11111', city: 'Delhi',   assignedTo: 'Priya Sharma',  visits: 14 },
  { id: 2, name: 'Dr. Suman Verma',   specialty: 'General Physician', hospital: 'Max Hospital',     phone: '98200-22222', city: 'Noida',   assignedTo: 'Vikram Singh',  visits: 22 },
  { id: 3, name: 'Dr. Rajan Patel',   specialty: 'Diabetologist',   hospital: 'Fortis Gurugram',   phone: '98200-33333', city: 'Gurugram',assignedTo: 'Arjun Mehta',   visits: 8  },
  { id: 4, name: 'Dr. Nisha Kumar',   specialty: 'Neurologist',     hospital: 'Apollo Delhi',       phone: '98200-44444', city: 'Delhi',   assignedTo: 'Rahul Gupta',   visits: 18 },
  { id: 5, name: 'Dr. Mohan Sharma',  specialty: 'Orthopedic',      hospital: 'Safdarjung Hospital',phone: '98200-55555', city: 'Delhi',   assignedTo: 'Deepak Nair',   visits: 11 },
  { id: 6, name: 'Dr. Pooja Mishra',  specialty: 'Gastroenterologist','hospital': 'BLK Hospital',   phone: '98200-66666', city: 'Delhi',   assignedTo: 'Kavya Reddy',   visits: 16 },
];

export const STOCKISTS = [
  { id: 1, name: 'Delhi Medical Dist.',  contact: 'Suresh Agarwal',  phone: '99110-11111', city: 'Karol Bagh',    credit: 145000, outstanding: 28000, status: 'Active'   },
  { id: 2, name: 'Noida Pharma Hub',     contact: 'Ramesh Gupta',    phone: '99110-22222', city: 'Noida Sec 18',  credit: 200000, outstanding: 0,     status: 'Active'   },
  { id: 3, name: 'Gurugram MedStore',    contact: 'Kavita Singh',    phone: '99110-33333', city: 'Gurugram',      credit: 120000, outstanding: 54000, status: 'Active'   },
  { id: 4, name: 'East Delhi Supplies',  contact: 'Manoj Kumar',     phone: '99110-44444', city: 'Preet Vihar',   credit: 80000,  outstanding: 80000, status: 'Blocked'  },
  { id: 5, name: 'Faridabad Medico',     contact: 'Sunita Sharma',   phone: '99110-55555', city: 'Faridabad',     credit: 160000, outstanding: 12000, status: 'Active'   },
];

export const SALES = [
  { id: 1,  date: '2025-06-01', employee: 'Arjun Mehta',  product: 'AmoxiCure 500mg',   doctor: 'Dr. Rajan Patel',  stockist: 'Delhi Medical Dist.', qty: 120, rate: 145, total: 17400, status: 'Paid'    },
  { id: 2,  date: '2025-06-02', employee: 'Priya Sharma', product: 'CardioShield 10mg', doctor: 'Dr. Anil Saxena',  stockist: 'Noida Pharma Hub',    qty: 80,  rate: 320, total: 25600, status: 'Paid'    },
  { id: 3,  date: '2025-06-03', employee: 'Rahul Gupta',  product: 'DiaboCare 500mg',   doctor: 'Dr. Suman Verma',  stockist: 'Gurugram MedStore',   qty: 200, rate: 280, total: 56000, status: 'Pending' },
  { id: 4,  date: '2025-06-04', employee: 'Vikram Singh', product: 'NeuroCalm 25mg',    doctor: 'Dr. Nisha Kumar',  stockist: 'Faridabad Medico',    qty: 100, rate: 195, total: 19500, status: 'Paid'    },
  { id: 5,  date: '2025-06-05', employee: 'Kavya Reddy',  product: 'GastroEase 20mg',   doctor: 'Dr. Pooja Mishra', stockist: 'Noida Pharma Hub',    qty: 150, rate: 130, total: 19500, status: 'Paid'    },
  { id: 6,  date: '2025-06-06', employee: 'Deepak Nair',  product: 'OrthoFlex Gel',     doctor: 'Dr. Mohan Sharma', stockist: 'East Delhi Supplies', qty: 60,  rate: 220, total: 13200, status: 'Overdue' },
  { id: 7,  date: '2025-06-07', employee: 'Sneha Kapoor', product: 'VitaBoost B12',     doctor: 'Dr. Suman Verma',  stockist: 'Delhi Medical Dist.', qty: 90,  rate: 180, total: 16200, status: 'Paid'    },
  { id: 8,  date: '2025-06-08', employee: 'Arjun Mehta',  product: 'HyperTrol 5mg',     doctor: 'Dr. Anil Saxena',  stockist: 'Noida Pharma Hub',    qty: 110, rate: 175, total: 19250, status: 'Pending' },
  { id: 9,  date: '2025-06-09', employee: 'Priya Sharma', product: 'CoughRelief Syrup', doctor: 'Dr. Suman Verma',  stockist: 'Gurugram MedStore',   qty: 80,  rate: 95,  total: 7600,  status: 'Paid'    },
  { id: 10, date: '2025-06-10', employee: 'Rahul Gupta',  product: 'AntiFungal Cream',  doctor: 'Dr. Nisha Kumar',  stockist: 'Faridabad Medico',    qty: 140, rate: 160, total: 22400, status: 'Paid'    },
];

export const ATTENDANCE = [
  { id: 1, employee: 'Arjun Mehta',  month: 'June 2025', present: 22, absent: 2, halfDay: 1, leaves: 1, overtime: 4 },
  { id: 2, employee: 'Priya Sharma', month: 'June 2025', present: 24, absent: 0, halfDay: 0, leaves: 2, overtime: 8 },
  { id: 3, employee: 'Rahul Gupta',  month: 'June 2025', present: 21, absent: 3, halfDay: 1, leaves: 1, overtime: 2 },
  { id: 4, employee: 'Sneha Kapoor', month: 'June 2025', present: 20, absent: 4, halfDay: 0, leaves: 2, overtime: 0 },
  { id: 5, employee: 'Vikram Singh', month: 'June 2025', present: 23, absent: 1, halfDay: 1, leaves: 1, overtime: 6 },
  { id: 6, employee: 'Deepak Nair',  month: 'June 2025', present: 22, absent: 2, halfDay: 0, leaves: 2, overtime: 3 },
  { id: 7, employee: 'Kavya Reddy',  month: 'June 2025', present: 25, absent: 0, halfDay: 0, leaves: 1, overtime: 10 },
];

export const SALARY = [
  { id: 1, employee: 'Arjun Mehta',  base: 42000, incentive: 9210, deduction: 840, net: 50370, status: 'Processed', month: 'June 2025' },
  { id: 2, employee: 'Priya Sharma', base: 55000, incentive: 12075,deduction: 0,   net: 67075, status: 'Processed', month: 'June 2025' },
  { id: 3, employee: 'Rahul Gupta',  base: 72000, incentive: 15750,deduction: 2160,net: 85590, status: 'Pending',   month: 'June 2025' },
  { id: 4, employee: 'Sneha Kapoor', base: 38000, incentive: 6370, deduction: 1520,net: 42850, status: 'Pending',   month: 'June 2025' },
  { id: 5, employee: 'Vikram Singh', base: 52000, incentive: 9935, deduction: 0,   net: 61935, status: 'Processed', month: 'June 2025' },
  { id: 6, employee: 'Deepak Nair',  base: 34000, incentive: 7815, deduction: 680, net: 41135, status: 'Pending',   month: 'June 2025' },
  { id: 7, employee: 'Kavya Reddy',  base: 50000, incentive: 11155,deduction: 0,   net: 61155, status: 'Processed', month: 'June 2025' },
];

export const MONTHLY_SALES = [
  { month: 'Jan', revenue: 186000, orders: 42 },
  { month: 'Feb', revenue: 215000, orders: 51 },
  { month: 'Mar', revenue: 248000, orders: 58 },
  { month: 'Apr', revenue: 234000, orders: 55 },
  { month: 'May', revenue: 271000, orders: 64 },
  { month: 'Jun', revenue: 296450, orders: 72 },
];

export const BATCHES = [
  { id: 1, product: 'AmoxiCure 500mg',   batch: 'AMX2401', mfg: '2024-01', expiry: '2026-08', qty: 5000, available: 1240, status: 'Active' },
  { id: 2, product: 'CardioShield 10mg', batch: 'CRD2312', mfg: '2023-12', expiry: '2025-12', qty: 2000, available: 84,   status: 'Near Expiry' },
  { id: 3, product: 'DiaboCare 500mg',   batch: 'DBC2501', mfg: '2025-01', expiry: '2027-03', qty: 3000, available: 560,  status: 'Active' },
  { id: 4, product: 'CoughRelief Syrup', batch: 'CRS2310', mfg: '2023-10', expiry: '2025-11', qty: 1500, available: 12,   status: 'Near Expiry' },
  { id: 5, product: 'HyperTrol 5mg',     batch: 'HYT2601', mfg: '2026-01', expiry: '2027-06', qty: 4000, available: 720,  status: 'Active' },
];

export const AUDIT_LOGS = [
  { id: 1, action: 'Sale Created',       user: 'Arjun Mehta',  entity: 'Sales #1001',       time: '2025-06-10 09:42:11', ip: '192.168.1.10' },
  { id: 2, action: 'Product Updated',    user: 'Admin',         entity: 'CardioShield 10mg', time: '2025-06-10 10:15:33', ip: '192.168.1.1'  },
  { id: 3, action: 'Employee Added',     user: 'Admin',         entity: 'Deepak Nair',       time: '2025-06-09 14:22:05', ip: '192.168.1.1'  },
  { id: 4, action: 'Salary Processed',   user: 'Admin',         entity: 'June 2025 Payroll', time: '2025-06-09 18:00:00', ip: '192.168.1.1'  },
  { id: 5, action: 'Attendance Marked',  user: 'Priya Sharma',  entity: 'June 2025',         time: '2025-06-09 08:05:42', ip: '192.168.1.14' },
  { id: 6, action: 'Stock Adjusted',     user: 'Admin',         entity: 'OrthoFlex Gel',     time: '2025-06-08 16:30:20', ip: '192.168.1.1'  },
  { id: 7, action: 'Login',              user: 'Rahul Gupta',   entity: 'Session',           time: '2025-06-08 08:58:01', ip: '192.168.1.22' },
  { id: 8, action: 'Report Generated',   user: 'Admin',         entity: 'Monthly Report',    time: '2025-06-07 17:45:12', ip: '192.168.1.1'  },
];
