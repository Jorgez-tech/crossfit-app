// In src/database/Member.js
const knex = require('./knex');

const getAllMembers = async () => {
  try {
    return await knex('users').select('id', 'name', 'email', 'role');
  } catch (error) {
    throw { status: 500, message: error };
  }
};

const getOneMember = async (memberId) => {
  try {
    const member = await knex('users').where({ id: memberId }).first();
    if (!member) {
      throw { status: 404, message: `Member with id '${memberId}' not found` };
    }
    return member;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const createNewMember = async (newMember) => {
  try {
    const existing = await knex('users').where({ email: newMember.email }).first();
    if (existing) {
      throw { status: 400, message: `Member with email '${newMember.email}' already exists` };
    }
    const [id] = await knex('users').insert(newMember);
    return { id, ...newMember };
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const updateOneMember = async (memberId, changes) => {
  try {
    const updated = await knex('users').where({ id: memberId }).update(changes);
    if (!updated) {
      throw { status: 404, message: `Member with id '${memberId}' not found` };
    }
    return await knex('users').where({ id: memberId }).first();
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const deleteOneMember = async (memberId) => {
  try {
    const deleted = await knex('users').where({ id: memberId }).del();
    if (!deleted) {
      throw { status: 404, message: `Member with id '${memberId}' not found` };
    }
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
