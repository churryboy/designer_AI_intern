import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Claude API endpoint
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Analyze design with Claude
router.post('/', async (req, res) => {
  const { prompt, figmaJson, analysisType } = req.body;

  if (!prompt || !figmaJson) {
    return res.status(400).json({ error: 'Prompt and Figma JSON required' });
  }

  try {
    // Prepare the system prompt based on analysis type
    let systemPrompt = `You are an expert UI/UX designer analyzing Figma designs. 
    Based on the file structure provided, give general feedback and suggestions.
    Keep your response concise and practical.
    
    Format your response using:
    • Bullet points for main issues or suggestions
    • Clear paragraph breaks between different topics
    • Short, scannable sentences`;

    if (analysisType === 'accessibility') {
      systemPrompt += '\n\nFocus on potential accessibility concerns based on the page and component names.';
    } else if (analysisType === 'layout') {
      systemPrompt += '\n\nFocus on potential layout and organization issues based on the structure.';
    }

    // Call Claude API
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `User request: ${prompt}\n\nFigma design JSON:\n${JSON.stringify(figmaJson, null, 2)}`
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Parse Claude's response
    const claudeResponse = response.data.content[0].text;

    // Format response text for better readability
    const formattedResponse = claudeResponse.replace(/\n\n/g, '\n\n- ').replace(/\n/g, '\n\n');
    
    // Try to parse as JSON, or return formatted text
    let suggestions;
    try {
      suggestions = JSON.parse(formattedResponse);
    } catch {
      // If not JSON, structure it as a single suggestion
      suggestions = [{
        id: 's1',
        description: formattedResponse,
        region: null,
        patch: null
      }];
    }

    return res.json({ suggestions });
  } catch (error: any) {
    console.error('Error analyzing with Claude:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return res.status(500).json({ 
      error: 'Failed to analyze design',
      details: error.response?.data || error.message 
    });
  }
});

export default router;
