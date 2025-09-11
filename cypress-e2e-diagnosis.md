# Diagnóstico y Plan para Tests E2E con Cypress

## Problema recurrente
- Los tests E2E con Cypress fallan de forma intermitente, especialmente en modo interactivo.
- Los errores suelen estar relacionados con la falta de conexión al backend, base de datos no inicializada, o datos de prueba inconsistentes.

## Auditoría y hallazgos
- El frontend se levanta automáticamente antes de Cypress, pero el backend y la base de datos requieren preparación manual.
- Hay scripts (`run_seed_and_check.js`, `check_db.js`, `smoke_test.js`) para inicializar y verificar la base de datos y el backend.
- Cypress depende de que el backend esté corriendo en `localhost:3000` y la base de datos esté lista.
- Los datos de prueba deben coincidir con los usuarios definidos en Cypress (`carlos@box.com`, `ana@box.com`).

## Plan de acción propuesto

1. **Inicialización del entorno antes de los tests:**
   - Levantar el backend manualmente o con script.
   - Ejecutar migraciones y seeds para asegurar datos de prueba consistentes.
   - Verificar la conexión y estado de la base de datos (usando `check_db.js`).
   - Confirmar que el backend responde a peticiones (por ejemplo, `/api/v1/workouts`).

2. **Automatización recomendada:**
   - Crear un script global que levante backend, aplique migraciones/seeds y luego ejecute Cypress.
   - Documentar el flujo ideal para que cualquier desarrollador pueda preparar el entorno y correr los tests sin errores.

3. **Checklist previo a E2E:**
   - Backend corriendo en `localhost:3000`.
   - Base de datos SQLite (`ar360.db`) migrada y con datos de prueba.
   - Variables de entorno configuradas (`JWT_SECRET`, contraseñas de desarrollo, etc.).
   - Frontend corriendo en `localhost:8080`.
   - Cypress configurado y con usuarios de prueba válidos.

4. **Próximos pasos:**
   - Implementar el script de inicialización global.
   - Ajustar los tests y datos de prueba para asegurar consistencia.
   - Validar el flujo completo y documentar resultados.

---
## Propuesta de script de inicialización global (Windows .bat)

Este script automatiza la preparación del entorno para ejecutar los tests E2E con Cypress:

```bat
REM 1. Levantar el backend en modo desarrollo
start cmd /k "cd api\crossfit-wod-api && npm run dev"

REM 2. Ejecutar migraciones y seeds
cd api\crossfit-wod-api
node scripts\run_seed_and_check.js
cd ../..

REM 3. Verificar la conexión y estado de la base de datos
cd api\crossfit-wod-api
node scripts\check_db.js
cd ../..

REM 4. Levantar el frontend
start cmd /k "cd frontend\my-first-vue-app && npm run serve"

REM 5. Ejecutar Cypress E2E (en otra terminal)
cd frontend\my-first-vue-app
npm run test:e2e:open
```

**Notas:**
- Asegúrate de tener configuradas las variables de entorno necesarias (`.env` en backend).
- Puedes adaptar el script para Unix (`.sh`) si lo necesitas.
- Ejecuta el script desde la raíz del proyecto.
- Espera unos segundos entre cada paso para asegurar que los servicios estén levantados.

---

## Sincronización de datos de prueba y contraseñas para E2E

Para asegurar que los tests E2E funcionen correctamente, es fundamental que las contraseñas de los usuarios de prueba coincidan entre Cypress y la base de datos.

**Recomendación:**
- Crear un archivo `.env.e2e` en `api/crossfit-wod-api` con las siguientes variables:

```
JWT_SECRET=your_jwt_secret_here
DEV_TRAINER_PASSWORD=123456
DEV_ATHLETE_PASSWORD=123456
NODE_ENV=development
```

- Antes de ejecutar el seed, copia `.env.e2e` a `.env` para que el seed utilice las contraseñas esperadas por Cypress.
- Ejecuta el seed (`node scripts/run_seed_and_check.js`) para inicializar los datos.
- Así, los usuarios `carlos@box.com` y `ana@box.com` tendrán la contraseña `123456`, igual que en la configuración de Cypress.

**Notas:**
- Si no defines las variables, el seed genera contraseñas aleatorias y las imprime en consola. Esto puede causar fallos en los tests E2E.
- Mantén este flujo documentado y sincronizado para evitar errores intermitentes.

---

## Auditoría de atributos `data-cy` y comandos personalizados en Cypress

- Los tests E2E utilizan de forma consistente atributos `data-cy` para seleccionar elementos clave de la UI: formularios, botones, dashboards, listas, modales, mensajes, etc.
- Los comandos personalizados (`cy.loginAsTrainer`, `cy.checkTrainerUI`, etc.) y los mocks están bien integrados y facilitan la robustez de los flujos de prueba.
- Los tests básicos también usan selectores estándar como fallback (`#email`, `#password`, `button[type="submit"]`).
- La cobertura de `data-cy` es alta y los selectores son robustos.

