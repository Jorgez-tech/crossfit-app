# Quick Start - UI Improvements

## Inicio Rápido (5 minutos)

### 1. Ver los cambios
```bash
git checkout feature/ui-improvements
git log --oneline -1
git diff main --stat
```

### 2. Iniciar la aplicación
```bash
# Terminal 1 - Backend
cd api/crossfit-wod-api
npm start

# Terminal 2 - Frontend
cd frontend/my-first-vue-app
npm run serve
```

### 3. Abrir en navegador
```
http://localhost:8080
```

---

## Qué Probar (2 minutos)

### Home
1. Observa la imagen hero - debe ajustarse perfectamente
2. Haz hover sobre la imagen - debe hacer zoom suave
3. Redimensiona la ventana - la imagen se ajusta

### Navegación
1. Haz hover sobre los botones - deben elevarse
2. Observa las sombras - deben aumentar suavemente
3. Click en "CrossFit WODs"

### WODs
1. Observa las cards - deben estar en grid
2. Haz hover sobre una card - debe elevarse 8px
3. Click en "Ver Detalles" - debe abrir modal
4. Verifica que se muestre:
   - Nombre del WOD
   - Badge de tipo (For Time, Rondas, etc.)
   - Fecha en español
   - Descripción
   - Ejercicios

---

## Prueba Responsive (1 minuto)

1. Abre DevTools (F12)
2. Toggle Device Toolbar (Ctrl + Shift + M)
3. Prueba:
   - iPhone SE (375px) - 1 card por fila
   - iPad (768px) - 2 cards por fila
   - Desktop (1920px) - 3-4 cards por fila

---

## Todo Funciona?

Si ves:
- Imagen hero responsive
- Botones con efectos hover
- WODs en cards profesionales
- Grid responsive
- Modal funcional

**¡Perfecto! Las mejoras están funcionando correctamente.**

---

## Siguiente Paso

### Opción A: Merge a main
```bash
git checkout main
git merge feature/ui-improvements
git push origin main
```

### Opción B: Crear Pull Request
```bash
git push origin feature/ui-improvements
# Luego ve a GitHub y crea el PR
```

---

## Más Información

- **Detalles completos:** `UI_IMPROVEMENTS.md`
- **Guía de pruebas:** `TESTING_GUIDE.md`
- **Instrucciones de merge:** `MERGE_INSTRUCTIONS.md`

---

## Problemas?

### WODs no se muestran
```bash
# Verifica que el backend esté corriendo
cd api/crossfit-wod-api
npm start
```

### Estilos no se aplican
```bash
# Hard refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Error en consola
```bash
# Revisa DevTools → Console
# Busca errores en rojo
```

---

**Tiempo total:** ~8 minutos  
**Dificultad:** Fácil  
**Estado:** Listo para usar
