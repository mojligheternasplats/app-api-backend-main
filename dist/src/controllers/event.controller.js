"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventBySlug = exports.getEventById = exports.getAllEvents = void 0;
const event_service_1 = require("../services/event.service");
const getAllEvents = async (req, res) => {
    try {
        const { page = "1", limit = "10", search } = req.query;
        const result = await event_service_1.EventService.getAll(Number(page), Number(limit), search);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllEvents = getAllEvents;
const getEventById = async (req, res) => {
    try {
        const event = await event_service_1.EventService.getById(req.params.id);
        if (!event)
            return res.status(404).json({ error: "Event not found" });
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getEventById = getEventById;
const getEventBySlug = async (req, res) => {
    try {
        const event = await event_service_1.EventService.getBySlug(req.params.slug);
        if (!event)
            return res.status(404).json({ error: "Event not found" });
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getEventBySlug = getEventBySlug;
const createEvent = async (req, res) => {
    try {
        const event = await event_service_1.EventService.createEvent(req.body);
        res.status(201).json(event);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    try {
        const updated = await event_service_1.EventService.updateEvent(req.params.id, req.body);
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        await event_service_1.EventService.deleteEvent(req.params.id);
        res.json({ message: "Event deleted" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteEvent = deleteEvent;
