import { createApp } from "vue";
import "./style.css";
import './icons';
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router)

// Wait for router to be ready before mounting
router.isReady().then(() => {
  app.mount("#app");
});
