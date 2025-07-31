# my-first-vue-app

Aplicación Vue para consultar y visualizar WODs (Workouts of the Day) de Crossfit usando la API [crossfit-wod-api](https://crossfit-wod-api.herokuapp.com/).

## Funcionalidades implementadas

- Visualización de WODs diarios y aleatorios.
- Integración con la API crossfit-wod-api para obtener datos en tiempo real.
- Interfaz sencilla en App.vue para mostrar los resultados.
- Manejo de estados de carga y error al consultar la API.

## Integración con la API crossfit-wod-api

La app realiza peticiones HTTP a la API para obtener información de los WODs. Ejemplo de endpoint utilizado:
```
GET https://crossfit-wod-api.herokuapp.com/wods/random
```
La respuesta se muestra directamente en la interfaz principal.

## Ejemplo de uso

Al iniciar la aplicación, se muestra un WOD aleatorio obtenido de la API. Puedes actualizar el WOD o implementar filtros según tus necesidades.

```vue
<!-- Ejemplo de cómo se consume la API en App.vue -->
<template>
  <div>
    <button @click="getRandomWod">Obtener WOD aleatorio</button>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h2>{{ wod.name }}</h2>
      <p>{{ wod.description }}</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      wod: {},
      loading: false,
      error: null
    }
  },
  methods: {
    async getRandomWod() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch('https://crossfit-wod-api.herokuapp.com/wods/random');
        this.wod = await res.json();
      } catch (e) {
        this.error = 'Error al obtener el WOD';
      }
      this.loading = false;
    }
  },
  mounted() {
    this.getRandomWod();
  }
}
</script>
```

## Detalles técnicos

- Proyecto creado con Vue CLI.
- Uso de fetch para consumir la API.
- Estructura principal en App.vue.
- Puedes agregar componentes para mejorar la experiencia de usuario.

## Sugerencias para futuras mejoras

- Agregar filtros por tipo de WOD.
- Implementar autenticación si la API lo permite.
- Mejorar el diseño con Vuetify o BootstrapVue.
- Guardar WODs favoritos en localStorage.

## Personalización y configuración

Puedes modificar App.vue para cambiar la forma en que se muestran los WODs o agregar nuevas funcionalidades. Consulta la documentación de Vue para más detalles.

## Requisitos previos

- Node.js >= 14.x
- npm >= 6.x
- Vue CLI >= 4.x

## Estructura de carpetas

```
my-first-vue-app/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── App.vue
│   ├── main.js
│   └── components/
├── package.json
└── README.md
```

- `src/App.vue`: Componente principal.
- `src/components/`: Componentes reutilizables.
- `public/index.html`: Archivo HTML base.

## Guía de despliegue

Puedes desplegar la aplicación en servicios como Netlify, Vercel o GitHub Pages.

### Netlify

1. Haz un build de producción:
   ```
   npm run build
   ```
2. Sube la carpeta `dist/` a Netlify.

### Vercel

1. Instala Vercel CLI:
   ```
   npm i -g vercel
   ```
2. Ejecuta:
   ```
   vercel
   ```

## Testing

Si agregas pruebas, puedes ejecutarlas con:
```
npm run test:unit
```
*(Agrega pruebas en `tests/unit` si lo deseas)*

## Contribución

Las contribuciones son bienvenidas. Para colaborar:

1. Haz un fork del repositorio.
2. Crea una rama con tu mejora:
   ```
   git checkout -b feature/nueva-funcionalidad
   ```
3. Haz commit y push de tus cambios.
4. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT.

### Referencias

- [Vue CLI Configuration Reference](https://cli.vuejs.org/config/)
- [crossfit-wod-api](https://crossfit-wod-api.herokuapp.com/)
