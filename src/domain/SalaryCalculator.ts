import * as currency from 'currency.js';

import { Employee, EmployeeType, Manager, Sales } from './Employee';

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
  const tenure = employee.getTenure(calculationDate);
  const bonus = (Math.min(30, tenure * 3) + 100) / 100;

  return currency(employee.baseSalary).multiply(bonus).value;
}

/**
 * base salary plus 5% for each year they have worked with the company (but not more than 40% of the base salary),
 * plus 0.5% of salaries of their first level subordinates.
 */
function calculateManagerSalary(manager: Manager, calculationDate: Date): number {
  const tenure = manager.getTenure(calculationDate);
  const tenureBonus = (Math.min(40, tenure * 5) + 100) / 100;
  const subordinatesBonus = currency(0.05).multiply(
    manager.subordinates.reduce((sumOfSalaries, subordinate) => {
      const subordinateSalary = calculateSalary(subordinate, calculationDate);
      return currency(subordinateSalary).add(sumOfSalaries);
    }, currency(0)),
  );

  return currency(manager.baseSalary).multiply(tenureBonus).add(subordinatesBonus).value;
}

/**
 * base salary plus 1% for each year they have worked with the company (but not more than 35% of the base salary)
 * plus 0.3% of their subordinates' salaries of any level.
 */
function calculateSalesSalary(sales: Sales, calculationDate: Date): number {
  const tenure = sales.getTenure(calculationDate);
  const tenureBonus = (Math.min(35, tenure * 1) + 100) / 100;
  const subordinatesBonus = currency(0.03).multiply(
    sales.getAllSubordinates().reduce((sumOfSalaries, subordinate) => {
      const subordinateSalary = calculateSalary(subordinate, calculationDate);
      return currency(subordinateSalary).add(sumOfSalaries);
    }, currency(0)),
  );

  return currency(sales.baseSalary).multiply(tenureBonus).add(subordinatesBonus).value;
}

// Would adding a new Employee type break this?
function createSalaryCalculatorStrategy(employee: Employee): SalaryCalculatorStrategy {
  switch (employee.type) {
    case EmployeeType.Employee:
      return calculateEmployeeSalary;
    case EmployeeType.Manager:
      return calculateManagerSalary;
    case EmployeeType.Sales:
        return calculateSalesSalary;
    default:
      return calculateUnknownSalary;
  }
}

// Maybe we want to make parts of this async
export function calculateSalary(employee: Employee, calculationDate: Date): number {
  // reusable parts of the strategy could be moved upwards
  const strategy = createSalaryCalculatorStrategy(employee);
  return strategy(employee, calculationDate);
}
