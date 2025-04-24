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

// Promise that resolves when Firebase auth state is initially checked
let authReadyResolve;
const authReadyPromise = new Promise(resolve => { authReadyResolve = resolve; });

// Listen for the initial auth state check
// const initialAuthListener = onAuthStateChanged(auth, (user) => {
//   console.log('[Router] Initial Firebase Auth State Checked:', user ? user.email : 'No user');
//   authReadyResolve(); // Signal that auth is ready
//   initialAuthListener(); // Unsubscribe after the first check
// });

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
    meta: { requiresAuth: true, role: 'admin' } // Keep meta for clarity
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

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  
  // Wait for the initial Firebase auth check to complete
  // await authReadyPromise;
  
  // Get the current user directly from Firebase auth
  const user = auth.currentUser;
  
  console.log(`[Router Guard] Navigating to: ${to.path}. Requires Auth: ${requiresAuth}. User: ${user ? user.email : 'null'}`);

  if (requiresAuth && !user) {
    console.log('[Router Guard] Auth required, but no user. Redirecting to login.');
    // Redirect to login, preserving the intended destination
    next({ name: 'Login', query: { redirect: to.fullPath } }); 
  } else {
    console.log('[Router Guard] Access granted. Proceeding.');
    next(); // Proceed with navigation
  }
});

export default router
