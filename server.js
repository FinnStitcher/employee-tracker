const inquirer = require('inquirer');

const db = require('./db/connection');
const sql = require('./db/sql.js');

const dummyData = {
    employeeInvalidManager: ['Sarah', 'Page', 9, 99],
};
// i'll come back to the manager test

// i'm thinking when the application begins, it'll initialize a list of departments, roles, and possible managers based on what's already in the database?
// oh, but i would have to make it possible for that to run repeatedly as necessary
// so it'll be in a function

inquirer.prompt([
    {
        type: 'list',
        name: 'select',
        messsage: 'What would you like to do?',
        choices: [
            'Add Employee',
            'View All Employees',
            'Update Employee Role',
            'Add Role',
            'View All Roles',
            'Add Department',
            'View All Departments'
        ]
    },
    {
        type: 'input',
        name: 'deptName',
        message: 'What is the name of the department?',
        when: prev => prev.select === 'Add Department'
    },
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
        when: prev => prev.select === 'Add Role'
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary of the role?',
        when: prev => prev.select === 'Add Role'
    },
    {
        type: 'input', // temp
        name: 'roleDept',
        message: 'What department does the role belong to?',
        // could have a choices option here that's filled with the return of a function?
        when: prev => prev.select === 'Add Role'
    },
    {
        type: 'input',
        name: 'employForename',
        message: 'What is the employee\'s first name?',
        when: prev => prev.select === 'Add Employee'
    },
    {
        type: 'input',
        name: 'employSurname',
        message: 'What is the employee\'s last name?',
        when: prev => prev.select === 'Add Employee'
    },
    {
        type: 'input', //temp
        name: 'employRole',
        message: 'What is the employee\'s role?',
        when: prev => prev.select === 'Add Employee'
    },
    {
        type: 'input', //temp
        name: 'employManager',
        message: 'Who is the employee\'s manager?',
        when: prev => prev.select === 'Add Employee'
    },
    {
        type: 'input', //temp
        name: 'updateRoleName',
        message: 'Which employee do you want to update?',
        when: prev => prev.select === 'Update Employee Role'
    },
    {
        type: 'input', //temp
        name: 'updateRoleRole',
        message: 'What should their role be updated to?',
        when: prev => prev.select === 'Update Employee Role'
    }
]);