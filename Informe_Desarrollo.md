# Informe y Guía de Desarrollo


## 1. Objetivo y Alcance


### 1.1 Propósito del Proyecto
El propósito de Crossfit-app es ofrecer una plataforma integral para la gestión y consulta de entrenamientos (WODs), miembros y records de un box de CrossFit. Busca digitalizar y centralizar la información clave para entrenadores y atletas, facilitando el acceso, la organización y el seguimiento del progreso.


### 1.2 Problemas que Resuelve
- Dificultad para registrar y consultar WODs históricos y actuales.
- Falta de seguimiento centralizado de records y progresos de los miembros.
- Necesidad de una interfaz sencilla para que entrenadores y atletas accedan a la información relevante.
- Ausencia de integración entre frontend y backend en soluciones tradicionales.


### 1.3 Usuarios Objetivo
- Entrenadores de CrossFit que gestionan rutinas, miembros y resultados.
- Atletas que desean consultar WODs, registrar sus marcas y ver su progreso.
- Administradores de box que buscan digitalizar la operación y mejorar la experiencia de sus usuarios.

## 2. Estructura y Arquitectura

- Monorepo: `crossfit-app/`
  - `api/`: Backend Express
  - `frontend/`: App Vue
- Scripts compartidos (ejemplo: `concurrently` para desarrollo conjunto)
- Configuración de CORS y proxy

## 3. Fases de Desarrollo

### Fase 1: Prototipado y validación
- Implementación base de API y frontend
- Pruebas de endpoints y navegación
- Demo funcional

### Fase 2: Unificación y mejora estructural
- Migración a monorepo
- Configuración de scripts y documentación
- Integración de CI/CD

### Fase 3: Autenticación y seguridad
- Registro/login con JWT
- Validación y roles

### Fase 4: Integración de base de datos
- Migración de db.json a SQL
- Implementación de ORM

### Fase 5: Despliegue y hosting
- Separado (Netlify/Vercel, Railway/Render)
- Conjunto (Docker, Nginx, VPS)

### Fase 6: Escalabilidad y persistencia
- Filtrado, paginación, búsqueda
- Documentación con Swagger
- Monitoreo/logging

## 4. Estado Actual y Próximos Pasos

- [x] Prototipo funcional
- [x] Navegación y consumo de API
- [x] Estructura de componentes
- [x] Migración a monorepo
- [ ] Documentación y scripts compartidos
- [ ] Autenticación
- [ ] Base de datos relacional
- [ ] Despliegue conjunto

## 5. Decisiones Técnicas y Justificación

- Uso de monorepo para facilitar desarrollo y CI/CD
- Proxy y CORS para desarrollo ágil
- Base de datos al final para validar primero la lógica

## 6. Checklist de Funcionalidades y Pruebas

- [x] Visualización de WODs
- [x] Visualización de Members y Records
- [x] Navegación entre vistas
- [ ] Registro/login
- [ ] Persistencia en base de datos
- [ ] Despliegue en producción

---

> Actualiza este informe en cada fase para mantener el seguimiento y facilitar la colaboración.
