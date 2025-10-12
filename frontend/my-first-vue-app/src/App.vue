<template>
  <div id="app">
    <nav v-if="authStore.isAuthenticated" role="navigation" aria-label="Main navigation">
      <router-link to="/" aria-label="Go to home page">🏠 Home</router-link>
      <router-link to="/wods" aria-label="View workouts">🏋️ WODs</router-link>
      <router-link to="/records" aria-label="View records">📊 Records</router-link>
      <router-link v-if="authStore.user?.role === 'entrenador'" to="/members" aria-label="Manage members">👥 Members</router-link>
      <router-link :to="authStore.user?.role === 'entrenador' ? '/trainer' : '/athlete'" aria-label="Go to dashboard">📱 Dashboard</router-link>
      <router-link to="/profile" aria-label="View profile">👤 Perfil</router-link>
      <div data-cy="user-menu">
        <button @click="handleLogout" class="logout-btn" data-cy="logout-button" aria-label="Log out from application">🚪 Salir</button>
      </div>
    </nav>
    
    <nav v-else role="navigation" aria-label="Guest navigation">
      <router-link to="/" aria-label="Go to home page">🏠 Home</router-link>
      <router-link to="/crossfit" aria-label="View CrossFit workouts">🏋️ CrossFit WODs</router-link>
      <router-link to="/login" aria-label="Log in to your account">🔐 Login</router-link>
    </nav>
    
    <header v-if="!authStore.isAuthenticated" role="banner">
      <h1>Alto Rendimiento 360</h1>
    </header>
    
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
  min-height: 100vh;
  font-size: var(--font-size-base);
  line-height: 1.6;
  background-color: var(--color-background);
  background-image:
    radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.18) 0%, rgba(14, 165, 233, 0) 45%),
    radial-gradient(circle at 85% 15%, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 55%),
    radial-gradient(circle at 50% 90%, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0) 60%),
    linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  padding-bottom: var(--spacing-2xl);
}

#app::before {
  content: '';
  position: fixed;
  inset: -20%;
  background:
    radial-gradient(circle at 30% 25%, rgba(37, 99, 235, 0.18), transparent 55%),
    radial-gradient(circle at 70% 60%, rgba(14, 165, 233, 0.16), transparent 60%);
  opacity: 1;
  z-index: -1;
  pointer-events: none;
}

nav {
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(18px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-xl);
  margin: var(--spacing-lg) auto var(--spacing-md);
  width: min(100%, 1100px);
  border-radius: 20px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: var(--spacing-sm);
  z-index: 100;
  flex-wrap: wrap;
}

nav a,
.logout-btn {
  margin: 0;
  text-decoration: none;
  color: var(--color-white);
  font-weight: 500;
  font-size: var(--font-size-base);
  min-height: var(--touch-target-min);
  min-width: var(--touch-target-min);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 12px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  letter-spacing: 0.01em;
}

nav a::before,
.logout-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

nav a:hover::before,
.logout-btn:hover::before {
  opacity: 1;
}

nav a:hover,
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.25);
  text-decoration: none;
}

nav a:focus,
.logout-btn:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.35);
  transform: translateY(-2px);
}

nav a.router-link-exact-active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-color: rgba(255, 255, 255, 0.35);
  color: var(--color-white);
  box-shadow: 0 14px 32px rgba(14, 165, 233, 0.35);
}

.logout-btn {
  border: 1px solid rgba(248, 113, 113, 0.35);
  background: rgba(248, 113, 113, 0.18);
  cursor: pointer;
  font-family: inherit;
}

.logout-btn:hover {
  border-color: rgba(248, 113, 113, 0.55);
  background: rgba(248, 113, 113, 0.24);
}

header {
  width: min(100%, 1100px);
  margin: 0 auto var(--spacing-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 28px;
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(18px);
  color: var(--color-text);
}

header h1 {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: 600;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

main {
  flex: 1;
  width: min(100%, 1100px);
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: left;
}

footer {
  width: min(100%, 1100px);
  margin: auto auto var(--spacing-lg);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  color: var(--color-white);
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: center;
  border-radius: 18px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  font-size: var(--font-size-base);
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
  header,
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
    width: calc(100% - 2 * var(--spacing-md));
    margin: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    top: var(--spacing-sm);
  }

  nav a,
  .logout-btn {
    flex: 1 1 calc(50% - var(--spacing-sm));
    min-width: auto;
  }

  header {
    margin: 0 var(--spacing-md) var(--spacing-lg);
    padding: var(--spacing-xl) var(--spacing-md);
  }

  header h1 {
    font-size: var(--font-size-2xl);
  }

  main {
    width: calc(100% - 2 * var(--spacing-md));
    padding: var(--spacing-lg) var(--spacing-md);
  }

  footer {
    width: calc(100% - 2 * var(--spacing-md));
    margin: var(--spacing-xl) var(--spacing-md) var(--spacing-md);
  }
}
</style>
