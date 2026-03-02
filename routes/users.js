var express = require('express');
var router = express.Router();
let UserModel = require('../schemas/users');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => {
  let users = await UserModel.find({ isDeleted: false }).populate('role');
  res.status(200).send({ success: true, data: users });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  let user = await UserModel.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
  if (!user) return res.status(404).send({ success: false, message: 'User not found' });
  res.status(200).send({ success: true, data: user });
}));

router.post('/', asyncHandler(async (req, res) => {
  let newUser = new UserModel(req.body);
  let savedUser = await newUser.save();
  res.status(201).send({ success: true, data: savedUser });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  let updatedUser = await UserModel.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    req.body,
    { new: true }
  );
  if (!updatedUser) return res.status(404).send({ success: false, message: 'User not found' });
  res.status(200).send({ success: true, data: updatedUser });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  let deletedUser = await UserModel.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!deletedUser) return res.status(404).send({ success: false, message: 'User not found' });
  res.status(200).send({ success: true, data: deletedUser });
}));

router.post('/enable', asyncHandler(async (req, res) => {
  let { email, username } = req.body;
  let user = await UserModel.findOne({ email: email, username: username, isDeleted: false });
  if (!user) {
    return res.status(404).send({ success: false, message: 'Invalid email/username or User not found' });
  }
  user.status = true;
  await user.save();
  res.status(200).send({ success: true, message: 'User enabled successfully', data: user });
}));

router.post('/disable', asyncHandler(async (req, res) => {
  let { email, username } = req.body;
  let user = await UserModel.findOne({ email: email, username: username, isDeleted: false });
  if (!user) {
    return res.status(404).send({ success: false, message: 'Invalid email/username or User not found' });
  }
  user.status = false;
  await user.save();
  res.status(200).send({ success: true, message: 'User disabled successfully', data: user });
}));

module.exports = router;
