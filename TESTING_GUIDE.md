# Guía de Pruebas - UI Improvements

## 🎯 Objetivo
Verificar que las mejoras de UI funcionan correctamente en diferentes escenarios y dispositivos.

---

## 🚀 Cómo Iniciar la Aplicación

### 1. Backend (API)
```bash
cd api/crossfit-wod-api
npm install
npm start
```
La API debería estar corriendo en `http://localhost:3000`

### 2. Frontend (Vue.js)
```bash
cd frontend/my-first-vue-app
npm install
npm run serve
```
La aplicación debería estar corriendo en `http://localhost:8080`

---

## ✅ Checklist de Pruebas

### 📱 Home Page (HelloWorld.vue)

#### Imagen Hero
- [ ] La imagen se muestra con aspecto 16:9 en desktop
- [ ] La imagen se ajusta correctamente en tablet (768px)
- [ ] La imagen se ajusta correctamente en mobile (375px)
- [ ] Al hacer hover, la imagen hace zoom suave (scale 1.02)
- [ ] La sombra de la imagen aumenta en hover
- [ ] No hay distorsión de la imagen en ningún tamaño

#### Botones de Redes Sociales
- [ ] Los botones tienen buen espaciado
- [ ] El hover cambia el color de fondo
- [ ] El hover eleva el botón ligeramente
- [ ] Los botones son táctiles (min 44px)

---

### 🧭 Navegación (App.vue)

#### Efectos Hover en Botones
- [ ] Al hacer hover, el botón se eleva 3px
- [ ] La sombra del botón aumenta suavemente
- [ ] El gradiente de fondo aparece suavemente
- [ ] La transición es fluida (cubic-bezier)
- [ ] El efecto focus muestra borde blanco
- [ ] En mobile, los botones se apilan verticalmente

#### Responsive
- [ ] Desktop: Botones en línea horizontal
- [ ] Tablet: Botones se ajustan con wrap
- [ ] Mobile: Botones en columna vertical

---

### 🏋️ CrossFit WODs (CrossfitWods.vue)

#### Grid de Cards
- [ ] Desktop (>1200px): 3-4 cards por fila
- [ ] Tablet (768px-1200px): 2 cards por fila
- [ ] Mobile (<768px): 1 card por fila
- [ ] El espaciado entre cards es consistente
- [ ] Las cards tienen la misma altura en cada fila

#### Card Individual

**Header:**
- [ ] Fondo con gradiente rojo visible
- [ ] Nombre del WOD en blanco, grande y bold
- [ ] Badge de tipo (AMRAP, For Time, etc.) visible si aplica
- [ ] Fecha formateada en español (ej: "17 sep 2025")

**Body:**
- [ ] Descripción del WOD visible y legible
- [ ] Sección de ejercicios con fondo verde claro
- [ ] Borde izquierdo verde en ejercicios
- [ ] Texto bien espaciado y legible

**Footer:**
- [ ] Botón "Ver Detalles" con gradiente verde
- [ ] Icono de ojo visible
- [ ] Botón ocupa todo el ancho

#### Efectos Hover en Cards
- [ ] Card se eleva 8px al hacer hover
- [ ] Sombra aumenta dramáticamente
- [ ] Borde cambia a color rojo
- [ ] Transición es suave
- [ ] Botón "Ver Detalles" se eleva 2px en hover
- [ ] Sombra del botón aumenta en hover

#### Modal de Detalles
- [ ] Modal se abre al hacer clic en "Ver Detalles"
- [ ] Overlay oscuro visible
- [ ] Contenido del WOD se muestra correctamente
- [ ] Botón X cierra el modal
- [ ] Click fuera del modal lo cierra
- [ ] ESC cierra el modal
- [ ] Botón "Iniciar Entrenamiento" funciona

#### Funcionalidades JavaScript
- [ ] `formatDate()` muestra fechas en español
- [ ] `getWodType()` detecta tipos correctamente:
  - "por tiempo" → "For Time"
  - "amrap" → "AMRAP"
  - "rondas" → "Rondas"
- [ ] `formatExercises()` muestra ejercicios correctamente

---

## 🎨 Pruebas de Accesibilidad

### Reduced Motion
1. Activar "Reduce motion" en el sistema operativo
2. Verificar:
   - [ ] Las animaciones se desactivan
   - [ ] Los hovers no tienen transform
   - [ ] La funcionalidad sigue intacta

### High Contrast
1. Activar modo alto contraste
2. Verificar:
   - [ ] Los bordes son más visibles
   - [ ] Los colores tienen suficiente contraste
   - [ ] El texto es legible

### Keyboard Navigation
- [ ] Tab navega entre todos los botones
- [ ] Enter activa los botones
- [ ] Focus visible en todos los elementos
- [ ] ESC cierra el modal

