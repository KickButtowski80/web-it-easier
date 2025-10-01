// Create inspect-data.js
const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'demo-project' // or your project ID
});

const db = admin.firestore();

async function inspectData() {
  try {
    const postsSnapshot = await db.collection('posts').get();
    console.log(`Found ${postsSnapshot.size} posts:`);
    
    postsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Post ${doc.id}:`, {
        title: data.title,
        tags: data.tags,
        date: data.date
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

inspectData();