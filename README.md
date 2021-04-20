# node-salary-exercise

Code design practice. Used [node-typescript-template][project-template] to boostrap the project.

## Getting Started

To clone the repository use the following commands:

```sh
git clone https://github.com/ikovic/node-salary-exercise
cd node-salary-exercise
npm install
```

Application does not have an interface, use cases can be run by executing tests as described below.

## Available Scripts

- `clean` - remove coverage data, Jest cache and transpiled files,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests

## Problem statement

There is a company; the company can have staff members. Staff members are characterized by their name, date when they joined the company, and base salary (to keep it simple, consider this value equal for all staff member types by default.)
There are three types of staff members: Employee, Manager, Sales. Any staff member can have a supervisor. Any staff member except for Employee can have subordinates.
Employee salary - base salary plus 3% for each year they have worked with the company, but not more than 30% of the base salary.
Manager salary - base salary plus 5% for each year they have worked with the company (but not more than 40% of the base salary), plus 0.5% of salaries of their first level subordinates.
Sales salary - base salary plus 1% for each year they have worked with the company (but not more than 35% of the base salary) plus 0.3% of their subordinates' salaries of any level.
Staff members (except Employees) can have any number of subordinates of any type.

## Solution

I'll use this section of the readme to document the decision making process while solving the problem. I'll also point out the differences between the demo implementation and how a real world implementation would look like.

### Creating a staff member

Since each staff member type has associated business rules, we need to find the best representation for them. Creating a base `Employee` class that holds the common fields and behaviour made sense to me, both from the perspective of code reuse and creating an interface that the rest of the codebase can use.

Other extensions of the base class implement their peculiarities while still keeping the same interface. Real world implementation would probably involve more business rules related to object creation and adding subordinates. Subclassing this way might make the mapping between the relational database and the object model a bit more difficult.

### Employee hierarchy

For demo purposes, the easiest way to model this hierarchy was by storing the list of subordinates directly on the Employee object. Real world implementation would have to take more things into concern:
- how many employees there are
- are there any business rules that need to be enforced
- how do we fetch the employees
- how many other services/departments (besides salary) would depend on the employee hierarchy

Extracting this relationship into a separate entity (or service) might help depending on real use cases.

### Fetching subordinates

Depending on the implementation of the employee repository and the hierarchy, this would look much different in the real world. To simplify the implementation, in this example I traversed the employee hierarchy using recursion. This is possible since all the employees are represented as objects in memory. If we wanted to do this on the database level, we would either have to figure out an alternative representation or find a suitable mechanism for traversing tree structures.

### Calculating salary

Salary is calculated by first creating a `SalaryCalculator` for a specific date the salary is supposed to be calculated for. Then we can call the `calculate` method on the calculator which receives an `Employee` and synchronously returns the calculated salary. Results are cached, which solves the problem of repeated calculations of the salaray for the same employee but also introduces a problem: if you add another employee as a subordinate to another employee present in the cache, cache will go stale.

I would expect this to change a lot for a real world use case. First problem is creating a blocking task - calculation is done synchronously so if this was executed on a web server it would reduce its responsiveness. Even making the function async would still drain the server resources. We could fix this by doing the calculation in a separate process or in a separate service. For a small number of employees this wouldn't be an issue.

Another rough edge of this implementation is the calculation strategy - it depends on employee type, so if a new type is introduced, we would have to do a follow up update here as well.

[project-template]: https://github.com/jsynowiec/node-typescript-boilerplate
