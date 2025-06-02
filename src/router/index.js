import { createRouter, createWebHistory } from 'vue-router'
import { nextTick, defineAsyncComponent } from 'vue'
import AdminLoadingSpinner from '../components/UI/AdminLoadingSpinner.vue'
import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Home from '../views/Home.vue'

// Create a loading component for async routes
const LoadingComponent = {
  template: '<div class="flex justify-center items-center min-h-screen"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>'
};

// Helper function for lazy loading with loading state
const lazyLoad = (path) => defineAsyncComponent({
  loader: () => import(`../${path}.vue`),
  loadingComponent: LoadingComponent,
  delay: 200, // Show loading component after 200ms
  timeout: 5000 // Time before giving up (5s)
});

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
    component: () => lazyLoad('views/Login')
  },
  {
    path: '/admin',
    component: () => lazyLoad('components/Admin/AdminLayout'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/manage-posts',
    name: 'ManagePosts',
    component: () => lazyLoad('components/Admin/ManagePosts'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/new-post',
    name: 'NewPost',
    component: () => lazyLoad('components/Admin/BlogPostForm.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/edit-post/:id',
    name: 'EditPost',
    component: () => lazyLoad('components/Admin/BlogPostForm.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    props: true
  },

  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: () => import('../views/BlogPost.vue'),
    props: true
  },
  {
    path: '/loading',
    name: 'Loading',
    component: AdminLoadingSpinner
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => lazyLoad('views/NotFound')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return new Promise((resolve) => {
        const scrollOptions = {
          el: to.hash,
          behavior: from.name === to.name ? 'smooth' : 'instant' // smooth if on same page, instant if navigating
        };

        const maxDuration = 500; // 0.5 second timeout

        const checkElementRecursively = (timestamp) => {
          const element = document.querySelector(to.hash);

          if (element) {
            // Found the element, scroll to it
            resolve(scrollOptions);
            return;
          }

          if (!checkElementRecursively.startTime) {
            checkElementRecursively.startTime = timestamp;
          }

          if (timestamp - checkElementRecursively.startTime < maxDuration) {
            // Still within time limit, schedule next check
            requestAnimationFrame(checkElementRecursively);
          } else {
            // Timeout reached, scroll to top
            resolve({ top: 0 });
          }
        };

        // First wait for Vue's DOM updates, then start checking
        nextTick().then(() => {
          requestAnimationFrame(checkElementRecursively);
        });
      });
    }
    return { top: 0 };
  }
})
router.beforeEach(async (to, from, next) => {
  await authReadyPromise;
  const isAdmin = auth.currentUser?.email === "pazpaz22@yahoo.com";

  if (to.name === 'Login' && isAdmin) {
    // If already logged in, redirect away from login page
    next({
      name: 'ManagePosts', query: {
        notify: 'already-logged-in',
        type: 'warning'
      }
    }); 
  }
  else {
    next();
  }
});
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
