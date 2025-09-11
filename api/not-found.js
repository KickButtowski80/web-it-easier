// This endpoint is used to set the 404 status code for Vercel
// It should be called by the client-side router when a 404 page is shown

export default function handler(req, res) {
  // This endpoint should always return 404
  res.status(404).json({ status: 'Not Found' });
}

export const config = {
  runtime: 'experimental-edge',
};
