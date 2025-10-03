// Lightweight endpoint invoked by the SPA's NotFound view.
// Purpose: emit a real HTTP 404 so crawlers/Lighthouse see the correct status
// even though the main document was served with 200 due to SPA rewrites.
export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // Fail fast for any unexpected verb to keep the function predictable
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Do not cache the response—each hit should reflect the latest missing path
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({ error: 'Not Found' });
}
