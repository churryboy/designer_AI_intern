import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F2FF',
      100: '#BAD9FF',
      200: '#8DC0FF',
      300: '#60A7FF',
      400: '#338EFF',
      500: '#0675FF',
      600: '#0560CC',
      700: '#044A99',
      800: '#033566',
      900: '#021F33',
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})
