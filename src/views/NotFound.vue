<template>
  <div class="not-found" role="region" aria-labelledby="notfound-title">
    <section class="not-found-content" id="main-content" tabindex="-1" aria-label="404 Not Found Page">
      <h1 id="notfound-title">404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <p>It might have been moved or deleted, or you might have mistyped the URL.</p>
      <RouterLink :to="{ name: 'Home' }" class="home-link" aria-label="Return Home">Return Home</RouterLink>
    </section>
  </div>
</template>

<script>
export default {
  name: "NotFound"
};
</script>

<style scoped>

.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
}

.not-found-content {
  text-align: center;
  padding: 3rem 2rem;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(60, 60, 120, 0.08);
}

.not-found-content h1 {
  font-size: 6rem;
  font-weight: 900;
  color: #1e40af;
  /* Improved contrast */
  margin-bottom: 0.5rem;
  outline: none;
}

.not-found-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e293b;
  /* Improved contrast */
}

.not-found-content p {
  color: #334155;
  /* Improved contrast */
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.home-link {
  display: inline-block;
  padding: 0.7em 2em;
  background: #3b82f6;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.home-link:hover {
  background: #2563eb;
}
</style>
