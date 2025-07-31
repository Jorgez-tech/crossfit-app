<template>
  <div class="home">
    <h2 style="color: #ff5722; font-size: 2.2rem; font-weight: bold; text-shadow: 2px 2px 8px #000; margin-bottom: 10px;">
      🔥 Prepárate para superar tu próximo WOD
    </h2>
    <img src="@/assets/alto-rendimiento.png" alt="Alto Rendimiento" style="max-width: 100%; height: auto; margin-bottom: 20px;" />
    <h3>Contacto y Redes Sociales</h3>
    <ul>
      <li><a href="mailto:tu-correo@ejemplo.com" target="_blank" rel="noopener">📧 Correo</a></li>
      <li><a href="https://www.facebook.com/" target="_blank" rel="noopener">🌐 Facebook</a></li>
      <li><a href="https://www.instagram.com/" target="_blank" rel="noopener">📸 Instagram</a></li>
      <li><a href="https://www.twitter.com/" target="_blank" rel="noopener">🐦 Twitter</a></li>
      <li><a href="https://wa.me/" target="_blank" rel="noopener">💬 WhatsApp</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  props: {
    msg: {
      type: String,
      default: 'Bienvenido a tu aplicación Vue.js'
    }
  }
};
</script>

<style scoped>
/* Estilos para Home */
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
