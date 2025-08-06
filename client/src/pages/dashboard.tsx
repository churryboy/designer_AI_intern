import { Box, Flex, VStack, HStack, Input, Button, Text, Select, useToast, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Dashboard() {
  const router = useRouter()
  const toast = useToast()
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [inputValue, setInputValue] = useState('')
  const [analysisType, setAnalysisType] = useState('all')
  const [currentFile, setCurrentFile] = useState<any>(null)
  const [currentFileKey, setCurrentFileKey] = useState<string | null>(null)
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const CLIENT_VERSION = '1.0.3' // Version tracking

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: inputValue }])
    setInputValue('')
    
    // Check if we have a current file to analyze
    if (!currentFile) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Please select a Figma file first to analyze your design.' 
      }])
      return
    }

    setIsChatLoading(true)
    
    try {
      // Extract enhanced data for better LLM understanding
      let essentialData;
      
      if (currentFile.nodes) {
        // This is a node-specific response
        const nodeData = Object.values(currentFile.nodes)[0] as any;
        const node = nodeData?.document;
        
        // Helper function to extract deeper structure
        const extractStructure = (element: any, depth: number = 0): any => {
          if (!element || depth > 3) return null;
          
          const structure: any = {
            name: element.name,
            type: element.type,
            id: element.id,
            visible: element.visible !== false,
            locked: element.locked || false,
          };
          
          // Add bounds for frames and components
          if (element.absoluteBoundingBox) {
            structure.dimensions = {
              width: Math.round(element.absoluteBoundingBox.width),
              height: Math.round(element.absoluteBoundingBox.height)
            };
          }
          
          // Add fill information
          if (element.fills && element.fills.length > 0) {
            structure.fills = element.fills.map((fill: any) => ({
              type: fill.type,
              color: fill.color,
              opacity: fill.opacity
            })).slice(0, 3);
          }
          
          // Add text content for text nodes
          if (element.type === 'TEXT' && element.characters) {
            structure.textContent = element.characters.substring(0, 100) + (element.characters.length > 100 ? '...' : '');
            structure.fontSize = element.style?.fontSize;
            structure.fontFamily = element.style?.fontFamily;
          }
          
          // Add stroke information
          if (element.strokes && element.strokes.length > 0) {
            structure.hasStrokes = true;
            structure.strokeWeight = element.strokeWeight;
          }
          
          // Add effect information (shadows, blur, etc)
          if (element.effects && element.effects.length > 0) {
            structure.effects = element.effects.map((effect: any) => effect.type);
          }
          
          // Add constraints for responsive design
          if (element.constraints) {
            structure.constraints = element.constraints;
          }
          
          // For canvas/frame nodes, extract more detail
          if ((element.type === 'FRAME' || element.type === 'CANVAS') && element.children) {
            structure.childrenCount = element.children.length;
            structure.childrenTypes = {};
            
            // Count types of children
            element.children.forEach((child: any) => {
              structure.childrenTypes[child.type] = (structure.childrenTypes[child.type] || 0) + 1;
            });
            
            // Get more children for canvases
            const childLimit = element.type === 'CANVAS' ? 10 : 5;
            structure.children = element.children.slice(0, childLimit).map((child: any) => 
              extractStructure(child, depth + 1)
            ).filter(Boolean);
          } else if (element.children && element.children.length > 0) {
            structure.childrenCount = element.children.length;
            structure.children = element.children.slice(0, 3).map((child: any) => 
              extractStructure(child, depth + 1)
            ).filter(Boolean);
          }
          
          return structure;
        };
        
        essentialData = {
          fileType: 'node',
          name: node?.name || 'Selected Node',
          type: node?.type,
          nodeId: currentNodeId,
          structure: extractStructure(node),
          componentId: node?.componentId,
          // Add context about what type of node this is
          nodeContext: node?.type === 'FRAME' ? 'screen or artboard' : 
                       node?.type === 'COMPONENT' ? 'reusable component' :
                       node?.type === 'INSTANCE' ? 'component instance' : 'design element'
        };
      } else {
        // This is a full file response
        const pages = currentFile.document?.children || [];
        
        // Use the same extraction function for pages
        const extractStructure = (element: any, depth: number = 0): any => {
          if (!element || depth > 3) return null;
          
          const structure: any = {
            name: element.name,
            type: element.type,
            id: element.id,
            visible: element.visible !== false,
            locked: element.locked || false,
          };
          
          // Add bounds for frames and components
          if (element.absoluteBoundingBox) {
            structure.dimensions = {
              width: Math.round(element.absoluteBoundingBox.width),
              height: Math.round(element.absoluteBoundingBox.height)
            };
          }
          
          // Add fill information
          if (element.fills && element.fills.length > 0) {
            structure.fills = element.fills.map((fill: any) => ({
              type: fill.type,
              color: fill.color,
              opacity: fill.opacity
            })).slice(0, 3);
          }
          
          // Add text content for text nodes
          if (element.type === 'TEXT' && element.characters) {
            structure.textContent = element.characters.substring(0, 100) + (element.characters.length > 100 ? '...' : '');
            structure.fontSize = element.style?.fontSize;
            structure.fontFamily = element.style?.fontFamily;
          }
          
          // Add stroke information
          if (element.strokes && element.strokes.length > 0) {
            structure.hasStrokes = true;
            structure.strokeWeight = element.strokeWeight;
          }
          
          // Add effect information (shadows, blur, etc)
          if (element.effects && element.effects.length > 0) {
            structure.effects = element.effects.map((effect: any) => effect.type);
          }
          
          // Add constraints for responsive design
          if (element.constraints) {
            structure.constraints = element.constraints;
          }
          
          // For canvas/frame nodes, extract more detail
          if ((element.type === 'FRAME' || element.type === 'CANVAS') && element.children) {
            structure.childrenCount = element.children.length;
            structure.childrenTypes = {};
            
            // Count types of children
            element.children.forEach((child: any) => {
              structure.childrenTypes[child.type] = (structure.childrenTypes[child.type] || 0) + 1;
            });
            
            // Get more children for canvases
            const childLimit = element.type === 'CANVAS' ? 10 : 5;
            structure.children = element.children.slice(0, childLimit).map((child: any) => 
              extractStructure(child, depth + 1)
            ).filter(Boolean);
          } else if (element.children && element.children.length > 0) {
            structure.childrenCount = element.children.length;
            structure.children = element.children.slice(0, 3).map((child: any) => 
              extractStructure(child, depth + 1)
            ).filter(Boolean);
          }
          
          return structure;
        };
        
        essentialData = {
          fileType: 'full',
          name: currentFile.name,
          lastModified: currentFile.lastModified,
          version: currentFile.version,
          // Enhanced page data with deep extraction
          pages: pages.map((page: any) => {
            const pageStructure = extractStructure(page, 0);
            
            // Add canvas-specific analysis
            const canvases = page.children?.filter((child: any) => 
              child.type === 'FRAME' || child.type === 'CANVAS'
            ) || [];
            
            return {
              ...pageStructure,
              // Canvas summary
              canvasCount: canvases.length,
              canvases: canvases.slice(0, 5).map((canvas: any) => ({
                name: canvas.name,
                id: canvas.id,
                dimensions: canvas.absoluteBoundingBox ? {
                  width: Math.round(canvas.absoluteBoundingBox.width),
                  height: Math.round(canvas.absoluteBoundingBox.height)
                } : null,
                childrenCount: canvas.children?.length || 0,
                // Detect canvas purpose based on name/size
                possiblePurpose: 
                  canvas.name.toLowerCase().includes('mobile') || (canvas.absoluteBoundingBox?.width < 500) ? 'mobile screen' :
                  canvas.name.toLowerCase().includes('tablet') || (canvas.absoluteBoundingBox?.width < 1024) ? 'tablet view' :
                  canvas.name.toLowerCase().includes('desktop') || (canvas.absoluteBoundingBox?.width >= 1024) ? 'desktop view' :
                  canvas.name.toLowerCase().includes('component') ? 'component set' :
                  'general canvas'
              }))
            };
          }),
          // Component library info
          components: Object.keys(currentFile.components || {}).slice(0, 10).map(key => ({
            name: currentFile.components[key].name,
            description: currentFile.components[key].description || ''
          })),
          componentsCount: Object.keys(currentFile.components || {}).length,
          // Style info
          styles: Object.keys(currentFile.styles || {}).slice(0, 5).map(key => ({
            name: currentFile.styles[key].name,
            type: currentFile.styles[key].styleType
          })),
          stylesCount: Object.keys(currentFile.styles || {}).length,
          // Overall file context
          fileContext: pages.length === 1 ? 'single page design' :
                       pages.length > 10 ? 'large multi-page project' :
                       'multi-page design'
        };
      }
      
      // Prepare conversation history (last 5 messages)
      const conversationHistory = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call the analyze API
      const response = await axios.post(`${API_URL}/api/analyze`, {
        prompt: inputValue,
        figmaJson: essentialData,
        analysisType: analysisType,
        conversationHistory: conversationHistory
      })

      const suggestions = response.data.suggestions
      
      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: suggestions[0]?.description || 'Analysis complete. Check the canvas for annotations.' 
      }])
      
      // TODO: Render annotations on canvas
      
    } catch (error) {
      console.error('Error analyzing design:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error analyzing your design. Please try again.' 
      }])
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>DesignAI Dashboard</title>
      </Head>

      <Flex h="100vh" overflow="hidden">
        {/* Left Panel - Chat */}
        <Box
          w={{ base: 'full', md: '25%' }}
          minW="300px"
          bg="white"
          borderRight="1px"
          borderColor="gray.200"
          display="flex"
          flexDirection="column"
        >
          {/* Chat Header */}
          <Box p={4} borderBottom="1px" borderColor="gray.200">
            <Text fontSize="lg" fontWeight="bold">Design Analysis Chat</Text>
            <Select
              mt={2}
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              size="sm"
            >
              <option value="all">All Issues</option>
              <option value="accessibility">Accessibility</option>
              <option value="layout">Layout Consistency</option>
              <option value="naming">Naming Conventions</option>
              <option value="spacing">Spacing & Alignment</option>
            </Select>
          </Box>

          {/* Messages */}
          <VStack
            flex={1}
            p={4}
            spacing={4}
            align="stretch"
            overflowY="auto"
            bg="gray.50"
          >
            {messages.length === 0 ? (
              <Text color="gray.500" textAlign="center" mt={8}>
                Start a conversation to analyze your Figma design
              </Text>
            ) : (
              messages.map((message, index) => (
                <Box
                  key={index}
                  bg={message.role === 'user' ? 'blue.500' : 'white'}
                  color={message.role === 'user' ? 'white' : 'black'}
                  p={3}
                  rounded="lg"
                  alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                  maxW="80%"
                  shadow="sm"
                >
                  <Text fontSize="sm" whiteSpace="pre-wrap">{message.content}</Text>
                </Box>
              ))
            )}
            {isChatLoading && (
              <Box
                bg="gray.100"
                p={3}
                rounded="lg"
                alignSelf="flex-start"
                maxW="80%"
                shadow="sm"
              >
                <HStack spacing={2}>
                  <Spinner size="sm" color="blue.500" />
                  <Text fontSize="sm" color="gray.600">Analyzing your design...</Text>
                </HStack>
              </Box>
            )}
          </VStack>

          {/* Input Area */}
          <Box p={4} borderTop="1px" borderColor="gray.200">
            <HStack>
              <Input
                placeholder="Ask about your design..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button colorScheme="blue" onClick={handleSendMessage}>
                Send
              </Button>
            </HStack>
          </Box>
        </Box>

        {/* Right Panel - Figma Canvas */}
        <Box
          flex={1}
          bg="gray.100"
          display="flex"
          flexDirection="column"
          position="relative"
          overflow="hidden"
        >
          {isLoading ? (
            <Flex align="center" justify="center" h="full">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : currentFileKey ? (
            // Show Figma embed when file is loaded
            <>
              <Box p={4} bg="white" borderBottom="1px" borderColor="gray.200">
                <HStack justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{currentFile?.name || 'Figma Design'}</Text>
                    <Text fontSize="sm" color="gray.600">Ready for analysis</Text>
                  </VStack>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentFile(null)
                      setCurrentFileKey(null)
                      setCurrentNodeId(null)
                    }}
                  >
                    Load Different File
                  </Button>
                </HStack>
              </Box>
              <Box flex={1} position="relative">
                <iframe
                  style={{
                    border: 'none',
                    width: '100%',
                    height: '100%',
                  }}
                  src={`https://www.figma.com/embed?embed_host=designai&url=https://www.figma.com/file/${currentFileKey}${currentNodeId ? `&node-id=${currentNodeId}` : ''}`}
                  allowFullScreen
                />
                {/* Overlay for annotations */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  pointerEvents="none"
                  zIndex={10}
                >
                  {/* Annotations would be rendered here */}
                </Box>
              </Box>
            </>
          ) : (
            // Show input when no file is loaded
            <Flex align="center" justify="center" h="full">
              <VStack spacing={4} w="full" maxW="2xl" p={8}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Analyze Figma Design
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Paste your Figma file URL below
                </Text>
                <Input
                  placeholder="https://www.figma.com/file/..."
                  size="lg"
                  onKeyPress={async (e) => {
                    if (e.key === 'Enter') {
                      const url = (e.target as HTMLInputElement).value;
                      // Updated regex to handle both old and new Figma URL formats
                      // Old: /file/abc123/Name
                      // New: /design/OgXJp6xbHBhr4SZXOP2DRqkC/Name
                      const fileKeyMatch = url.match(/figma\.com\/(file|design)\/([a-zA-Z0-9]+?)(?:\/|\?)/i);
                      const nodeIdMatch = url.match(/node-id=([0-9-]+)/);
                      
                      if (!fileKeyMatch) {
                        toast({
                          title: 'Invalid URL',
                          description: 'Please enter a valid Figma file URL',
                          status: 'error',
                          duration: 3000,
                        });
                        return;
                      }
                      
                      const fileKey = fileKeyMatch[2];
                      const nodeId = nodeIdMatch ? nodeIdMatch[1] : null;
                      setIsLoading(true);
                      
                      try {
                        const url = nodeId 
                          ? `${API_URL}/api/figma/files/${fileKey}?nodeId=${nodeId}`
                          : `${API_URL}/api/figma/files/${fileKey}`;
                        
                        const response = await axios.get(url);
                        setCurrentFile(response.data);
                        setCurrentFileKey(fileKey);
                        setCurrentNodeId(nodeId);
                        
                        toast({
                          title: 'File loaded',
                          description: nodeId ? 'Specific node loaded for analysis' : 'Your Figma file is ready for analysis',
                          status: 'success',
                          duration: 3000,
                        });
} catch (error: any) {
                        console.error('Error loading file:', error);
const errMsg = error.response?.data?.error || error.response?.data?.details || error.message;
                        console.error('Error loading file details:', errMsg);
                        toast({
                          title: 'Error loading file',
                          description: errMsg,
                          status: 'error',
                          duration: 5000,
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }
                  }}
                />
                <Text fontSize="xs" color="gray.500">
                  Press Enter to load the file
                </Text>
              </VStack>
            </Flex>
          )}

          {/* Placeholder for annotations overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            pointerEvents="none"
          >
            {/* Annotations would be rendered here */}
          </Box>
        </Box>
      </Flex>
      
      {/* Version footer */}
      <Box 
        position="fixed" 
        bottom={2} 
        right={2} 
        bg="gray.800" 
        color="white" 
        px={3} 
        py={1} 
        borderRadius="md"
        fontSize="xs"
        zIndex={1000}
      >
        Client v{CLIENT_VERSION}
      </Box>
    </>
  )
}
