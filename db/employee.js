const knex = require("./knex");

function createEmployee(employee) {
    return knex("employees").insert(employee);
};

function getAllEmployees() {
    return knex("employees").select("*");
};

function deleteEmployee(id) {
    return knex("employees").where("id", id).del();
};

function updateEmployee(id, employee) {
    return knex("employees").where("id", id).update(employee);
};

module.exports = {
    createEmployee,
    getAllEmployees,
    deleteEmployee,
    updateEmployee
}