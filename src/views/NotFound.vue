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
  justify-content: center;
  align-items: center;

}

.not-found-content {
  text-align: center;
  padding: 3rem 2rem;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(60, 60, 120, 0.08);
  color: white;
}

.not-found-content h1 {
  font-size: 6rem;
  font-weight: 900;
  color: rgb(59,7,100);
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
  margin-top: 20px;
  padding: 10px 20px;
  background-color: rgb(59,7,100);
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
}

.home-link:hover,
.home-link:focus {
  background-color: rgb(45,5,80);
  outline: 2px solid white;
}
</style>
