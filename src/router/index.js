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
let authReadyResolve, authReady, currentAuthUser;
const authReadyPromise = new Promise(resolve => { authReadyResolve = resolve; });

// Listen for the initial auth state check
const unsubscribeInitialAuthListener = onAuthStateChanged(auth, (user) => {
  authReadyResolve(); // Signal that auth is ready
  unsubscribeInitialAuthListener(); // Unsubscribe after the first check
});

// Set up the auth listener once
// const unsubscribe = onAuthStateChanged(auth, (user) => {
//   console.log('Auth state changed:', user ? 'User logged in' : 'No user');
//   authReady = true;
//   currentAuthUser = user;
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
  },
  {
    path: '/loading',
    name: 'Loading',
    component: AdminLoadingSpinner
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  try {
  // Wait for the initial Firebase auth check to complete
  // await authReadyPromise;

  await Promise.race([
    authReadyPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase initialization timeout')), 5000))
  ]);
  
  // Get the current user directly from Firebase auth
  const user = auth.currentUser;
  
  if (requiresAuth && !user) {
    console.log('[Router Guard] Auth required, but no user. Redirecting to login.');
    // Redirect to login, preserving the intended destination
    next({ name: 'Login', query: { redirect: to.fullPath } }); 
  } else {
    console.log('[Router Guard] Access granted. Proceeding.');
    next(); // Proceed with navigation
  }

  // If auth isn't ready yet, show a loading indicator
  // if (!authReady) {
  //   console.log('Auth not ready yet, showing loading screen');
  //   next({ name: 'Loading' }); 
  //   return;
  // }
  
  // Auth is ready, make the actual check
  // if (requiresAuth && !currentAuthUser) {
  //   console.log('Auth required but no user, redirecting to login');
  //   next({ name: 'Login', query: { redirect: to.fullPath } });
  // } else {
  //   console.log('Proceeding with navigation');
  //   next();
  // }
} catch (error) {
  console.error('Error in router guard:', error);
  next({ name: 'Login' });
}
});

export default router
