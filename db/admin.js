const knex = require("./knex");

function createAdmin(admin) {
    return knex("admins").insert(admin);
};

function getAllAdmins() {
    return knex("admins").select("*");
};

function deleteAdmin(id) {
    return knex("admins").where("id", id).del();
};

function updateAdmin(id, admin) {
    return knex("admins").where("id", id).update(admin);
};

module.exports = {
    createAdmin,
    getAllAdmins,
    deleteAdmin,
    updateAdmin
}