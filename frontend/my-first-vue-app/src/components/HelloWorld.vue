<template>
  <div class="home">
    <h2 class="main-title">
      🔥 Prepárate para superar tu próximo WOD
    </h2>
    <img 
      src="@/assets/alto-rendimiento.png" 
      alt="Imagen motivacional de alto rendimiento: atletas entrenando CrossFit con determinación y profesionalismo" 
      class="hero-image" 
    />
    <section class="contact-section">
      <h3>Contacto y Redes Sociales</h3>
      <ul role="list" class="social-links">
        <li><a href="mailto:tu-correo@ejemplo.com" target="_blank" rel="noopener" aria-label="Enviar correo electrónico">📧 Correo</a></li>
        <li><a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Seguir en Facebook">🌐 Facebook</a></li>
        <li><a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Seguir en Instagram">📸 Instagram</a></li>
        <li><a href="https://www.twitter.com/" target="_blank" rel="noopener" aria-label="Seguir en Twitter">🐦 Twitter</a></li>
        <li><a href="https://wa.me/" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">💬 WhatsApp</a></li>
      </ul>
    </section>
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
.home {
  padding: var(--spacing-xl, 32px) var(--spacing-lg, 24px);
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.main-title {
  color: #e74c3c;
  font-size: var(--font-size-2xl, 24px);
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: var(--spacing-lg, 24px);
  line-height: 1.4;
}

.hero-image {
  max-width: 100%;
  height: auto;
  margin-bottom: var(--spacing-xl, 32px);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.contact-section {
  margin-top: var(--spacing-xl, 32px);
}

.contact-section h3 {
  font-size: var(--font-size-xl, 20px);
  color: var(--color-text, #2c3e50);
  margin-bottom: var(--spacing-lg, 24px);
  font-weight: 600;
}

.social-links {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md, 16px);
  justify-content: center;
}

.social-links li {
  flex: 0 0 auto;
}

.social-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--touch-target-min, 44px);
  min-width: var(--touch-target-min, 44px);
  padding: var(--spacing-sm, 12px) var(--spacing-lg, 24px);
  color: var(--color-success, #27ae60);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-base, 16px);
  border: 2px solid var(--color-success, #27ae60);
  border-radius: 8px;
  transition: var(--transition-base, all 0.3s ease);
  background: rgba(39, 174, 96, 0.1);
}

.social-links a:hover {
  background: var(--color-success, #27ae60);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
  text-decoration: none;
}

.social-links a:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.3);
  border-color: var(--color-success, #27ae60);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .home {
    background: #ffffff;
    border: 2px solid #000000;
  }
  
  .main-title {
    color: #000000;
    text-shadow: none;
  }
  
  .social-links a {
    background: #ffffff;
    color: #000000;
    border-color: #000000;
  }
  
  .social-links a:hover {
    background: #000000;
    color: #ffffff;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .home {
    padding: var(--spacing-lg, 24px) var(--spacing-md, 16px);
    margin: var(--spacing-md, 16px);
  }
  
  .main-title {
    font-size: var(--font-size-xl, 20px);
  }
  
  .social-links {
    flex-direction: column;
    align-items: center;
  }
  
  .social-links a {
    width: 100%;
    max-width: 300px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .social-links a {
    transition: none;
  }
  
  .social-links a:hover {
    transform: none;
  }
}
</style>
