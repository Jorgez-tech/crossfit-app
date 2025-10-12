const memberService = require("../services/memberService");

const getAllMembers = async (_req, res, next) => {
  try {
    const members = await memberService.getAllMembers();
    res.send({ status: "OK", data: members });
  } catch (error) {
    next(error);
  }
};

const getOneMember = async (req, res, next) => {
  try {
    const member = await memberService.getOneMember(req.params.memberId);
    res.send({ status: "OK", data: member });
  } catch (error) {
    next(error);
  }
};

const createNewMember = async (req, res, next) => {
  try {
    const newMember = await memberService.createNewMember(req.body);
    res.status(201).send({ status: "OK", data: newMember });
  } catch (error) {
    next(error);
  }
};

const updateOneMember = async (req, res, next) => {
  try {
    const updatedMember = await memberService.updateOneMember(req.params.memberId, req.body);
    res.send({ status: "OK", data: updatedMember });
  } catch (error) {
    next(error);
  }
};

const deleteOneMember = async (req, res, next) => {
  try {
    await memberService.deleteOneMember(req.params.memberId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMembers,
  getOneMember,
  createNewMember,
  updateOneMember,
  deleteOneMember,
};