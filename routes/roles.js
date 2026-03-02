var express = require('express');
var router = express.Router();
let RoleModel = require('../schemas/roles');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => {
    let roles = await RoleModel.find({ isDeleted: false });
    res.status(200).send({ success: true, data: roles });
}));

router.get('/:id', asyncHandler(async (req, res) => {
    let role = await RoleModel.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) return res.status(404).send({ success: false, message: 'Role not found' });
    res.status(200).send({ success: true, data: role });
}));

router.post('/', asyncHandler(async (req, res) => {
    let newRole = new RoleModel(req.body);
    let savedRole = await newRole.save();
    res.status(201).send({ success: true, data: savedRole });
}));

router.put('/:id', asyncHandler(async (req, res) => {
    let updatedRole = await RoleModel.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        req.body,
        { new: true }
    );
    if (!updatedRole) return res.status(404).send({ success: false, message: 'Role not found' });
    res.status(200).send({ success: true, data: updatedRole });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    let deletedRole = await RoleModel.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { isDeleted: true },
        { new: true }
    );
    if (!deletedRole) return res.status(404).send({ success: false, message: 'Role not found' });
    res.status(200).send({ success: true, data: deletedRole });
}));

module.exports = router;
