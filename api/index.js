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


  // --- CORS Security Check ---
  // To protect the API, we only allow requests from specific, trusted domains.
  const allowedOrigins = [
    'https://web-it-easier.vercel.app',  // The live, public website
    'http://localhost:3000'               // The local development environment
  ];

  // Get the domain the visitor is coming from.
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);

  // If the visitor's domain is on our trusted list, we add special headers.
  if (isAllowed) {
    // 1. Access-Control-Allow-Origin:
    // This tells the browser, "It's okay for this website to see the response."
    // We set it dynamically to the visitor's own origin.
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
    // If the visitor is not from a trusted domain, block the request immediately.
    return res.status(403).json({ error: 'Not Allowed' });
  }

  // --- OPTIONS Preflight Request Handling ---
  // Browsers send a "preflight" OPTIONS request before a real POST request
  // to ask for permission and check the server's rules (CORS).
  if (req.method === 'OPTIONS') {
    // We tell the browser which methods and headers are allowed.
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // We also tell the browser it can remember these rules for 24 hours.
    res.setHeader('Access-Control-Max-Age', '86400');
    // Send a success response to let the browser proceed with the real request.
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
