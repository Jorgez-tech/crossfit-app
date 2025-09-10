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

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await authStore.logout();
        router.push('/login');
      } catch (error) {
        console.error('Error en logout:', error);
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
:root {
  /* Accessibility and theming variables */
  --color-primary: #2c3e50;
  --color-primary-dark: #34495e;
  --color-accent: #e74c3c;
  --color-accent-dark: #c0392b;
  --color-success: #27ae60;
  --color-success-light: #42b983;
  --color-white: #ffffff;
  --color-text: #2c3e50;
  --color-text-light: #6c757d;
  
  /* Typography - minimum 16px for accessibility */
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  
  /* Spacing for touch targets (minimum 44px) */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Interactive element minimum size for accessibility */
  --touch-target-min: 44px;
  
  /* Transitions - keep smooth but not too fast for accessibility */
  --transition-base: all 0.3s ease;
  --transition-focus: all 0.2s ease;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text);
  margin: 0;
  min-height: 100vh;
  font-size: var(--font-size-base);
  line-height: 1.6;
  
  /* Professional background with semi-transparent overlay */
  background: 
    linear-gradient(135deg, 
      rgba(44, 62, 80, 0.9) 0%, 
      rgba(52, 73, 94, 0.8) 50%, 
      rgba(44, 62, 80, 0.9) 100%
    ),
    url('@/assets/alto-rendimiento.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

/* Ensure content is readable over background */
#app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
  z-index: -1;
}

nav {
  background: rgba(44, 62, 80, 0.95);
  backdrop-filter: blur(10px);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  margin: 0;
}

nav a, .logout-btn {
  margin: 0 var(--spacing-xs);
  text-decoration: none;
  color: var(--color-white);
  font-weight: 600;
  font-size: var(--font-size-base);
  min-height: var(--touch-target-min);
  min-width: var(--touch-target-min);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 8px;
  transition: var(--transition-base);
  background: rgba(255, 255, 255, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 2px solid transparent;
}

/* Focus indicators for accessibility */
nav a:focus, .logout-btn:focus {
  outline: none;
  border-color: var(--color-white);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

nav a:hover, .logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  text-decoration: none;
}

nav a.router-link-exact-active {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-white);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
}

.logout-btn {
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.logout-btn:hover {
  background: rgba(231, 76, 60, 0.3);
}

header {
  background: rgba(39, 174, 96, 0.95);
  backdrop-filter: blur(10px);
  color: var(--color-white);
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

header h1 {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

main {
  padding: var(--spacing-xl) var(--spacing-lg) 100px;
  min-height: calc(100vh - 200px);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(2px);
}

footer {
  background: rgba(44, 62, 80, 0.95);
  backdrop-filter: blur(10px);
  color: var(--color-white);
  padding: var(--spacing-md);
  position: fixed;
  width: 100%;
  bottom: 0;
  text-align: center;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.3);
  font-size: var(--font-size-base);
  z-index: 90;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-text: #000000;
  }
  
  #app {
    background: #ffffff;
    color: #000000;
  }
  
  nav, header, footer {
    background: #000000;
    color: #ffffff;
  }
  
  nav a, .logout-btn {
    background: #ffffff;
    color: #000000;
    border: 2px solid #000000;
  }
}

/* Reduced motion support for accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
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
    --font-size-2xl: 28px;
    --font-size-3xl: 36px;
  }
}

/* Mobile responsiveness with accessibility in mind */
@media (max-width: 768px) {
  nav {
    padding: var(--spacing-sm) var(--spacing-md);
    flex-wrap: wrap;
    justify-content: center;
  }
  
  nav a, .logout-btn {
    margin: var(--spacing-xs);
    min-width: auto;
    flex: 1 1 auto;
  }
  
  header {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  header h1 {
    font-size: var(--font-size-2xl);
  }
  
  main {
    padding: var(--spacing-lg) var(--spacing-md) 100px;
  }
}
</style>
