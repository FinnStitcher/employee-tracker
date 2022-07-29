const db = require('../db/connection');
const sql = require('../db/sql');

function viewDepts () {
    db.query(sql.viewDept, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
};

function viewRoles () {
    db.query(sql.viewRole, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    })
};

function viewEmployees() {
    db.query(sql.viewRole, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    })
}

module.exports = {
    viewDepts,
    viewRoles,
    viewEmployees
}