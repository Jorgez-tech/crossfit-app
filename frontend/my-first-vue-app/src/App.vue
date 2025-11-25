<template>
  <div id="app">
    <nav v-if="authStore.isAuthenticated" role="navigation" aria-label="Main navigation">
      <span class="nav-brand" aria-label="Alto Rendimiento">Alto Rendimiento</span>
      <div class="nav-links" role="menubar" aria-label="Primary links">
        <router-link to="/" aria-label="Go to home page">🏠 Home</router-link>
        <router-link to="/wods" aria-label="View workouts">🏋️ WODs</router-link>
        <router-link to="/records" aria-label="View records">📊 Records</router-link>
        <router-link v-if="authStore.user?.role === 'entrenador'" to="/members" aria-label="Manage members">👥 Members</router-link>
        <router-link :to="authStore.user?.role === 'entrenador' ? '/trainer' : '/athlete'" aria-label="Go to dashboard">📱 Dashboard</router-link>
        <router-link to="/profile" aria-label="View profile">👤 Perfil</router-link>
        <div data-cy="user-menu">
          <button @click="handleLogout" class="logout-btn" data-cy="logout-button" aria-label="Log out from application">🚪 Salir</button>
        </div>
      </div>
    </nav>
    
    <nav v-else role="navigation" aria-label="Guest navigation">
      <span class="nav-brand" aria-label="Alto Rendimiento">Alto Rendimiento</span>
      <div class="nav-links" role="menubar" aria-label="Primary links">
        <router-link to="/" aria-label="Go to home page">🏠 Home</router-link>
        <router-link to="/crossfit" aria-label="View CrossFit workouts">🏋️ CrossFit WODs</router-link>
        <router-link to="/login" aria-label="Log in to your account">🔐 Login</router-link>
      </div>
    </nav>
    
    <main role="main" aria-label="Main content">
      <router-view />
    </main>
    
    <footer role="contentinfo">
      <p>&copy; 2025 Alto Rendimiento 360</p>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from './stores/main';
import { useRouter } from 'vue-router';
import logger from './utils/logger';

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const log = logger.scoped('App');

    const handleLogout = async () => {
      try {
        await authStore.logout();
        router.push('/login');
      } catch (error) {
        log.error('Error durante el cierre de sesión', error);
      }
    };

    return {
      authStore,
      handleLogout
    };
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Layout fixed header/footer heights */
  --header-height: 64px;
  --footer-height: 56px;
  /* Core palette */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-accent: #0ea5e9;
  --color-accent-dark: #0284c7;
  --color-success: #22c55e;
  --color-success-light: #4ade80;
  --color-white: #ffffff;
  --color-text: #0f172a;
  --color-text-light: #475569;
  --color-muted: #94a3b8;
  --color-border: rgba(148, 163, 184, 0.35);
  --color-background: #f8fafc;
  --color-surface: rgba(255, 255, 255, 0.78);
  --color-surface-strong: rgba(15, 23, 42, 0.8);
  --shadow-md: 0 18px 45px rgba(15, 23, 42, 0.12);
  --shadow-lg: 0 30px 80px rgba(15, 23, 42, 0.18);

  /* Typography */
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 26px;
  --font-size-3xl: 34px;

  /* Spacing */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Accessibility */
  --touch-target-min: 44px;
  --transition-base: all 0.3s ease;
  --transition-focus: all 0.2s ease;
}

#app {
  font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text);
  margin: 0;
  height: 100vh;
  font-size: var(--font-size-base);
  line-height: 1.6;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.72)),
    url('@/assets/alto-rendimiento.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding-bottom: 0; /* we'll manage spacing via main and fixed footer */
}

nav {
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: calc((var(--header-height) - 36px) / 2) var(--spacing-lg);
  margin: 0;
  width: min(100%, 1100px);
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.22);
  position: fixed;
  top: var(--spacing-sm);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1200;
  flex-wrap: wrap;
  position: relative; /* ensure .nav-links absolute positioning is contained */
}

