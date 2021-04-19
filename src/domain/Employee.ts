import { differenceInYears } from 'date-fns';

const BASE_SALARY = 5000;

export enum EmployeeType {
  Employee = 'Employee',
  Manager = 'Manager',
  Sales = 'Sales',
}

type EmployeeArgs = {
  name: string;
  dateJoined: Date;
};

type EmployeeWithSubordinatesArgs = EmployeeArgs & { subordinates: Employee[] };

export class Employee {
  name: string;
  dateJoined: Date;
  baseSalary: number;
  type: EmployeeType;

  constructor({ name, dateJoined }: EmployeeArgs) {
    this.name = name;
    this.dateJoined = dateJoined;

    // hardcoded for simplicity
    this.baseSalary = BASE_SALARY;

    this.type = EmployeeType.Employee;
  }

  getTenure(byDate: Date): number {
    return differenceInYears(byDate, this.dateJoined);
  }
}

class EmployeeWithSubordinates extends Employee {
  subordinates: Employee[];

  constructor({ name, dateJoined, subordinates }: EmployeeWithSubordinatesArgs) {
    super({ name, dateJoined });

    this.subordinates = subordinates;
  }
}

export class Manager extends EmployeeWithSubordinates {
  subordinates: Employee[];

  constructor({ name, dateJoined, subordinates }: EmployeeWithSubordinatesArgs) {
    super({ name, dateJoined, subordinates });

    this.type = EmployeeType.Manager;
  }
}

export class Sales extends EmployeeWithSubordinates {
  subordinates: Employee[];

  constructor({ name, dateJoined, subordinates }: EmployeeWithSubordinatesArgs) {
    super({ name, dateJoined, subordinates });

    this.type = EmployeeType.Sales;
  }
}

/**
 * Naive implementation, real world implementation would have to be improved.
 * This would probably be a separate service, dealing only with company hierarchy.
 */
export function getSubordinatesAcrossLevels(employee: EmployeeWithSubordinates): Employee[] {
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
