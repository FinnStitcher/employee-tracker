module.exports = {
	viewDept: `SELECT * FROM department`,
    viewDeptByName: `SELECT * FROM department WHERE name = ?`,
	addDept: `INSERT INTO department (name) VALUES (?)`,
	viewRole: `SELECT role.id, role.title, department.name AS department, salary
FROM role
JOIN department ON department.id = role.department_id`,
	addRole: `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
	viewEmployee: `SELECT e1.id, e1.first_name, e1.last_name,
role.title, department.name AS department, role.salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager
FROM employee e1
JOIN employee e2 ON e2.id = e1.manager_id
JOIN role ON role.id = e1.role_id
JOIN department ON department.id = role.department_id`,
	addEmployee: `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
	updateEmployeeRole: `UPDATE employee SET role_id = ? WHERE id = ?`,
};
