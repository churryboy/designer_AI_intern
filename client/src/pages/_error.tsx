import { NextPageContext } from 'next'
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  const router = useRouter()

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <VStack spacing={6} textAlign="center" p={8}>
        <Heading size="2xl" color="gray.700">
          {statusCode ? `Error ${statusCode}` : 'Client Error'}
        </Heading>
        <Text fontSize="lg" color="gray.600">
          {statusCode
            ? `A ${statusCode} error occurred on the server`
            : 'An error occurred on the client'}
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => router.push('/')}
          size="lg"
        >
          Go Home
        </Button>
      </VStack>
    </Box>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
