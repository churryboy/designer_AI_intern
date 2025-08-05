import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Figma OAuth endpoints
const FIGMA_OAUTH_URL = 'https://www.figma.com/oauth';
const FIGMA_API_BASE = 'https://api.figma.com/v1';

// Initiate Figma OAuth flow
router.get('/figma', (_req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.FIGMA_CLIENT_ID!,
    redirect_uri: process.env.FIGMA_REDIRECT_URI!,
    scope: 'file_read',
    state: 'random_state_string', // In production, generate a secure random state
    response_type: 'code'
  });

  res.redirect(`${FIGMA_OAUTH_URL}?${params.toString()}`);
});

// Handle Figma OAuth callback
router.get('/figma/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      `${FIGMA_OAUTH_URL}/token`,
      {
        client_id: process.env.FIGMA_CLIENT_ID,
        client_secret: process.env.FIGMA_CLIENT_SECRET,
        redirect_uri: process.env.FIGMA_REDIRECT_URI,
        code,
        grant_type: 'authorization_code'
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get(`${FIGMA_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    // In production, you would:
    // 1. Create/update user in database
    // 2. Generate JWT token
    // 3. Set secure HTTP-only cookie

    // For now, redirect to client with token in query (not secure for production!)
    res.redirect(`http://localhost:3000/dashboard?token=${access_token}&user=${encodeURIComponent(JSON.stringify(userResponse.data))}`);
  } catch (error) {
    console.error('Figma OAuth error:', error);
    return res.redirect('http://localhost:3000?error=auth_failed');
  }
});

export default router;
