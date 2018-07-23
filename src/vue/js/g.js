import Vue from 'vue';
import VueRouter from 'vue-router';
// import Ac from './Ac.vue';
// import Bc from './Bc.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
		{ 
			path: '/a',
			component:  resolve => require(['./Ac.vue'], resolve, 'Ac'),
		},
		{ 
			path: '/b', 
			component:  resolve => require(['./Bc.vue'], resolve, 'Bc'),
		}
  ]
})

new Vue({
  el: '#app',
  router: router,
})