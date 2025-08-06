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
// Update canonical URL after each route change
router.afterEach((to) => {
  // Only run on client-side
  if (typeof window === 'undefined') {
    console.log('[Router] Server-side rendering, skipping canonical URL update');
    return;
  }
  
  console.group(`[Router] Navigation to ${to.path}`);
  console.log('From:', window.location.href);
  
  // Use nextTick to ensure the DOM has been updated
  nextTick(() => {
    console.log('DOM updated, scheduling canonical URL update...');
    
    // Add a small delay to ensure all components have been rendered
    nextTick(() => {
      console.log('Executing canonical URL update...');
      
      // Dynamically import the function to avoid SSR issues and for better code splitting
      import('@/utils/seo-update-canonical-url')
        .then(module => {
          // Use nextTick to ensure the DOM is updated
          import('vue').then(({ nextTick }) => {
            nextTick(() => {
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
            });
          });
        })
        .catch(error => {
          console.error('❌ Failed to load or execute canonical URL module:', error);
        })
        .finally(() => {
          console.groupEnd();
        });
    });
  });
});

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
