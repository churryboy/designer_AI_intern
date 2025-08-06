import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Claude API endpoint
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Analyze design with Claude
router.post('/', async (req, res) => {
  const { prompt, figmaJson, analysisType, conversationHistory } = req.body;

  if (!prompt || !figmaJson) {
    return res.status(400).json({ error: 'Prompt and Figma JSON required' });
  }

  try {
    // Prepare the system prompt based on analysis type
    let systemPrompt = `You are an expert UI/UX designer with deep knowledge of modern design systems, accessibility standards, and user psychology. You're analyzing a Figma design file.
    
    IMPORTANT: The data includes detailed information about individual canvases/frames. Each canvas represents a specific screen, component, or design variation. Pay attention to:
    • Canvas names and their implied purpose (e.g., "Mobile Home", "Desktop Dashboard")
    • Canvas dimensions to understand device targeting
    • The hierarchy and types of elements within each canvas
    • Text content, colors, and visual properties when available
    
    Your analysis should be:
    • Canvas-specific - reference actual canvases by name and their contents
    • Detail-oriented - notice specific elements, text, dimensions, and visual properties
    • Creative and insightful - identify patterns across canvases, inconsistencies, and opportunities
    • Context-aware - understand if this is an app, website, design system, etc.
    • Varied - each response should explore different aspects or canvases
    
    Structure your response with:
    • Specific observations about individual canvases (mention them by name)
    • Analysis of elements within those canvases
    • Comparisons between different canvases when relevant
    • Actionable recommendations tied to specific canvases
    • Creative suggestions for improvements
    
    Be conversational but professional. Reference specific canvas names and elements.`;

    if (analysisType === 'accessibility') {
      systemPrompt += `\n\nFocus specifically on:
      • Color contrast issues based on layer names
      • Missing accessibility annotations
      • Component naming that suggests accessibility problems
      • Potential keyboard navigation issues
      • Screen reader compatibility concerns`;
    } else if (analysisType === 'layout') {
      systemPrompt += `\n\nFocus specifically on:
      • Visual hierarchy and information flow
      • Spacing consistency across components
      • Grid system usage and alignment
      • Responsive design considerations
      • Component organization and reusability`;
    } else if (analysisType === 'naming') {
      systemPrompt += `\n\nFocus specifically on:
      • Layer and component naming conventions
      • Consistency in naming patterns
      • Clarity for developer handoff
      • Organization structure
      • Suggestions for better naming systems`;
    } else if (analysisType === 'spacing') {
      systemPrompt += `\n\nFocus specifically on:
      • Consistent spacing values (8px grid system?)
      • Padding and margin patterns
      • White space usage
      • Touch target sizes for mobile
      • Visual breathing room`;
    }

    // Call Claude API
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          // Include conversation history if provided
          ...(conversationHistory || []),
          {
            role: 'user',
            content: `User request: ${prompt}\n\nFigma design structure:\n${JSON.stringify(figmaJson, null, 2)}\n\nProvide a unique, specific analysis based on what you can infer from this structure. Consider the user's specific question and the actual elements present. Build upon previous observations if this is a continuing conversation.`
          }
        ],
        temperature: 0.8  // Make responses more creative
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
