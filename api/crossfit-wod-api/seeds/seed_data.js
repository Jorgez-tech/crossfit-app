/**
 * Seed de datos de prueba para Alto Rendimiento 360
 * Ejecuta: npx knex seed:run
 *
 * Seguridad: No incluya contraseñas reales en el repositorio. Este seed
 * leerá contraseñas de las variables de entorno:
 * - DEV_TRAINER_PASSWORD
 * - DEV_ATHLETE_PASSWORD
 * Si no existen, el seed genera contraseñas seguras al vuelo y las imprime
 * en la salida estándar (solo para uso local).
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');

function genPassword(len = 12) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4)).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, len);
}

exports.seed = async function (knex) {
    // Borra datos existentes (orden importa por claves foráneas)
    await knex('records').del();
    await knex('wod_assignments').del();
    await knex('wods').del();
    await knex('users').del();

    // Leer contraseñas desde variables de entorno o generarlas en tiempo de ejecución
    const trainerPassword = process.env.DEV_TRAINER_PASSWORD || genPassword(12);
    const athletePassword = process.env.DEV_ATHLETE_PASSWORD || genPassword(12);

    // Aviso: solo imprimimos las credenciales cuando no vienen de variables de entorno
    if (!process.env.DEV_TRAINER_PASSWORD || !process.env.DEV_ATHLETE_PASSWORD) {
        console.log('Seed: credenciales generadas para desarrollo (no están en el repo):');
        console.log(`  entrenador -> email: carlos@box.com  password: ${trainerPassword}`);
        console.log(`  atleta     -> email: ana@box.com     password: ${athletePassword}`);
    }

    const passwordHashTrainer = await bcrypt.hash(trainerPassword, 10);
    const passwordHashAthlete = await bcrypt.hash(athletePassword, 10);

    // Hash para admin
    const adminPassword = 'admin123';
    const passwordHashAdmin = await bcrypt.hash(adminPassword, 10);

    // Inserta usuarios
    await knex('users').insert([
        { id: 1, name: 'Carlos Entrenador', email: 'carlos@box.com', password_hash: passwordHashTrainer, role: 'entrenador' },
        { id: 2, name: 'Ana Atleta', email: 'ana@box.com', password_hash: passwordHashAthlete, role: 'atleta' },
        { id: 3, name: 'Luis Atleta', email: 'luis@box.com', password_hash: passwordHashAthlete, role: 'atleta' },
        { id: 4, name: 'Administrador', email: 'admin@crossfit.com', password_hash: passwordHashAdmin, role: 'entrenador' }
    ]);

    // Inserta WODs
    await knex('wods').insert([
        { id: 1, name: 'DT Pesado', description: '5 rondas por tiempo', exercises: '12 pesos muertos, 9 cargadas colgando, 6 empujes de hombros', created_by: 1 },
        { id: 2, name: 'Cardio Extremo', description: 'Por tiempo', exercises: '100 saltos de cuerda, 20 burpees, 15 thrusters, 400m carrera', created_by: 1 }
    ]);

    // Asignaciones de WODs
    await knex('wod_assignments').insert([
        { wod_id: 1, user_id: 2 }, // Ana recibe DT Pesado
        { wod_id: 2, user_id: 2 }, // Ana recibe Cardio Extremo
        { wod_id: 2, user_id: 3 }  // Luis recibe Cardio Extremo
    ]);

    // Records/progreso
    await knex('records').insert([
        { user_id: 2, wod_id: 1, result: '7:23 minutos', notes: 'Buen ritmo' },
        { user_id: 2, wod_id: 2, result: '12:34 minutos', notes: 'Fatiga en burpees' },
        { user_id: 3, wod_id: 2, result: '15:00 minutos', notes: 'Mejorar técnica en thrusters' }
    ]);
};
