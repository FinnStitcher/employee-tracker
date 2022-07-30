const inquirer = require("inquirer");

const db = require("./db/connection");
const sql = require("./db/sql.js");

// getLists() calls runPrompts()
// maybe i could or should restructure this to use a then() statement, but that can come later
// making this work as-is took long enough

function validateString (string) {
    const parsedAsInt = parseInt(string);

    if (string.length > 30) {
        console.log(`
        This string is too long.`);
        return false;
    } else if (isNaN(parsedAsInt) === false) {
        console.log(`
        Please enter a string, not a number.`);
        return false;
    } else {
        return true;
    };
};

function validateSalary (number) {
    const parsedAsInt = parseInt(number);

    if (isNaN(parsedAsInt) === true) {
        console.log(`
        Please enter a number.`);
        return false;
    } else {
        return true;
    }
};

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
            validate: answer => validateString(answer),
            when: prev => prev.select === 'Add Department'
        },
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the role?',
            validate: answer => validateString(answer),
            when: prev => prev.select === 'Add Role'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?',
            validate: answer => validateSalary(answer),
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
            validate: answer => validateString(answer),
            when: prev => prev.select === 'Add Employee'
        },
        {
            type: 'input',
            name: 'employeeSurname',
            message: 'What is the employee\'s last name?',
            validate: answer => validateString(answer),
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
        // breaking apart results into more manageable parts
        const {select, ...submitToDb} = results;

        // oh boy if statements
        // for some reason a switch statement didn't work
        if (select === 'View All Departments') {
            db.query(sql.viewDept, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
            });
        }
        if (select === 'View All Roles') {
            db.query(sql.viewRole, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
            });
        }
        if (select === 'View All Employees') {
            db.query(sql.viewEmployee, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(rows);
            }); 
        }
        if (select === 'Add Department') {
            db.query(sql.addDept, [submitToDb.deptName], (err) => {
                if (err) {
                    console.log(err);
                    return;
                };
                console.log('New department was added.');
            });
        }
        if (select === 'Add Role') {
            // get the id of the department this role belongs to
            // what we're doing here is splitting the roleDept property, taking the first item in the new array (the number)
            // and parsing it into an integer
            const deptId = parseInt(submitToDb.roleDept.split(' - ')[0]);
            submitToDb.roleDept = deptId;

            // convert salary into an integer
            const salary = parseInt(submitToDb.roleSalary);
            submitToDb.roleSalary = salary;

            db.query(sql.addRole, Object.values(submitToDb), (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('New role was added.');
            })
        }
        if (select === 'Add Employee') {
            // getting an integer id for the role out of the string its in
            const roleId = parseInt(submitToDb.employeeRole.split(' - ')[0]);
            submitToDb.employeeRole = roleId;

            // getting an integer id for the manager
            const managerId = parseInt(submitToDb.employeeManager.split(' - ')[0]);
            submitToDb.employeeManager = managerId;

            db.query(sql.addEmployee, Object.values(submitToDb), (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('New employee was added.');
            })
        }
        if (select === 'Update Employee Role') {
            // again, getting integer ids out of the strings they're in
            const employeeId = parseInt(submitToDb.updateRoleName.split(' - ')[0]);
            const roleId = parseInt(submitToDb.updateRoleRole.split(' - ')[0]);

            // the placeholders in the query are in the opposite order of the relevant prompts
            // so we don't update submitToDb, we just put an array right in there
            db.query(sql.updateEmployeeRole, [roleId, employeeId], (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('That employee has been updated.');
            })
        }

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