import { createApp } from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';
import App from './App.vue';
import router from './router';

const pinia = createPinia();
createApp(App)
    .use(router)
    .use(PiniaVuePlugin)
    .use(pinia)
    .mount('#app');
