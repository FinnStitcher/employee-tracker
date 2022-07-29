const inquirer = require("inquirer");

const db = require("./db/connection");
const sql = require("./db/sql.js");
const printQueries = require('./utils/printQueries');

const dummyData = {
	employeeInvalidManager: ["Sarah", "Page", 9, 99],
};
// i'll come back to the manager test

// getLists() calls runPrompts()
// maybe i could or should restructure this to use a then() statement, but that can come later
// making this work as-is took long enough

function getLists (listData = {}) {
    // might not need all these if statements but honestly whatever i just want this to work
    if (!listData.deptList) {
        // add property
        listData.deptList = [];
        // run query
        db.promise().query(sql.viewDept).then(([rows]) => {
            const list = rows.map(element => `${element.id} - ${element.name}`);
            listData.deptList = [...list];

            // loop
            getLists(listData);
        });
    } else if (!listData.roleList) {
        listData.roleList = [];

        db.promise().query(sql.viewRole).then(([rows]) => {
            const list = rows.map(element => `${element.id} - ${element.title}`);
            listData.roleList = [...list];

            getLists(listData);
        });
    } else if (!listData.employeeList) {
        listData.employeeList = [];

        db.promise().query(sql.viewEmployee).then(([rows]) => {
            const list = rows.map(element => `${element.id} - ${element.first_name} ${element.last_name}`);
            listData.employeeList = [...list];
            listData.employeeList.push('N/A');

            getLists(listData);
        });
    } else {
        runPrompts(listData);
    };
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
            choices: lists.deptList,
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
            choices: lists.roleList,
            when: prev => prev.select === 'Add Employee'
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: 'Who is the employee\'s manager?',
            choices: lists.employeeList,
            when: prev => prev.select === 'Add Employee'
        },
        {
            type: 'list',
            name: 'updateRoleName',
            message: 'Which employee do you want to update?',
            choices: lists.employeeList,
            when: prev => prev.select === 'Update Employee Role'
        },
        {
            type: 'list',
            name: 'updateRoleRole',
            message: 'What should their role be updated to?',
            choices: lists.roleList,
            when: prev => prev.select === 'Update Employee Role'
        }
    ])
    // queries and stuff are made here
    .then(results => {
        // breaking apart results into more manageable bits
        const {select, ...submitToDb} = results;

        const printOptions = ['View All Departments', 'View All Roles', 'View All Employees'];
        const changeOptions = ['Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'];

        switch (select) {
            case select === 'View All Departments': {
                db.query(sql.viewDept, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.table(rows);
                });                
            }
            case select === 'View All Roles': {
                db.query(sql.viewRole, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.table(rows);
                });
            }
            case select === 'View All Employees': {
                db.query(sql.viewEmployees, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.table(rows);
                }); 
            }
        }

        // if a print option was selected
        if (printOptions.indexOf(select) !== -1) {
            if (select === 'View All Departments') {

            }
        // if a change options was selected
        }
        if (changeOptions.indexOf(select) !== -1) {
        };

        return select;
    })
    // recursion happens here
    .then(selection => {
        if (selection !== "Quit") {
            getLists()
        } else {
            console.log('Ending program.');
        };
    });
};

getLists();