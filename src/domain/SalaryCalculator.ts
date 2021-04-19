import * as currency from 'currency.js';

import { Employee, EmployeeType, Manager, Sales, getSubordinatesAcrossLevels } from './Employee';

type EmployeeName = string;
type EmployeeSalary = number;
type SalaryCalculatorStrategy = (Calculator, Employee) => EmployeeSalary;

interface Calculator {
  calculationDate: Date;
  calculate: (Employee) => EmployeeSalary;
}

const UNKNOWN_SALARY = 0;

/**
 * Treats special cases.
 */
function calculateUnknownSalary(calculator: Calculator, employee: Employee): number {
  return UNKNOWN_SALARY;
}

/**
 * base salary plus 3% for each year they have worked with the company, but not more than 30% of the base salary.
 * @param employee
 */
function calculateEmployeeSalary(calculator: Calculator, employee: Employee): number {
  const tenure = employee.getTenure(calculator.calculationDate);
  const bonus = (Math.min(30, tenure * 3) + 100) / 100;

  return currency(employee.baseSalary).multiply(bonus).value;
}

/**
 * base salary plus 5% for each year they have worked with the company (but not more than 40% of the base salary),
 * plus 0.5% of salaries of their first level subordinates.
 */
function calculateManagerSalary(calculator: Calculator, manager: Manager): number {
  const tenure = manager.getTenure(calculator.calculationDate);
  const tenureBonus = (Math.min(40, tenure * 5) + 100) / 100;
  const subordinatesBonus = currency(0.05).multiply(
    manager.subordinates.reduce((sumOfSalaries, subordinate) => {
      const subordinateSalary = calculator.calculate(subordinate);
      return currency(subordinateSalary).add(sumOfSalaries);
    }, currency(0)),
  );

  return currency(manager.baseSalary).multiply(tenureBonus).add(subordinatesBonus).value;
}

/**
 * base salary plus 1% for each year they have worked with the company (but not more than 35% of the base salary)
 * plus 0.3% of their subordinates' salaries of any level.
 */
function calculateSalesSalary(calculator: Calculator, sales: Sales): number {
  const tenure = sales.getTenure(calculator.calculationDate);
  const tenureBonus = (Math.min(35, tenure * 1) + 100) / 100;
  const subordinatesBonus = currency(0.03).multiply(
    getSubordinatesAcrossLevels(sales).reduce((sumOfSalaries, subordinate) => {
      const subordinateSalary = calculator.calculate(subordinate);
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

export class SalaryCalculator implements Calculator {
  calculationDate: Date;
  private cache: Map<EmployeeName, EmployeeSalary>;

  constructor(calculationDate: Date) {
    this.cache = new Map<EmployeeName, EmployeeSalary>();
    this.calculationDate = calculationDate;
  }

  calculate(employee: Employee): number {
    if (this.cache.has(employee.name)) {
      return this.cache.get(employee.name);
    }

    const strategy = createSalaryCalculatorStrategy(employee);
    const salary = strategy(this, employee);
    this.cache.set(employee.name, salary);

    return salary;
  }
}

export function batchCalculateSalary(employees: Employee[], calculationDate: Date): number {
  const calculator = new SalaryCalculator(calculationDate);

  return employees.reduce((sumOfSalaries, employee) => sumOfSalaries + calculator.calculate(employee), 0);
}
