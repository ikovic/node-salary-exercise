import { Employee, Sales, Manager } from '../src/domain/Employee';
import { calculateSalary } from '../src/domain/SalaryCalculator';

const employeeFirst = new Employee({ name: 'Employee 1', dateJoined: new Date(2010, 1, 1) });
const employeeSecond = new Employee({ name: 'Employee 2', dateJoined: new Date(2012, 1, 1) });
const employeeThird = new Employee({ name: 'Employee 3', dateJoined: new Date(2014, 1, 1) });
const employeeFourth = new Employee({ name: 'Employee 4', dateJoined: new Date(2016, 1, 1) });

const managerFirst = new Manager({
  name: 'Manager 1',
  subordinates: [employeeSecond, employeeFourth],
  dateJoined: new Date(2014, 1, 1),
});
const managerSecond = new Manager({
  name: 'Manager 2',
  subordinates: [employeeThird, managerFirst],
  dateJoined: new Date(2012, 1, 1),
});

const salesFirst = new Sales({
  name: 'Sales 1',
  dateJoined: new Date(2012, 1, 1),
  subordinates: [employeeFirst, managerFirst],
});
const salesSecond = new Sales({
  name: 'Sales 2',
  dateJoined: new Date(2016, 1, 1),
  subordinates: [managerSecond],
});
const theBoss = new Sales({
  name: 'The Boss',
  dateJoined: new Date(2010, 1, 1),
  subordinates: [salesFirst, salesSecond],
});

// in real app we would have a repository of employees
function getAllEmployees(): Employee[] {
  return [
    employeeFirst,
    employeeSecond,
    employeeThird,
    employeeFourth,
    managerFirst,
    managerSecond,
    salesFirst,
    salesSecond,
  ];
}

describe('SalaryCalculator', () => {
  it('should calculate salary for regular employees', () => {
    expect(calculateSalary(employeeFirst, new Date())).toEqual(6500);
  });

  it('should calculate salary for managers with employees as subordinates', () => {
    expect(calculateSalary(managerFirst, new Date())).toEqual(7355);
  });

  it('should calculate salary for managers with employees and managers as subordinates', () => {
    expect(calculateSalary(managerSecond, new Date())).toEqual(7670.25);
  });

  it('should calculate salary for sales with employees and managers as subordinates', () => {
    expect(calculateSalary(salesFirst, new Date())).toEqual(6228.65);
  });

  it('should calculate salary for sales with managers as subordinates', () => {
    expect(calculateSalary(salesSecond, new Date())).toEqual(6245.26);
  });

  it('should calculate salary for sales with sales as subordinates', () => {
    expect(calculateSalary(theBoss, new Date())).toEqual(7114.47);
  });
});
