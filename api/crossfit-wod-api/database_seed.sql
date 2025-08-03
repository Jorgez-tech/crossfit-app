-- Datos de prueba para Alto Rendimiento 360 (SQLite)

-- Usuarios: 1 entrenador, 2 atletas
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Carlos Entrenador', 'carlos@box.com', 'hash1', 'entrenador'),
  ('Ana Atleta', 'ana@box.com', 'hash2', 'atleta'),
  ('Luis Atleta', 'luis@box.com', 'hash3', 'atleta');

-- WODs
INSERT INTO wods (name, description, exercises, created_by) VALUES
  ('DT Pesado', '5 rondas por tiempo', '12 pesos muertos, 9 cargadas colgando, 6 empujes de hombros', 1),
  ('Cardio Extremo', 'Por tiempo', '100 saltos de cuerda, 20 burpees, 15 thrusters, 400m carrera', 1);

-- Asignaciones de WODs
INSERT INTO wod_assignments (wod_id, user_id) VALUES
  (1, 2), -- Ana recibe DT Pesado
  (2, 2), -- Ana recibe Cardio Extremo
  (2, 3); -- Luis recibe Cardio Extremo

-- Records/progreso
INSERT INTO records (user_id, wod_id, result, notes) VALUES
  (2, 1, '7:23 minutos', 'Buen ritmo'),
  (2, 2, '12:34 minutos', 'Fatiga en burpees'),
  (3, 2, '15:00 minutos', 'Mejorar técnica en thrusters');
