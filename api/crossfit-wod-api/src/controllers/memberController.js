const memberService = require("../services/memberService");

const getAllMembers = async (req, res) => {
  try {
    const members = await memberService.getAllMembers();
    res.send({ status: "OK", data: members });
  } catch (error) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getOneMember = async (req, res) => {
  const { memberId } = req.params;
  try {
    const member = await memberService.getOneMember(memberId);
    res.send({ status: "OK", data: member });
  } catch (error) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const createNewMember = async (req, res) => {
  const { body } = req;
  if (!body.name || !body.gender || !body.dateOfBirth || !body.email || !body.password) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "Missing required fields: 'name', 'gender', 'dateOfBirth', 'email', 'password'" }
    });
  }
  try {
    const newMember = await memberService.createNewMember(body);
    res.status(201).send({ status: "OK", data: newMember });
  } catch (error) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const updateOneMember = async (req, res) => {
  const { memberId } = req.params;
  const { body } = req;
  try {
    const updatedMember = await memberService.updateOneMember(memberId, body);
    res.send({ status: "OK", data: updatedMember });
  } catch (error) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const deleteOneMember = async (req, res) => {
  const { memberId } = req.params;
  try {
    await memberService.deleteOneMember(memberId);
    res.status(204).send();
  } catch (error) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  getAllMembers,
  getOneMember,
  createNewMember,
  updateOneMember,
  deleteOneMember,
};