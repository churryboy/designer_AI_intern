import { Box, Flex, Heading, Text, Button, VStack, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    // For now, just redirect to a placeholder dashboard
    router.push('/dashboard')
  }

  return (
    <>
      <Head>
        <title>DesignAI - AI-Powered Figma Design Assistant</title>
        <meta name="description" content="Chat with AI to diagnose and improve your Figma designs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box minH="100vh" bg="gray.50">
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          px={8}
          py={4}
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
        >
          <Heading size="lg" color="blue.600">
            DesignAI
          </Heading>
          <HStack spacing={4}>
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button colorScheme="blue">Sign In</Button>
          </HStack>
        </Flex>

        {/* Hero Section */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="calc(100vh - 80px)"
          px={8}
          py={16}
        >
          <VStack spacing={8} maxW="3xl" textAlign="center">
            <Heading as="h1" size="3xl" fontWeight="bold">
              AI-Powered Design Diagnosis for Figma
            </Heading>
            
            <Text fontSize="xl" color="gray.600">
              Chat with Claude AI to analyze your designs, get accessibility insights,
              and receive automated fixes for common design issues.
            </Text>

            <VStack spacing={4} align="center">
              <Button
                size="lg"
                colorScheme="blue"
                onClick={handleGetStarted}
                px={8}
                py={6}
                fontSize="lg"
              >
                Get Started Free
              </Button>
              <Text fontSize="sm" color="gray.500">
                No credit card required • Free trial available
              </Text>
            </VStack>

            {/* Feature Grid */}
            <Flex
              mt={16}
              gap={8}
              wrap="wrap"
              justify="center"
              w="full"
            >
              <FeatureCard
                title="🤖 AI Analysis"
                description="Claude Opus 4 analyzes your designs for issues and improvements"
              />
              <FeatureCard
                title="🎨 Visual Feedback"
                description="See annotations directly on your Figma canvas"
              />
              <FeatureCard
                title="🔧 Auto-Fix"
                description="Accept AI suggestions to automatically fix design issues"
              />
              <FeatureCard
                title="♿ Accessibility"
                description="Ensure your designs meet accessibility standards"
              />
            </Flex>
          </VStack>
        </Flex>
      </Box>
    </>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Box
      bg="white"
      p={6}
      rounded="lg"
      shadow="md"
      maxW="xs"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {title}
      </Text>
      <Text color="gray.600">{description}</Text>
    </Box>
  )
}
