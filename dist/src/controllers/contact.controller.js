"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.updateMessage = exports.createMessage = exports.getMessageById = exports.getAllMessages = void 0;
const contact_service_1 = require("../services/contact.service");
const getAllMessages = async (req, res) => {
    try {
        const { page = "1", limit = "10", status } = req.query;
        const result = await contact_service_1.ContactService.getAll(Number(page), Number(limit), status);
        return res.json(result); // ✅ Already structured as { data, total, page, limit }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getAllMessages = getAllMessages;
const getMessageById = async (req, res) => {
    try {
        const msg = await contact_service_1.ContactService.getById(req.params.id);
        if (!msg)
            return res.status(404).json({ error: "Message not found" });
        return res.json(msg);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getMessageById = getMessageById;
const createMessage = async (req, res) => {
    try {
        const message = await contact_service_1.ContactService.createMessage(req.body);
        return res.status(201).json(message);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.createMessage = createMessage;
const updateMessage = async (req, res) => {
    try {
        const updated = await contact_service_1.ContactService.updateMessage(req.params.id, req.body);
        return res.json(updated);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.updateMessage = updateMessage;
const deleteMessage = async (req, res) => {
    try {
        await contact_service_1.ContactService.deleteMessage(req.params.id);
        return res.json({ message: "Message deleted" });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.deleteMessage = deleteMessage;