### Screen Reader
- [ ] ARIA labels presentes en botones
- [ ] Roles semánticos correctos
- [ ] Mensajes de estado anunciados

---

## 📐 Pruebas de Responsive

### Breakpoints a Probar

**Desktop Large (1920px)**
- [ ] 4 cards por fila
- [ ] Navegación horizontal
- [ ] Imagen hero grande

**Desktop (1440px)**
- [ ] 3-4 cards por fila
- [ ] Todo bien espaciado

**Laptop (1024px)**
- [ ] 2-3 cards por fila
- [ ] Navegación ajustada

**Tablet (768px)**
- [ ] 2 cards por fila
- [ ] Navegación con wrap
- [ ] Imagen hero ajustada

**Mobile Large (425px)**
- [ ] 1 card por fila
- [ ] Navegación vertical
- [ ] Botones full width

**Mobile (375px)**
- [ ] Todo apilado verticalmente
- [ ] Texto legible
- [ ] Botones táctiles

**Mobile Small (320px)**
- [ ] Contenido no se desborda
- [ ] Scroll funciona correctamente

---

## 🌐 Navegadores a Probar

- [ ] Chrome (última versión)
- [ ] Firefox (última versión)
- [ ] Safari (si disponible)
- [ ] Edge (última versión)
- [ ] Chrome Mobile
- [ ] Safari Mobile

---

## 🐛 Problemas Conocidos a Verificar

### Posibles Issues

1. **API no conecta:**
   - Verificar que el backend esté corriendo
   - Verificar CORS en el backend
   - Verificar URL en `api.js`

2. **WODs no se muestran:**
   - Abrir DevTools → Console
   - Verificar errores de red
   - Verificar estructura de datos en response

3. **Estilos no se aplican:**
   - Verificar que los archivos se guardaron
   - Hacer hard refresh (Ctrl + Shift + R)
   - Verificar que no hay errores de sintaxis CSS

4. **Modal no se cierra:**
   - Verificar event listeners
   - Verificar que ESC funciona
   - Verificar click outside

---

## 📊 Métricas de Éxito

### Performance
- [ ] Tiempo de carga < 3 segundos
- [ ] Animaciones a 60fps
- [ ] No hay lag en hover effects

### UX
- [ ] Interfaz intuitiva
- [ ] Feedback visual claro
- [ ] Navegación fluida

### Responsive
- [ ] Funciona en todos los breakpoints
- [ ] No hay scroll horizontal
- [ ] Contenido legible en mobile

---

## 🔧 Herramientas de Desarrollo

### Chrome DevTools
```
F12 → Toggle Device Toolbar (Ctrl + Shift + M)
```
Probar diferentes dispositivos:
- iPhone SE
- iPhone 12 Pro
- iPad Air
- Galaxy S20

### Lighthouse Audit
```
F12 → Lighthouse → Generate Report
```
Verificar:
- Performance > 90
- Accessibility > 90
- Best Practices > 90

---

## 📸 Screenshots Recomendados

Tomar screenshots de:
1. Home con imagen hero (desktop y mobile)
2. Navegación con hover effect
3. Grid de WODs (desktop: 3 cards, mobile: 1 card)
4. Card individual con hover
5. Modal de detalles abierto

---

## ✅ Criterios de Aceptación

Para considerar las mejoras exitosas:

1. ✅ Imagen hero responsive sin distorsión
2. ✅ Botones de navegación con efectos suaves
3. ✅ WODs en cards profesionales
4. ✅ Grid responsive en todos los tamaños
5. ✅ Información estructurada y legible
6. ✅ Efectos hover funcionando
7. ✅ Accesibilidad completa
8. ✅ Sin errores en consola
9. ✅ Performance aceptable
10. ✅ Funciona en todos los navegadores

---

## 🚨 Reporte de Bugs

Si encuentras algún problema, documenta:

```markdown
### Bug: [Título descriptivo]

**Descripción:**
[Qué está pasando]

**Pasos para reproducir:**
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Comportamiento esperado:**
[Qué debería pasar]

**Comportamiento actual:**
[Qué está pasando realmente]

**Entorno:**
- Navegador: [Chrome 120]
- Dispositivo: [Desktop/Mobile]
- Resolución: [1920x1080]

**Screenshots:**
[Adjuntar si es posible]
```

---

## 📝 Notas Adicionales

### Datos de Prueba
Los WODs de prueba están en:
```
api/crossfit-wod-api/seeds/seed_data.js
```

Para agregar más WODs de prueba, ejecutar:
```bash
cd api/crossfit-wod-api
npx knex seed:run
```

### Hot Reload
El frontend tiene hot reload activado. Los cambios en archivos `.vue` se reflejan automáticamente.

---

**Última actualización:** 2025-10-03  
**Rama:** feature/ui-improvements  
**Commit:** 114adf9