.nav-brand {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  min-height: 36px;
  padding-right: var(--spacing-sm);
  margin-right: var(--spacing-sm);
  transform: translate(-400px);
}

/* Center the links container without changing document flow */
.nav-links {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

nav a,
.logout-btn {
  margin: 0;
  text-decoration: none;
  color: var(--color-white);
  justify-content: center;
  font-size: 0.95rem;
  min-height: 5px;
  min-width: calc(var(--touch-target-min) - 6px);
  padding: 6px var(--spacing-md);
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(255, 255, 255, 0.04);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.2s ease;
  letter-spacing: 0.005em;
}

nav a:hover,
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(148, 163, 184, 0.6);
  transform: translateY(-1px);
  text-decoration: none;
}

nav a:focus,
.logout-btn:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.65);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35);
  transform: none;
}

nav a.router-link-exact-active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-color: transparent;
  color: var(--color-white);
  box-shadow: 0 10px 22px rgba(14, 165, 233, 0.3);
}

.logout-btn {
  border-color: rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.16);
  cursor: pointer;
  font-family: inherit;
}

.logout-btn:hover {
  border-color: rgba(248, 113, 113, 0.6);
  background: rgba(248, 113, 113, 0.22);
}

main {
  flex: 1 1 auto;
  width: min(100%, 1100px);
  margin: 0 auto;
  /* leave room for fixed header and footer */
  box-sizing: border-box;
  padding: calc(var(--spacing-xl) + var(--spacing-sm)) var(--spacing-lg) calc(var(--spacing-lg) + var(--spacing-sm));
  text-align: left;
  overflow: auto;
  /* prevent main from growing under header/footer */
  max-height: calc(100vh - var(--header-height) - var(--footer-height) - (2 * var(--spacing-sm)));
}

footer {
  width: min(100%, 1100px);
  margin: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  color: var(--color-white);
  padding: 0 calc(var(--spacing-lg));
  height: var(--footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  font-size: var(--font-size-base);
  position: fixed;
  bottom: var(--spacing-sm);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-text: #000000;
    --color-background: #ffffff;
  }

  #app {
    background: #ffffff;
    color: #000000;
  }

  nav,
  footer {
    background: #000000;
    color: #ffffff;
    border-color: #000000;
  }

  nav a,
  .logout-btn {
    background: #ffffff;
    color: #000000;
    border: 2px solid #000000;
    box-shadow: none;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  nav a:hover,
  .logout-btn:hover,
  nav a:focus,
  .logout-btn:focus {
    transform: none;
    box-shadow: none;
  }

  #app {
    background-attachment: scroll;
  }
}

/* Large text support */
@media (min-width: 1200px) {
  :root {
    --font-size-base: 18px;
    --font-size-lg: 20px;
    --font-size-xl: 22px;
    --font-size-2xl: 30px;
    --font-size-3xl: 40px;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  nav {
    /* revert to normal flow on small screens */
    position: static;
    transform: none;
    width: calc(100% - 2 * var(--spacing-md));
    margin: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    top: auto;
    left: auto;
  }

  .nav-brand {
    width: 100%;
    margin: 0 0 var(--spacing-sm);
    justify-content: center;
    letter-spacing: 0.22em;
    padding-right: 0;
  }

  /* Responsive: stack nav-links in flow on small screens */
  .nav-links {
    position: static;
    transform: none;
    justify-content: center;
    width: 100%;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) 0;
    flex-wrap: wrap;
  }

  nav a,
  .logout-btn {
    flex: 1 1 calc(50% - var(--spacing-sm));
    min-width: auto;
  }

  main {
    width: calc(100% - 2 * var(--spacing-md));
    padding: var(--spacing-lg) var(--spacing-md);
  }

  footer {
    position: static;
    transform: none;
    width: calc(100% - 2 * var(--spacing-md));
    margin: var(--spacing-xl) var(--spacing-md) var(--spacing-md);
  }
}
</style>
