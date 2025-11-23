"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.me = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const user_repository_1 = require("../repositories/user.repository");
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        console.log(email);
        const result = await auth_service_1.AuthService.register(email, password, firstName, lastName);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await auth_service_1.AuthService.login(email, password);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        const code = error.code || error.message;
        if (code === "EMAIL_NOT_FOUND") {
            return res.status(404).json({ error: "EMAIL_NOT_FOUND" });
        }
        if (code === "WRONG_PASSWORD") {
            return res.status(401).json({ error: "WRONG_PASSWORD" });
        }
        res.status(400).json({ error: "UNKNOWN_ERROR" });
    }
};
exports.login = login;
const me = async (req, res) => {
    try {
        // req.user comes from auth middleware
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "UNAUTHORIZED" });
        }
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "USER_NOT_FOUND" });
        }
        // Remove password from response
        const { password, ...safeUser } = user;
        res.json(safeUser);
    }
    catch (error) {
        res.status(500).json({ error: "FAILED_TO_FETCH_PROFILE" });
    }
};
exports.me = me;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "UNAUTHORIZED" });
        }
        const { firstName, lastName, email } = req.body;
        // Validate (optional but recommended)
        if (!email || email.trim() === "") {
            return res.status(400).json({ error: "EMAIL_REQUIRED" });
        }
        const updatedUser = await user_repository_1.UserRepository.update(userId, {
            firstName,
            lastName,
            email,
        });
        const { password, ...safeUser } = updatedUser;
        return res.json(safeUser);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "FAILED_TO_UPDATE_PROFILE" });
    }
};
exports.updateProfile = updateProfile;
