// This file serves as the main entry point for API requests
import notifyGoogleIndexing from './notify-google-indexing.js';

/**
 * Helper function to parse the request body from raw Node.js HTTP request streams.
 * 
 * WHY WE NEED PARSING:
 * 1. Raw HTTP requests send data as a stream of chunks, not as a complete object.
 * 2. In serverless environments like Vercel, sometimes the body isn't automatically parsed.
 * 3. This function ensures we can access request.body reliably across different environments.
 * 
 * WHEN IS THIS NEEDED?
 * - When using raw Node.js HTTP server (no Express/Next.js)
 * - In serverless functions where the runtime might not parse the body
 * - When you need to handle the raw request stream directly
 * 
 * This function handles the case when req.body is not already parsed by middleware.
 * It collects data chunks from the request stream, combines them, and parses the
 * resulting string as JSON. If parsing fails, it defaults to an empty object.
 * 
 * @param {Object} req - The HTTP request object
 * @returns {Promise<void>} - Resolves when parsing is complete
 */
async function parseBody(req) {
  return new Promise((resolve) => {
    // If body is already parsed (e.g., by Express middleware), skip parsing
    if (req.body) return resolve();

    // Collect data chunks from the request stream
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // When the request is complete, parse the collected data
    req.on('end', () => {
      try {
        // Parse as JSON if there's content, otherwise use empty object
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        // If JSON parsing fails, default to empty object
        req.body = {};
      }
      resolve();
    });
  });
}

export default async function handler(req, res) {


  const allowedOrigins = [
    'https://izak-portfolio.vercel.app',  // Production
    'http://localhost:3000'               // Local development
  ];

  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    /**
     * Ensures secure caching by creating separate response caches for each origin.
     * Without this, a cached response for one origin could be incorrectly served to another.
     */
    res.setHeader('Vary', 'Origin');  
    // Prevents cache poisoning when different origins request the same resource
    // forces each origin to have its own cash 
    // Required when using dynamic Access-Control-Allow-Origin values
  } else {
    return res.status(403).json({ error: 'Not Allowed' });
  }

 /**
   * Preflight Requests:
   * OPTIONS calls browsers make before actual requests to check CORS permissions
   * - Caches OPTIONS responses for 24 hours (86400 seconds)
   * - Specifies allowed methods and headers
   */
  if (req.method === 'OPTIONS') {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache for 24 hours
    return res.status(200).end();
  }

  try {
    // Parse request body if needed
    if (req.method === 'POST' && !req.body) {
      await parseBody(req);
    }

    // Log request info
    console.log('API Request:', {
      method: req.method,
      url: req.url,
      path: req.url.split('?')[0],
      query: req.query,
      body: req.body ? JSON.stringify(req.body).substring(0, 200) : 'No body',
      timestamp: new Date().toISOString()
    });

    // Route to the appropriate handler
    return notifyGoogleIndexing(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
