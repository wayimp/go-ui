import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  typography: {
    "fontFamily": `"Calibri", "Open Sans", sans-serif`,
    "fontSize": 'medium',
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  },
  palette: {
    primary: {
      main: '#2B4168'
    },
    secondary: {
      main: '#736441'
    },
    action: {
      main: '#FFFFFF',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;