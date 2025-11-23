"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePartner = exports.updatePartner = exports.createPartner = exports.getPartnerBySlug = exports.getPartnerById = exports.getAllPartners = void 0;
const partner_service_1 = require("../services/partner.service");
const getAllPartners = async (req, res) => {
    try {
        const { page = "1", limit = "10", search } = req.query;
        const result = await partner_service_1.PartnerService.getAll(Number(page), Number(limit), search);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllPartners = getAllPartners;
const getPartnerById = async (req, res) => {
    try {
        const item = await partner_service_1.PartnerService.getById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Partner not found" });
        }
        res.json(item);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getPartnerById = getPartnerById;
const getPartnerBySlug = async (req, res) => {
    try {
        const item = await partner_service_1.PartnerService.getBySlug(req.params.slug);
        if (!item) {
            return res.status(404).json({ error: "Partner not found" });
        }
        res.json(item);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getPartnerBySlug = getPartnerBySlug;
const createPartner = async (req, res) => {
    try {
        // logoUrl + logoPublicId can be added by your upload middleware
        const created = await partner_service_1.PartnerService.createPartner(req.body);
        res.status(201).json(created);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createPartner = createPartner;
const updatePartner = async (req, res) => {
    try {
        const updated = await partner_service_1.PartnerService.updatePartner(req.params.id, req.body // may include logoUrl or logoPublicId
        );
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.updatePartner = updatePartner;
const deletePartner = async (req, res) => {
    try {
        await partner_service_1.PartnerService.deletePartner(req.params.id);
        res.json({ message: "Partner deleted" });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.deletePartner = deletePartner;
