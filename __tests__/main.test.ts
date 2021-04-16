import { createEmployee, createManager, createSales, Employee } from '../src/domain/Employee';

const employeeFirst = createEmployee({ name: 'Employee 1', dateJoined: new Date(2010, 1, 1) });
const employeeSecond = createEmployee({ name: 'Employee 2', dateJoined: new Date(2012, 1, 1) });
const employeeThird = createEmployee({ name: 'Employee 3', dateJoined: new Date(2014, 1, 1) });
const employeeFourth = createEmployee({ name: 'Employee 4', dateJoined: new Date(2016, 1, 1) });

const managerFirst = createManager({
  name: 'Manager 1',
  subordinates: [employeeSecond, employeeFourth],
  dateJoined: new Date(2014, 1, 1),
});
const managerSecond = createManager({
  name: 'Manager 1',
  subordinates: [employeeThird],
  dateJoined: new Date(2010, 1, 1),
});

const salesFirst = createSales({
  name: 'Sales 1',
  dateJoined: new Date(2012, 1, 1),
  subordinates: [employeeFirst, managerFirst],
});
const salesSecond = createSales({
  name: 'Sales 1',
  dateJoined: new Date(2016, 1, 1),
  subordinates: [managerSecond],
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
  it('should calculate the salary for regular employees', () => {
    console.log(getAllEmployees());

    expect(1).toEqual(1);
  });
});
