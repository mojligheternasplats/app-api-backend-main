"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const getAllUsers = async (req, res) => {
    try {
        const users = await user_service_1.UserService.getAllUsers();
        // Optional: add pagination logic here if needed
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || users.length;
        const start = (page - 1) * limit;
        const paginated = users.slice(start, start + limit);
        res.json({
            data: paginated,
            total: users.length,
            page,
            limit,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const updateUser = async (req, res) => {
    try {
        const updated = await user_service_1.UserService.updateUser(req.params.id, req.body);
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await user_service_1.UserService.deleteUser(userId);
        res.json({ message: "User deleted" });
    }
    catch (error) {
        console.error("Delete error:", error); // ✅ log full error
        res.status(500).json({ error: error.message }); // ✅ return correct status
    }
};
exports.deleteUser = deleteUser;
