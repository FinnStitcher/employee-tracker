module.exports = {
	viewAllNames: `SELECT department.name, role.title, employee.first_name, employee.last_name
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.id = employee.role_id`,
	viewDept: `SELECT * FROM department`,
	addDept: `INSERT INTO department (name) VALUES (?)`,
	viewRole: `SELECT role.id, role.title, department.name AS department, salary
FROM role
JOIN department ON department.id = role.department_id`,
	addRole: `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
	viewEmployee: `SELECT employee.id, employee.first_name, employee.last_name,
role.title, department.name AS department, role.salary
FROM employee
JOIN role ON role.id = employee.role_id
JOIN department ON department.id = role.department_id`,
	addEmployee: `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
	updateEmployeeRole: `UPDATE employee SET role_id = ? WHERE id = ?`,
};
