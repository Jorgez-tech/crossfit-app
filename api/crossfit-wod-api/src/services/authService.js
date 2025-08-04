// Servicio de autenticación
// Métodos: crear usuario, validar usuario, generar/verificar JWT


const knex = require('../database/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';
const JWT_EXPIRES_IN = '2h';

async function register({ name, email, password, role }) {
    // Validar datos mínimos
    if (!name || !email || !password || !role) {
        throw { status: 400, message: 'Faltan campos obligatorios' };
    }
    // Verificar si el usuario ya existe
    const existing = await knex('users').where({ email }).first();
    if (existing) {
        throw { status: 409, message: 'El email ya está registrado' };
    }
    // Hashear password
    const password_hash = await bcrypt.hash(password, 10);
    // Insertar usuario
    const [id] = await knex('users').insert({ name, email, password_hash, role });
    return { id, name, email, role };
}

async function login({ email, password }) {
    if (!email || !password) {
        throw { status: 400, message: 'Faltan credenciales' };
    }
    const user = await knex('users').where({ email }).first();
    if (!user) {
        throw { status: 401, message: 'Usuario o contraseña incorrectos' };
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        throw { status: 401, message: 'Usuario o contraseña incorrectos' };
    }
    // Generar JWT
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

module.exports = {
    register,
    login
};
