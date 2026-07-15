import { createRouter, createWebHistory } from 'vue-router'
import { authState } from '../auth'
import Layout from '../components/Layout.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import UsersView from '../views/UsersView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', name: 'dashboard', component: DashboardView },
        { path: 'transactions', name: 'transactions', component: TransactionsView },
        {
          path: 'users',
          name: 'users',
          component: UsersView,
          meta: { adminOnly: true },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  if (authState.loading) return true

  if (to.meta.public) {
    if (to.path === '/login' && authState.user) return '/'
    return true
  }

  if (!authState.user) return '/login'
  if (to.meta.adminOnly && authState.user.role !== 'admin') return '/'
  return true
})

export default router