**Recomendación:**
- Mantener la convención de atributos `data-cy` en todos los componentes y elementos clave.
- Si algún test falla, revisar primero cambios recientes en la UI, datos de prueba o estado del backend antes de modificar los selectores.
- Documentar cualquier cambio en los atributos para evitar roturas en los tests.

---

## Auditoría de mocks, interceptores y comandos personalizados en Cypress

- Los comandos personalizados (`loginAsTrainer`, `loginAsAthlete`, `logout`, `createWod`, `createRecord`, etc.) están bien definidos y alineados con los flujos de la UI.
- El comando `mockBackend` intercepta y simula todas las rutas críticas del backend: login, registro, verificación de usuario, WODs, miembros y records.
- Los mocks devuelven datos consistentes y permiten probar la UI sin depender del backend real.
- Los comandos para verificar la UI por rol (`checkTrainerUI`, `checkAthleteUI`) aseguran que los elementos clave estén presentes o ausentes según el usuario.

**Recomendación:**
- Mantener y actualizar los mocks/interceptores cuando cambien los endpoints o la estructura de datos.
- Usar los comandos personalizados para asegurar flujos robustos y repetibles en los tests.
- Si los tests fallan, revisar primero el estado del backend real, los datos de prueba y los cambios en la UI antes de modificar los mocks.

---

## Checklist y recomendaciones para la ejecución exitosa de tests E2E

**Checklist previo a ejecutar Cypress:**
1. Backend corriendo en `localhost:3000` (sin errores en consola).
2. Base de datos SQLite (`ar360.db`) migrada y con datos de prueba (usuarios, WODs, records, etc.).
3. Variables de entorno configuradas (`.env` o `.env.e2e` con contraseñas y JWT_SECRET).
4. Frontend corriendo en `localhost:8080` (o el puerto configurado en Cypress).
5. Mocks y comandos personalizados actualizados y alineados con la UI y endpoints.
6. Cypress configurado con usuarios de prueba válidos y atributos `data-cy` presentes en la UI.

**Recomendaciones finales:**
- Realiza una prueba manual del flujo completo: levanta backend y frontend, aplica seeds, verifica endpoints clave (login, WODs, records), y ejecuta Cypress en modo interactivo y headless.
- Si algún test falla, revisa primero el estado de los servicios, los datos de prueba y los cambios recientes en la UI o backend.
- Mantén este checklist actualizado y documenta cualquier ajuste necesario en el archivo de diagnóstico.

---

# Diagnóstico Cypress E2E - 03/09/2025

## Estado actual de los tests

**Fallos principales:**
- No se encuentra el texto "Alto Rendimiento 360" visible en la página principal.
- El test de login no intercepta la petición esperada y devuelve 401.
- No se encuentra el texto "Todo List" en la página pública.
- La navegación autenticada no muestra "Dashboard" tras recargar.

**Éxitos:**
- Navegación a login y formulario básico funciona.
- Redirección a login si no está autenticado funciona.
- Acceso con autenticación simulada funciona.

## Recomendaciones inmediatas
- Revisar selectores y textos esperados en los tests.
- Verificar que los usuarios de prueba existen y el flujo de login funciona.
- Actualizar los tests si la UI ha cambiado.
- Revisar el manejo de autenticación y navegación tras reload.

---

**Nota para la siguiente sesión:**
- Retomar desde la revisión de los selectores y textos en los tests.
- Validar el flujo de login y la existencia de usuarios en la base de datos.
- Corregir los tests para reflejar la UI actual si es necesario.
- Preparar para merge a main tras validación final.

---

## Error de autenticación - 10/09/2025

**Problema detectado:** Usuario admin@crossfit.com no puede iniciar sesión
- Se agregó el usuario admin al seed (seed_data.js) con contraseña admin123
- Se ejecutó el seed pero el login sigue fallando con "Error de conexión"
- El backend está corriendo sin errores aparentes
- El frontend muestra error de conexión en lugar de credenciales incorrectas

**Acciones realizadas:**
- Modificado seeds/seed_data.js para incluir admin@crossfit.com
- Ejecutado npx knex seed:run
- Backend y frontend están activos

**Estado:** Requiere investigación adicional del flujo de autenticación y conectividad frontend-backend.

---

**Cambios realizados en esta sesión:**
- Se corrigió la carga de variables de entorno en el backend (`require('dotenv').config()` en `index.js`).
- Se reiniciaron todos los servicios y se ejecutaron los tests E2E desde cero.
- Se verificó la accesibilidad del frontend y backend.
- Se registró el diagnóstico de los resultados de Cypress.
