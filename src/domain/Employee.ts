import { differenceInYears } from 'date-fns';

const BASE_SALARY = 5000;

export enum EmployeeType {
  Employee = 'Employee',
  Manager = 'Manager',
  Sales = 'Sales',
}

export interface Employee {
  name: string;
  dateJoined: Date;
  baseSalary: number;
  type: EmployeeType;
  getTenure: (Date) => number;
}

export interface Manager extends Employee {
  subordinates: Employee[];
}

export interface Sales extends Employee {
  // there might be more differences but to keep it simple for now it's the same as Manager
  subordinates: Employee[];
}

// factory functions embed the business rules about object creation
export function createEmployee({ name, dateJoined }: { name: string; dateJoined: Date }): Employee {
  function getTenure(byDate: Date): number {
    return differenceInYears(byDate, dateJoined);
  }

  return { name, dateJoined, baseSalary: BASE_SALARY, type: EmployeeType.Employee, getTenure };
}

export function createManager({
  name,
  dateJoined,
  subordinates,
}: {
  name: string;
  dateJoined: Date;
  subordinates: Employee[];
}): Manager {
  return {
    ...createEmployee({ name, dateJoined }),
    type: EmployeeType.Manager,
    subordinates,
  };
}

// get rid of duplication as we go
export function createSales({
  name,
  dateJoined,
  subordinates,
}: {
  name: string;
  dateJoined: Date;
  subordinates: Employee[];
}): Manager {
  return {
    ...createEmployee({ name, dateJoined }),
    type: EmployeeType.Sales,
    subordinates,
  };
}
