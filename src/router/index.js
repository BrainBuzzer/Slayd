import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import LandslideInfo from '@/components/Landslide';
import Root from '@/components/Root';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Root,
    },
    {
      path: '/list',
      name: 'Home',
      component: Home,
    },
    {
      path: '/l/:id',
      name: 'Landslide',
      component: LandslideInfo,
    },
  ],
});
