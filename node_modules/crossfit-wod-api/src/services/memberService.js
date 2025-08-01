// In src/services/memberService.js
const { v4: uuid } = require("uuid");
const Member = require("../database/Member");

const getAllMembers = () => {
  try {
    return Member.getAllMembers();
  } catch (error) {
    throw error;
  }
};

const getOneMember = (memberId) => {
  try {
    return Member.getOneMember(memberId);
  } catch (error) {
    throw error;
  }
};

const createNewMember = (memberData) => {
  const memberToInsert = {
    ...memberData,
    id: uuid(),
  };
  try {
    return Member.createNewMember(memberToInsert);
  } catch (error) {
    throw error;
  }
};

const updateOneMember = (memberId, changes) => {
  try {
    return Member.updateOneMember(memberId, changes);
  } catch (error) {
    throw error;
  }
};

const deleteOneMember = (memberId) => {
  try {
    return Member.deleteOneMember(memberId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllMembers,
  getOneMember,
  createNewMember,
  updateOneMember,
  deleteOneMember,
};
