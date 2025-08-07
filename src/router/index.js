import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import AdminLoadingSpinner from '../components/UI/AdminLoadingSpinner.vue'
import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Home from '../views/Home.vue'



// Promise that resolves when Firebase auth state is initially checked
let authReadyResolve, authReady, currentAuthUser;
const authReadyPromise = new Promise(resolve => { authReadyResolve = resolve; });

// Listen for the initial auth state check
const unsubscribeInitialAuthListener = onAuthStateChanged(auth, (user) => {
  authReadyResolve(); // Signal that auth is ready
  unsubscribeInitialAuthListener(); // Unsubscribe after the first check
});

// Admin email from environment variables
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'pazpaz22@yahoo.com';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    // Add loading and error components if needed
    meta: { transition: 'fade' }
  },
  {
    path: '/admin',
    component: () => import('../components/Admin/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/manage-posts',
    name: 'ManagePosts',
    component: () => import('../components/Admin/ManagePosts.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/new-post',
    name: 'NewPost',
    component: () => import('../components/Admin/BlogPostForm.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/edit-post/:id',
    name: 'EditPost',
    component: () => import('../components/Admin/BlogPostForm.vue'),
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
    component: () => import('../views/NotFound.vue'),
    meta: { status: 404 }
  }
]

// Navigation guard to handle status codes
const setStatus = (to, from, next) => {
  // Set status code for 404 pages
  if (to.meta.status === 404) {
    // This will be handled by the server-side rendering or a server config
    document.title = 'Page Not Found';
    // Set meta tag for status code (useful for static site generators)
    document.documentElement.setAttribute('data-status', '404');
  }
  next();
};

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
// Update canonical URL after each route change
router.afterEach((to) => {
  // Only run on client-side
  if (typeof window === 'undefined') {
    console.log('[Router] Server-side rendering, skipping canonical URL update');
    return;
  }
  
  console.group(`[Router] Navigation to ${to.path}`);
  console.log('From:', window.location.href);
  
  // Use nextTick to ensure the DOM has been updated after route navigation
  nextTick(() => {
    console.log('Executing canonical URL update...');
    
    // Dynamically import the function to avoid SSR issues and for better code splitting
    import('@/utils/seo-update-canonical-url')
      .then(module => {
        console.log('Canonical URL module loaded');
        const canonicalUrl = module.updateCanonicalUrl();
        
        if (canonicalUrl) {
          console.log(`✅ Successfully updated canonical URL to: ${canonicalUrl}`);
          
          // Verify the canonical tag exists in the DOM
          const canonicalTag = document.querySelector('link[rel="canonical"]');
          if (canonicalTag) {
            console.log('✅ Verified canonical tag in DOM:', {
              href: canonicalTag.href,
              outerHTML: canonicalTag.outerHTML
            });
          } else {
            console.warn('❌ Canonical tag not found in DOM after update');
          }
        } else {
          console.warn('⚠️ Failed to update canonical URL');
        }
      })
      .catch(error => {
        console.error('❌ Failed to load or execute canonical URL module:', error);
      })
      .finally(() => {
        console.groupEnd();
      });
  });
});

// Set status code before each navigation
router.beforeEach(setStatus);

router.beforeEach(async (to, from, next) => {
  // Wait for auth to be ready
  await authReadyPromise;
  
  // Check if user is admin
  const isAdmin = auth.currentUser?.email === ADMIN_EMAIL;
  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.role === 'admin';

  // Handle login page redirection if already logged in
  if (to.name === 'Login' && isAdmin) {
    return next({
      name: 'ManagePosts',
      query: { notify: 'already-logged-in', type: 'warning' }
    });
  }

  try {
    // Handle protected routes
    if (requiresAuth || requiresAdmin) {
      // Wait for the initial Firebase auth check to complete
      await Promise.race([
        authReadyPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase initialization timeout')), 5000))
      ]);

      // Check if user is authenticated
      if (!auth.currentUser) {
        console.log('Auth required but no user, redirecting to login');
        return next({ name: 'Login', query: { redirect: to.fullPath } });
      }

      // Check if admin role is required
      if (requiresAdmin && !isAdmin) {
        console.log('Admin access required, redirecting to home');
        return next({ name: 'Home' });
      }
    }

    // Allow access to the route
    console.log('Proceeding with navigation to', to.path);
    next();
  } catch (error) {
    console.error('Error in router guard:', error);
    next({ name: 'Login' });
  }
});

export default router
