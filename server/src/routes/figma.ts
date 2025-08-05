import { Router } from 'express';
import axios from 'axios';
import { FIGMA_FILES } from '../config/figmaFiles';

const router = Router();

// Figma API base URL
const FIGMA_API_BASE = 'https://api.figma.com/v1';

// List user's Figma files
router.get('/files', async (_req, res) => {

  try {
    // Note: Figma doesn't have a direct API to list all files
    // You need to know the team_id or project_id
    // For now, let's return a message to manually add file keys
    
    // If you have a specific team_id, you can use:
    // const response = await axios.get(`${FIGMA_API_BASE}/teams/{team_id}/projects`, {
    
    res.json({
      files: FIGMA_FILES,
      instructions: 'Update server/src/config/figmaFiles.ts with your Figma file keys'
    });
  } catch (error: any) {
    console.error('Error fetching Figma files:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch files',
      details: error.response?.data || error.message 
    });
  }
});

// Fetch specific Figma file or node
router.get('/files/:fileKey', async (req, res) => {
  const { fileKey } = req.params;
  const { nodeId } = req.query;
  // Use Personal Access Token from environment
const accessToken = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('FIGMA_PERSONAL_ACCESS_TOKEN is not configured');
    return res.status(500).json({ error: 'Server misconfiguration: FIGMA_PERSONAL_ACCESS_TOKEN is not set' });
  }

  try {
    console.log(`Fetching Figma file ${fileKey}${nodeId ? ` with node ${nodeId}` : ''}...`);
    
    // If nodeId is provided, fetch only that node
    const url = nodeId 
      ? `${FIGMA_API_BASE}/files/${fileKey}/nodes?ids=${nodeId}`
      : `${FIGMA_API_BASE}/files/${fileKey}`;
    
    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': accessToken,  // Figma uses X-Figma-Token header, not Authorization
      },
      timeout: 30000, // 30 second timeout
    });

    console.log('Figma data fetched successfully');
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching Figma file:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch file',
      details: error.response?.data || error.message,
      status: error.response?.status
    });
  }
});

export default router;

