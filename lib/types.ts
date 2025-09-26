interface LeaveEntitlements {
    total: number | null;
    used: number;
    
    pending: number;
    reserved: number;
    available: number | null;
}

interface Employee {
    userId: string;
}

interface LeaveBalance {
    externalCode: LeaveTypeCode;
    timeAccountTypeName: string;
    bookingEndDate: string;
    bookingStartDate: string;
    balanceEffectiveDate: string;
    balance: number | null;
    employee: Employee;
    accountClosed: boolean;
    timeUnit: 'DAYS' | 'HOURS';
    entitlements: LeaveEntitlements;
}

interface LeaveBalanceResponse {
    d: {
        results: LeaveBalance[];
        metadata: {
            __count: string;
        };
    };
}

interface LeaveTypeDefinition {
    externalCode: LeaveTypeCode;
    timeAccountTypeName: string;
    maxDays?: number;
    isFixed?: boolean;
    unlimited?: boolean;
}


enum LeaveTypeCode {
    ANNUAL = 'AL',
    SICK = 'SL',
    COMPENSATORY = 'CL',
    PATERNITY = 'PL',
    COMPASSIONATE = 'COMP',
    WORK_FROM_HOME = 'WFH',
    UNPAID = 'UPAL',
    STUDY = 'SDY'
}

interface AttendanceRecord {
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    duration: number | null;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'WFH';
    isLate: boolean;
    isEarlyDeparture: boolean;
    employee: Employee;
}
interface AttendanceResponse {
    d: {
        results: AttendanceRecord[];
        metadata: {
            __count: string;
        };
    };
}

export { LeaveTypeCode };
export type { LeaveBalance, LeaveBalanceResponse, LeaveTypeDefinition, LeaveEntitlements, AttendanceRecord, AttendanceResponse };