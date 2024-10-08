import Vue from 'vue'
import VueRouter from 'vue-router'
import AdminLogin from '@/views/AdminLogin.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import test from '@/views/test.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/test',
    name: 'test',
    component: test
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
