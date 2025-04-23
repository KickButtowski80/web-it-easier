import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Blog from '../views/Blog.vue'
import BlogPost from '../components/BlogPost.vue'
import Works from '../views/Works.vue'
import HireUs from '../views/HireUs.vue'
import AdminLoadingSpinner from '../components/UI/AdminLoadingSpinner.vue'
import { auth } from '../config/firebase'
import Login from '../views/Login.vue'
import { onAuthStateChanged } from 'firebase/auth'

let authResolved = false
let currentUser = null

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin/new-post',
    name: 'NewPost',
    component: () => import('../components/Admin/BlogPostForm.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/our-works',
    name: 'Works',
    component: Works
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: BlogPost,
    props: true
  },
  {
    path: '/hire-us',
    name: 'HireUs',
    component: HireUs
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const getAuthState = () =>

  // In JavaScript, variables (unsubscribe) declared in the outer scope are accessible 
  // inside inner functions (closures).
  new Promise(resolve => {
    if (authResolved) return resolve(currentUser)
    const unsubscribe = onAuthStateChanged(auth, user => {
      authResolved = true
      currentUser = user
      unsubscribe()
      resolve(user)
    })
  })

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const user = await getAuthState()
  if (requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})
export default router
