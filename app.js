const inquirer = require("inquirer");

const db = require("./db/connection");
const sql = require("./db/sql.js");

const dummyData = {
	employeeInvalidManager: ["Sarah", "Page", 9, 99],
};
// i'll come back to the manager test

db.promise().query(sql.viewAllNames).then(([rows]) => {
    let deptList = rows.map(element => element.name);
    let roleList = rows.map(element => element.title);
    let employeeList = rows.map(element => `${element.first_name} ${element.last_name}`);

    return {
        deptList,
        roleList,
        employeeList
    };
})
.then(lists => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'select',
            message: 'What would you like to do?',
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
            type: 'list',
            name: 'roleDept',
            message: 'What department does the role belong to?',
            choices: [...lists.deptList],
            when: prev => prev.select === 'Add Role'
        },
        {
            type: 'input',
            name: 'employeeForename',
            message: 'What is the employee\'s first name?',
            when: prev => prev.select === 'Add Employee'
        },
        {
            type: 'input',
            name: 'employeeSurname',
            message: 'What is the employee\'s last name?',
            when: prev => prev.select === 'Add Employee'
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'What is the employee\'s role?',
            choices: [...lists.roleList],
            when: prev => prev.select === 'Add Employee'
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: 'Who is the employee\'s manager?',
            choices: [...lists.employeeList],
            when: prev => prev.select === 'Add Employee'
        },
        {
            type: 'list',
            name: 'updateRoleName',
            message: 'Which employee do you want to update?',
            choices: [...lists.employeeList],
            when: prev => prev.select === 'Update Employee Role'
        },
        {
            type: 'list',
            name: 'updateRoleRole',
            message: 'What should their role be updated to?',
            choices: [...lists.roleList],
            when: prev => prev.select === 'Update Employee Role'
        }
    ])
    .then(results => {
        console.log(results)
    });
});

// i'm thinking when the application begins, it'll initialize a list of departments, roles, and possible managers based on what's already in the database?
// oh, but i would have to make it possible for that to run repeatedly as necessary
// so it'll be in a function

// inquirer.prompt([
//     {
//         type: 'list',
//         name: 'select',
//         message: 'What would you like to do?',
//         choices: [
//             'Add Employee',
//             'View All Employees',
//             'Update Employee Role',
//             'Add Role',
//             'View All Roles',
//             'Add Department',
//             'View All Departments'
//         ]
//     },
//     {
//         type: 'input',
//         name: 'deptName',
//         message: 'What is the name of the department?',
//         when: prev => prev.select === 'Add Department'
//     },
//     {
//         type: 'input',
//         name: 'roleName',
//         message: 'What is the name of the role?',
//         when: prev => prev.select === 'Add Role'
//     },
//     {
//         type: 'input',
//         name: 'roleSalary',
//         message: 'What is the salary of the role?',
//         when: prev => prev.select === 'Add Role'
//     },
//     {
//         type: 'list',
//         name: 'roleDept',
//         message: 'What department does the role belong to?',
//         choices: [...deptList],
//         when: prev => prev.select === 'Add Role'
//     },
//     {
//         type: 'input',
//         name: 'employeeForename',
//         message: 'What is the employee\'s first name?',
//         when: prev => prev.select === 'Add Employee'
//     },
//     {
//         type: 'input',
//         name: 'employeeSurname',
//         message: 'What is the employee\'s last name?',
//         when: prev => prev.select === 'Add Employee'
//     },
//     {
//         type: 'list',
//         name: 'employeeRole',
//         message: 'What is the employee\'s role?',
//         choices: [...roleList],
//         when: prev => prev.select === 'Add Employee'
//     },
//     {
//         type: 'list',
//         name: 'employeeManager',
//         message: 'Who is the employee\'s manager?',
//         choices: [...employeeList],
//         when: prev => prev.select === 'Add Employee'
//     },
//     {
//         type: 'list',
//         name: 'updateRoleName',
//         message: 'Which employee do you want to update?',
//         choices: [...employeeList],
//         when: prev => prev.select === 'Update Employee Role'
//     },
//     {
//         type: 'list',
//         name: 'updateRoleRole',
//         message: 'What should their role be updated to?',
//         choices: [...roleList],
//         when: prev => prev.select === 'Update Employee Role'
//     }
// ])
// .then(results => {
//     console.log(results)
// });
// .then(results => {
//     switch (results.select) {
//         case 'Add Employee': {
//             const params = [results.employeeForename, results.employeeSurname, results.employeeRole, results.employeeManager];
//         }
//         case 'View All Employees': {

//         }
//         case 'Update Employee Role': {

//         }
//         case 'Add Role': {

//         }
//         case 'View All Roles': {

//         }
//         case 'Add Department': {

//         }
//         case 'View All Departments': {

//         }
//     }
// });
