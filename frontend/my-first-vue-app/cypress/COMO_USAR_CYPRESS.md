# 🚀 Guía Rápida: Cypress Interactivo - Primera Vez

## ✅ Configuración Completada

¡El error de configuración se ha solucionado! Ahora Cypress debería abrirse correctamente.

## 📋 Pasos para Ejecutar las Pruebas E2E

### 1. ¿Qué deberías ver en Cypress?

Al abrir Cypress, deberías ver una ventana con:
- **"E2E Testing"** y **"Component Testing"** → Selecciona **"E2E Testing"**
- Lista de navegadores disponibles → Selecciona **Chrome**, **Firefox** o **Edge**
- Una vez configurado, verás la lista de archivos de prueba

### 2. Archivos de Prueba Disponibles

```
📁 cypress/e2e/
├── 01-authentication.cy.js      ← Pruebas de login/logout
├── 02-access-control.cy.js      ← Pruebas de permisos por rol
├── 03-crud-operations.cy.js     ← Pruebas CRUD (crear/editar/eliminar)
└── 04-integration-flows.cy.js   ← Flujos completos end-to-end
```

### 3. Cómo Ejecutar una Prueba

1. **Haz clic en cualquier archivo** (ej: `01-authentication.cy.js`)
2. **Se abrirá un navegador** con la aplicación
3. **Las pruebas se ejecutarán automáticamente**
4. **Podrás ver cada paso** en tiempo real

### 4. ¿Qué Verás Durante las Pruebas?

- ✅ **Pasos en verde**: Pruebas exitosas
- ❌ **Pasos en rojo**: Errores (si los hay)
- 🔄 **Ejecución en tiempo real**: Verás cómo se llena formularios, se hace clic en botones, etc.
- 📸 **Screenshots automáticos** si hay errores
- ⏰ **Tiempo de ejecución** de cada prueba

### 5. Navegación en Cypress

- **Panel izquierdo**: Lista de pruebas y comandos ejecutados
- **Panel derecho**: La aplicación ejecutándose
- **Botones de control**: Play, pausa, velocidad de ejecución

### 6. Estado Actual del Servidor

✅ **Frontend**: Ejecutándose en `http://localhost:8081`
🔄 **Backend**: No necesario (pruebas usan mocks)

### 7. Pruebas Recomendadas para Empezar

**Orden sugerido para primera ejecución:**

1. **`01-authentication.cy.js`** ← ¡Empieza aquí!
   - Más simple y fundamental
   - Prueba login de entrenador y atleta
   
2. **`02-access-control.cy.js`**
   - Prueba que los permisos funcionen
   
3. **`03-crud-operations.cy.js`**
   - Prueba crear/editar WODs y records
   
4. **`04-integration-flows.cy.js`**
   - Flujos completos más complejos

### 8. Comandos de Terminal Alternativos

Si prefieres terminal en lugar de la interfaz:

```bash
# Ejecutar todas las pruebas
npm run cy:run

# Ejecutar prueba específica
npm run cy:run:auth        # Solo autenticación
npm run cy:run:access      # Solo permisos
npm run cy:run:crud        # Solo CRUD
npm run cy:run:integration # Solo flujos
```

### 9. ¿Qué Hacer si Hay Errores?

- **Error de timeout**: La aplicación puede estar cargando lentamente
- **Error de elemento no encontrado**: Algunos componentes pueden no estar implementados
- **Error de red**: Normal, las pruebas usan mocks del backend

### 10. Características Especiales de las Pruebas

- **Datos de prueba**: 
  - Entrenador: `carlos@box.com` / `123456`
  - Atleta: `ana@correo.com` / `123456`
- **Mocks automáticos**: No necesitas backend real
- **Comandos personalizados**: `cy.loginAsTrainer()`, `cy.loginAsAthlete()`
- **Verificaciones por rol**: Diferentes permisos por usuario

---

## 🎯 ¡Tu Primer Test!

**Recomendación**: Haz clic en `01-authentication.cy.js` y observa cómo:
1. Se abre la página de login
2. Se llenan automáticamente los campos
3. Se hace clic en "Iniciar Sesión"
4. Se verifica la redirección al dashboard

¡Es fascinante ver las pruebas ejecutándose en tiempo real! 🚀

---

## 📞 Si Necesitas Ayuda

- **Error de configuración**: Verifica que el servidor esté en puerto 8081
- **Pruebas fallan**: Es normal, algunos componentes pueden necesitar ajustes
- **Cypress no abre**: Intenta cerrar y volver a ejecutar `npx cypress open`

**¡Las pruebas E2E están listas para usar! Disfruta viendo la magia de la automatización en acción.** ✨
