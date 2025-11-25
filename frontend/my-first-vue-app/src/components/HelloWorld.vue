<template>
  <div class="home">
    <p class="home-legend">
      Alto Rendimiento 360 · Donde cada WOD impulsa tu siguiente marca personal.
    </p>
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
  min-height: calc(10vh - 260px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* contact-section removed */

.home-legend {
  max-width: 680px;
  margin: 0;
  font-size: var(--font-size-2xl, 26px);
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
  color: rgba(199, 198, 198, 0.92);
  text-shadow: 0 6px 18px rgba(15, 23, 42, 0.45);
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
    min-height: calc(100vh - 220px);
  }

  /* contact-section removed */

  .home-legend {
    font-size: var(--font-size-xl, 22px);
    padding: 0 var(--spacing-md, 16px);
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
