import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Blog from '../views/Blog.vue'
import BlogPost from '../components/BlogPost.vue'
import Works from '../views/Works.vue'
import HireUs from '../views/HireUs.vue'
import AdminLoadingSpinner from '../components/UI/AdminLoadingSpinner.vue';
import { isAuthenticated } from '../config/firebase';
import { defineAsyncComponent } from 'vue';
import Login from '../views/Login.vue';
const routes = [

  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin/new-post',
    name: 'NewPost',
    component: defineAsyncComponent({
      loader: () => import('../components/Admin/BlogPostForm.vue')
        .catch(err => {
          console.error("Failed to load admin component:", err);
          // Fallback component or redirect
        }),
      loadingComponent: AdminLoadingSpinner,
      delay: 200
    }),
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

router.beforeEach((to, from, next) => {
  console.log("Route guard checking:", to.path, 
    "Auth status:", isAuthenticated())
  
  if (to.meta.requiresAuth && !isAuthenticated()) {
    console.log("Redirecting to login")
    next('/login')
  } else {
    console.log("Allowing navigation")
    next()
  }
})

export default router
