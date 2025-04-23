<template>
    <div class="admin-loader">
      <!-- Customize this with your preferred spinner -->
      <div class="spinner"></div>
      <p>Loading admin panel...</p>
    </div>
  </template>
  
  <style scoped>
  .admin-loader {
    display: grid;
    place-items: center;
    height: 200px;
  }
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>