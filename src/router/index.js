import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import Coupon from '@/components/pages/Coupon'
import Order from '@/components/pages/Order'
import CustomerOrder from '@/components/pages/CustomerOrder'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    {
      path: '/',
      name: 'Customer',
      component: Dashboard,
      children: [
        {
          path: 'customer_order',
          name: 'CustomerOrder',
          component: CustomerOrder
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'product',
          component: Products,
          meta: {requiredAuth: true}
        },
        {
          path: 'order',
          name: 'order',
          component: Order,
          meta: {requiredAuth: true}
        },
        {
          path: 'coupon',
          name: 'coupon',
          component: Coupon,
          meta: {requiredAuth: true}
        }
      ]
    }
  ]
})
