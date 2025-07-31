const memberService = require("../services/memberService");

const getAllMembers = (req, res) => {
  try {
    const members = memberService.getAllMembers();
    res.send({ status: "OK", data: members });
  } catch (error) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getOneMember = (req, res) => {
  const { memberId } = req.params;
  try {
    const member = memberService.getOneMember(memberId);
    res.send({ status: "OK", data: member });
  } catch (error) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const createNewMember = (req, res) => {
  const { body } = req;
  if (!body.name || !body.gender || !body.dateOfBirth || !body.email || !body.password) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "Missing required fields: 'name', 'gender', 'dateOfBirth', 'email', 'password'" }
    });
  }
  try {
    const newMember = memberService.createNewMember(body);
    res.status(201).send({ status: "OK", data: newMember });
  } catch (error) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const updateOneMember = (req, res) => {
  const { memberId } = req.params;
  const { body } = req;
  try {
    const updatedMember = memberService.updateOneMember(memberId, body);
    res.send({ status: "OK", data: updatedMember });
  } catch (error) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const deleteOneMember = (req, res) => {
  const { memberId } = req.params;
  try {
    memberService.deleteOneMember(memberId);
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