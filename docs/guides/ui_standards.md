# Estándares de UI y Sistema de Diseño

Este documento describe los estándares de interfaz de usuario implementados en la rama `feature/ui-improvements` y que ahora forman parte del diseño base de la aplicación.

## Principios de Diseño

- **Profesionalismo:** Diseño limpio, sin elementos decorativos innecesarios (emojis eliminados).
- **Responsividad:** Adaptabilidad total desde móviles hasta escritorio.
- **Accesibilidad:** Soporte para navegación por teclado, alto contraste y reducción de movimiento.
- **Feedback Visual:** Estados interactivos claros (hover, focus, active) para todos los elementos accionables.

## Componentes Clave

### 1. Sistema de Cards (WODs)
Utilizado para mostrar listas de elementos como entrenamientos.
- **Estructura:** Header (título, metadatos), Body (descripción, contenido), Footer (acciones).
- **Interacción:** Elevación suave en hover (`transform: translateY(-8px)`).
- **Grid:** Layout responsivo usando CSS Grid (`repeat(auto-fill, minmax(320px, 1fr))`).

### 2. Botones y Navegación
- **Estilo:** Gradientes sutiles y sombras dinámicas.
- **Hover:** Efecto de elevación y aumento de sombra.
- **Accesibilidad:** `min-height: 44px` para targets táctiles.

### 3. Imágenes Hero
- **Responsive:** Uso de `aspect-ratio: 16/9` y `object-fit: cover`.
- **Efectos:** Zoom suave en hover para dar dinamismo.

## Paleta de Colores (Referencia)

- **Primario (Accent):** `#e74c3c` (Rojo) - Usado en headers, botones principales.
- **Secundario:** `#2c3e50` (Azul oscuro) - Texto principal, fondos oscuros.
- **Éxito:** `#27ae60` (Verde) - Botones de acción positiva, indicadores.
- **Fondo:** `#f4f6f8` (Gris claro) - Fondo general de la aplicación.

## Código de Referencia

### Sombras y Transiciones
```css
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
```

### Grid Responsivo
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
}
```
