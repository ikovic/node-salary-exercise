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
  getAllSubordinates: () => Employee[];
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

type EmployeeWithSubordinates = Manager | Sales;
function getSubordinatesAcrossLevels(employee: EmployeeWithSubordinates) {
  return Object.values(
    employee.subordinates.reduce((allSubordinates, subordinate) => {
      // make sure subordinates are unique - we treat name as ID for simplicity
      switch (subordinate.type) {
        case EmployeeType.Employee:
          return { ...allSubordinates, [subordinate.name]: subordinate };
        case EmployeeType.Manager:
          return {
            ...allSubordinates,
            ...getSubordinatesAcrossLevels(subordinate as Manager).reduce(
              (all, one) => {
                return { ...all, [one.name]: one };
              },
              { [subordinate.name]: subordinate },
            ),
          };
        case EmployeeType.Sales:
          return {
            ...allSubordinates,
            ...getSubordinatesAcrossLevels(subordinate as Sales).reduce(
              (all, one) => {
                return { ...all, [one.name]: one };
              },
              { [subordinate.name]: subordinate },
            ),
          };

        default:
          return allSubordinates;
      }
    }, {}),
  );
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
}): Sales {
  const sales = {
    ...createEmployee({ name, dateJoined }),
    type: EmployeeType.Sales,
    subordinates,
  };

  // we'll want to extract this responsibility somewhere else
  function getAllSubordinates(): Employee[] {
    return getSubordinatesAcrossLevels(sales);
  }

  return {
    ...sales,
    getAllSubordinates,
  };
}
