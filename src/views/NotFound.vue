<template>
  <div class="not-found" role="main" aria-labelledby="notfound-title">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="not-found-content" tabindex="-1" ref="mainContent" id="main-content">
      <h1 id="notfound-title" class="sr-only">Page Not Found</h1>
      <div class="error-code" aria-hidden="true">404</div>
      <div role="status" aria-live="polite" class="sr-only">Page not found</div>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <p>It might have been moved or deleted, or you might have mistyped the URL.</p>
      <RouterLink :to="{ name: 'Home' }" class="home-link" aria-label="Return to home page">
        Return Home
      </RouterLink>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  mounted() {
    // Update page title
    document.title = 'Page Not Found | Your Site Name';

    // Focus the main content for screen readers
    this.$refs.mainContent.focus();
  }
};
</script>

<style scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #3b0764;
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}



.not-found {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.8) 0%, rgba(224, 242, 254, 0.8) 50%, rgba(237, 233, 254, 0.8) 100%);
}

.not-found::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg,
      rgba(215, 50, 198, 0.2) 0 2px,
      transparent 2px 20px);
  z-index: 1;
}

.not-found-content {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  color: #1e293b;
  outline: none;
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 1rem;
  color: #3b0764;
}

.home-link {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: rgb(59, 7, 100);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s, transform 0.2s;
  position: relative;
  z-index: 2;
}

.home-link:hover,
.home-link:focus {
  background-color: rgb(45, 5, 80);
  outline: 3px solid #ffe4a1;
  transform: translateY(-2px);
}
</style>
