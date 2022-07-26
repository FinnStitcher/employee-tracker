const inquirer = require("inquirer");

const db = require("./db/connection");
const sql = require("./db/sql.js");

const dummyData = {
	employeeInvalidManager: ["Sarah", "Page", 9, 99],
};
// i'll come back to the manager test

// generate arrays for use in prompts where a list item needs to be selected
function getLists () {
    return db.promise().query(sql.viewAllNames).then(([rows]) => {
        let deptList = rows.map(element => element.name);
        let roleList = rows.map(element => element.title);
        let employeeList = rows.map(element => `${element.first_name} ${element.last_name}`);

        return {
            deptList,
            roleList,
            employeeList
        };
    });
};

function runPrompts (lists) {
    return inquirer.prompt([
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
                'View All Departments',
                'Quit'
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
        const changeOptions = ['Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'];

        // quit
        if (results.select === 'Quit') {
            console.log('Ending program');
        }
        // decide if we need to refresh the lists or not
        else if (changeOptions.indexOf(results.select) !== -1) {
            getLists().then(runPrompts);
        }
        else {
            runPrompts();
        };
    });
};

getLists().then(
    runPrompts
);