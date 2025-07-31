// In src/database/Member.js
const DB = require("./db.json");
const { saveToDatabase } = require("./utils");

const getAllMembers = () => {
  try {
    return DB.members;
  } catch (error) {
    throw { status: 500, message: error };
  }
};

const getOneMember = (memberId) => {
  try {
    const member = DB.members.find((m) => m.id === memberId);
    if (!member) {
      throw { status: 404, message: `Member with id '${memberId}' not found` };
    }
    return member;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const createNewMember = (newMember) => {
  try {
    const isAlreadyAdded =
      DB.members.findIndex((m) => m.email === newMember.email) > -1;
    if (isAlreadyAdded) {
      throw { status: 400, message: `Member with email '${newMember.email}' already exists` };
    }
    DB.members.push(newMember);
    saveToDatabase(DB);
    return newMember;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const updateOneMember = (memberId, changes) => {
  try {
    const index = DB.members.findIndex((m) => m.id === memberId);
    if (index === -1) {
      throw { status: 404, message: `Member with id '${memberId}' not found` };
    }
    const updatedMember = { ...DB.members[index], ...changes };
    DB.members[index] = updatedMember;
    saveToDatabase(DB);
    return updatedMember;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const deleteOneMember = (memberId) => {
  try {
    const index = DB.members.findIndex((m) => m.id === memberId);
    if (index === -1) {
      throw { status: 404, message: `Member with id '${memberId}' not found` };
    }
    DB.members.splice(index, 1);
    saveToDatabase(DB);
    return true;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

module.exports = {
  getAllMembers,
  getOneMember,
  createNewMember,
  updateOneMember,
  deleteOneMember,
};
