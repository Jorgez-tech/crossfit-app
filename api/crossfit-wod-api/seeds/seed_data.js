/**
 * Seed de datos de prueba para Alto Rendimiento 360
 * Ejecuta: npx knex seed:run
 *
 * NOTA: para desarrollo este seed crea 3 usuarios con contraseñas conocidas:
 * - entrenador: 'entrenador123'
 * - atletas: 'atleta123'
 *
 * El seed usa bcrypt para hashear las contraseñas antes de insertarlas.
 */

const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
    // Borra datos existentes (orden importa por claves foráneas)
    await knex('records').del();
    await knex('wod_assignments').del();
    await knex('wods').del();
    await knex('users').del();

    // Passwords en claro (solo para desarrollo/test en local)
    const trainerPassword = 'entrenador123';
    const athletePassword = 'atleta123';

    const passwordHashTrainer = await bcrypt.hash(trainerPassword, 10);
    const passwordHashAthlete = await bcrypt.hash(athletePassword, 10);

    // Inserta usuarios
    await knex('users').insert([
        { id: 1, name: 'Carlos Entrenador', email: 'carlos@box.com', password_hash: passwordHashTrainer, role: 'entrenador' },
        { id: 2, name: 'Ana Atleta', email: 'ana@box.com', password_hash: passwordHashAthlete, role: 'atleta' },
        { id: 3, name: 'Luis Atleta', email: 'luis@box.com', password_hash: passwordHashAthlete, role: 'atleta' }
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
