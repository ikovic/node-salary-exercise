import * as currency from 'currency.js';

import { Employee, EmployeeType } from './Employee';

type SalaryCalculatorStrategy = (Employee, Date) => number;

const UNKNOWN_SALARY = 0;

/**
 * Treats special cases.
 */
function calculateUnknownSalary(employee: Employee, calculationDate: Date): number {
  return UNKNOWN_SALARY;
}

/**
 * base salary plus 3% for each year they have worked with the company, but not more than 30% of the base salary.
 * @param employee
 */
function calculateEmployeeSalary(employee: Employee, calculationDate: Date): number {
  // we might want to provide Date through arguments so we can calculate salary on a specific date
  const tenure = employee.getTenure(calculationDate);
  const bonus = (Math.min(30, tenure * 3) + 100) / 100;

  return currency(employee.baseSalary).multiply(bonus).value;
}

// Would adding a new Employee type break this?
function createSalaryCalculatorStrategy(employee: Employee): SalaryCalculatorStrategy {
  switch (employee.type) {
    case EmployeeType.Employee:
      return calculateEmployeeSalary;
    default:
      return calculateUnknownSalary;
  }
}

// Maybe we want to make parts of this async
export function calculateSalary(employee: Employee, calculationDate: Date): number {
  const strategy = createSalaryCalculatorStrategy(employee);
  return strategy(employee, calculationDate);
}
