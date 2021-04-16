# node-salary-exercise

Code design practice. Used [node-typescript-template][project-template] to boostrap the project.

## Getting Started

To clone the repository use the following commands:

```sh
git clone https://github.com/ikovic/node-salary-exercise
cd node-salary-exercise
npm install
```

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

I'll use this section of the readme to document the decision making process while solving the problem.

### Creating a staff member

Since each staff member type has associated business rules, we need to find the best representation for them. Since the rest of the application needs a uniform interface, I'll start with that and then see how to reduce duplication when creating objects.

Remaining issue: duplication in factory functions. Also, we might want to add methods to these objects.

[project-template]: https://github.com/jsynowiec/node-typescript-boilerplate
