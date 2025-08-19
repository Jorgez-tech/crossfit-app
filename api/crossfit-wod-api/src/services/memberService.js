// In src/services/memberService.js
const { v4: uuid } = require("uuid");
const Member = require("../database/Member");

const getAllMembers = async () => {
  try {
    return await Member.getAllMembers();
  } catch (error) {
    throw error;
  }
};

const getOneMember = async (memberId) => {
  try {
    return await Member.getOneMember(memberId);
  } catch (error) {
    throw error;
  }
};

const createNewMember = async (memberData) => {
  const memberToInsert = {
    ...memberData,
    id: uuid(),
  };
  try {
    return await Member.createNewMember(memberToInsert);
  } catch (error) {
    throw error;
  }
};

const updateOneMember = async (memberId, changes) => {
  try {
    return await Member.updateOneMember(memberId, changes);
  } catch (error) {
    throw error;
  }
};

const deleteOneMember = async (memberId) => {
  try {
    return await Member.deleteOneMember(memberId);
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
