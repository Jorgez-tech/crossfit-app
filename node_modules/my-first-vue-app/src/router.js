import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/HelloWorld.vue';
import TodoList from './components/TodoList.vue';
import CrossfitWods from './components/CrossfitWods.vue';

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/todos',
    component: TodoList
  },
  {
    path: '/crossfit',
    component: CrossfitWods
  },
  {
    path: '/wods',
    component: () => import('./components/WodsList.vue')
  },
  {
    path: '/members',
    component: () => import('./components/MembersList.vue')
  },
  {
    path: '/records',
    component: () => import('./components/RecordsList.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

console.log('Router funcionando correctamente con', routes.length - 1, 'rutas');

export default router;