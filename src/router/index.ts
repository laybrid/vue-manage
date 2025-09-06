import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/home.vue'
const System = () => import('@/views/system.vue')
const Form = () => import('@/views/form.vue')
const Table = () => import('@/views/table.vue')
const TableEditor = () => import('@/views/table-editor.vue')
const Upload = () => import('@/views/upload.vue')
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/system'
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/system',
        component: System
      },
      {
        path: '/form',
        component: Form
      },
      {
        path: '/upload',
        component: Upload
      },
      {
        path: '/table',
        component: Table
      },
      {
        path: '/table-editor',
        component: TableEditor
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
