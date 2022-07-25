const db = require('../db/connection');
const sql = require('../db/sql');

// return list of department names
// return list of role names
// return list of employee names (full)
const getEmployeeNames = () => {
    db.promise().query(sql.viewEmployee)
    .then(([rows]) => {
        const names = rows.map(element => `${element.first_name} ${element.last_name}`);
        return names;
    });
};

module.exports = {
    getEmployeeNames
};