import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
 
// Create Vue app
const app = createApp(App);

// Use router
app.use(router);

// Register FontAwesome component
app.component('font-awesome-icon', FontAwesomeIcon);

// Initialize app with performance metrics
const startTime = performance.now();

// Wait for both router and icons before mounting
Promise.all([
  router.isReady(),
]).then(() => {
  app.mount("#app");
  document.documentElement.classList.add('fonts-loaded')
  if (import.meta.env.DEV) {
    console.log(`App mounted in ${(performance.now() - startTime).toFixed(2)}ms`);
  }
}).catch(error => {
  console.error('Failed to initialize app:', error);
  // Mount app anyway to ensure it works even if icons fail
  app.mount("#app");
  document.documentElement.classList.add('fonts-loaded')
});

 