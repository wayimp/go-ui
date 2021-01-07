import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#002868', // american flag blue
    },
    secondary: {
      main: '#BF0A30', // american flag red
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