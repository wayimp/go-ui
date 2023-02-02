import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { axiosClient } from '../src/axiosClient'
import { useSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TabPanel from '../components/TabPanel'
import Subscriptions from '../components/Subscriptions'
import Donations from '../components/Donations'
import BlockFirst from '../components/BlockFirst'
import BlockListJoined from '../components/BlockListJoined'
import BlockListSegmented from '../components/BlockListSegmented'
import numeral from 'numeral'
const priceFormat = '$0'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMM DD hh:mm a'
import ProductCard from '../components/ProductCardPublic'
import Container from '@material-ui/core/Container'
import Badge from '@material-ui/core/Badge'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import SearchIcon from '@material-ui/icons/Search'
import Tooltip from '@material-ui/core/Tooltip'
import Checkbox from '@material-ui/core/Checkbox'
import WarningIcon from '@material-ui/icons/Warning'
import { red } from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress'
import SendIcon from '@material-ui/icons/Send'
import QuestionIcon from '@material-ui/icons/QuestionAnswer';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import Fab from '@material-ui/core/Fab'
import CallIcon from '@material-ui/icons/Call'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import parse from 'html-react-parser'
import { loadStripe } from '@stripe/stripe-js'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import EmailIcon from '@material-ui/icons/Email'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import Toolbar from '@material-ui/core/Toolbar'

Array.prototype.sum = function (prop) {
  var total = 0
  for (var i = 0, _len = this.length; i < _len; i++) {
    if (this[i] && this[i][prop]) {
      total += this[i][prop]
    }
  }
  return total
}

const selectStyles = {
  menu: base => ({
    ...base,
    zIndex: 100
  })
}

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    marginTop: theme.spacing(18),
    // necessary for content to be below app bar (doesn't work)
    ...theme.mixins.toolbar
  },
  bottomNav: {
    position: 'fixed',
    bottom: '0px',
    left: '0px',
    right: '0px',
    width: '100%',
    minHeight: '82px',
    color: 'lightgrey',
    backgroundColor: '#2B4168'
  },
  formGroup: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fafafa',
    border: '1px solid #ccc'
  },
  formGroupTop: {
    margin: 20,
    padding: 20
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexGrow: 1,
    paddingRight: theme.spacing(5)
  },
  root: {
    padding: 0,
    flexGrow: 1
  },
  center: {
    textAlign: 'center',
    flexGrow: 1
  },
  mainlogo: {
    display: 'block',
    width: '80%',
    paddingLeft: '10%',
    paddingTop: '16%',
    paddingRight: '10%',
    paddingBottom: '2%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  footerlogo: {
    marginTop: '40px',
    display: 'block',
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  lines: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexGrow: 1,
    borderTop: '1px solid #ccc',
    borderLeft: '1px solid #ccc',
    borderRight: '1px solid #ccc',
    '&:last-child': {
      formBottom: '1px solid #ccc'
    }
  },
  nolines: {
    formBottom: '2px solid white'
  },
  flexGrid: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  },
  textField: {
    margin: theme.spacing(1),
    padding: 2
  },
  textFieldWide: {
    width: '100%',
    margin: theme.spacing(1),
    padding: 2,
    minWidth: 400
  },
  checkbox: {
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    padding: 6
  },
  iconButton: {
    margin: -2,
    padding: -2
  },
  tabPanel: {
    border: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  frontPanel: {
    margin: 0,
    flexGrow: 1,
    background: "url('https://files.lifereferencemanual.net/go/gobanner.jpg')"
  },
  img: {
    border: 1,
    margin: 5
  },
  gridListRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    height: 550,
    flexWrap: 'nowrap',
    transform: 'translateZ(0)'
  },
  titleBar: {
    background:
      'linear-gradient(to right, rgba(0,0,0,0.7) 0%, ' + 'rgba(0,0,0,0) 20%)'
  },
  icon: {
    color: 'white'
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  fab1: {
    margin: 0,
    bottom: 'auto',
    right: theme.spacing(2),
    top: theme.spacing(11),
    left: 'auto',
    position: 'fixed',
    alignItems: 'left'
  },
  fab2: {
    margin: 0,
    bottom: 'auto',
    right: theme.spacing(2),
    top: theme.spacing(2),
    left: 'auto',
    position: 'fixed',
    alignItems: 'left'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
    padding: theme.spacing(2)
  },
  modalScroll: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    overflow: 'scroll',
    height: '100%',
    display: 'block'
  },
  modalDonate: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 480,
    borderRadius: 16,
    backgroundColor: theme.palette.background.paper,
    padding: 30
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  barLogo: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  menuButton: {
    zIndex: 1101,
    margin: 0,
    top: 16,
    left: 10,
    right: 'auto',
    bottom: 'auto',
    position: 'fixed',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  drawerPaper: {
    width: drawerWidth
  }
}))

const drawerWidth = 240

const Form = ({ products, blocks, settings, dispatch, token, defaultTab }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [leavingPage, setLeavingPage] = React.useState(false)
  const [form, setForm] = React.useState({ cart: {}, newsletter: true })
  const { enqueueSnackbar } = useSnackbar()
  const [selectedTab, setSelectedTab] = React.useState(defaultTab)
  const [readOnly, setReadOnly] = React.useState(false)
  const [filtered, setFiltered] = React.useState(products)
  const [search, setSearch] = React.useState('')
  const [progress, setProgress] = React.useState(false)
  const [showPrivacy, setShowPrivacy] = React.useState(false)
  const [showDonate, setShowDonate] = React.useState(false)
  const [addFee, setAddFee] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  useEffect(() => {
    document.body.className = selectedTab == 0 ? 'front' : '';
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {['About', 'Products', 'Cart', 'Donate', 'Testimonies', 'FAQs'].map(
          (text, index) => (
            <ListItem
              button
              key={text}
              onClick={() => {
                setSelectedTab(index)
                setMobileOpen(false)
              }}
            >
              <ListItemText primary={text} />
            </ListItem>
          )
        )}
      </List>
    </div>
  )
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    setProgress(false)
  })

  const searchProducts = event => {
    const searchString = event.target.value
    setSearch(searchString)
    filterProducts(searchString)
  }

  const filterProducts = searchString => {
    if (searchString && searchString.length > 0) {
      let productsSorted = products
        .map(product => {
          if (product.title.toLowerCase().includes(searchString.toLowerCase()))
            return product
          else return null
        })
        .filter(noNull => noNull)
      setFiltered(productsSorted)
    } else {
      setFiltered(products)
    }
  }

  const changeValue = async (name, value) => {
    const updated = {
      ...form,
      [name]: value
    }
    setForm(updated)
  }

  const changeField = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    changeValue(fieldName, fieldValue)
  }

  const changeCheckbox = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.checked
    changeValue(fieldName, fieldValue)
  }

  const blurField = event => { }

  const changeAddFee = event => {
    let updateDonation = Number(0 + form.donation)
    if (addFee) {
      updateDonation = Number((updateDonation - 0.3) / 1.022).toFixed(2)
      setAddFee(false)
    } else {
      updateDonation = Number(updateDonation * 1.022 + 0.3).toFixed(2)
      setAddFee(true)
    }

    const updated = {
      ...form,
      donation: updateDonation
    }
    setForm(updated)
  }

  const addToCart = (product, quantity) => {
    let { cart } = form

    if (cart[product._id]) {
      cart[product._id].quantity += quantity
    } else {
      cart[product._id] = {
        title: product.title,
        image: product.image,
        qbId: product.qbId,
        qbName: product.qbName,
        quantity
      }
    }

    if (cart[product._id].quantity <= 0) {
      delete cart[product._id]
    }

    const updated = {
      ...form,
      cart
    }
    setForm(updated)
  }

  const formIsValid = () => {
    let valid = true
    if (!form.customerName || form.customerName.length === 0) {
      valid = false
      enqueueSnackbar('Name is required', {
        variant: 'error'
      })
    }
    if (!form.customerStreet || form.customerStreet.length === 0) {
      valid = false
      enqueueSnackbar('Street is required', {
        variant: 'error'
      })
    }
    if (!form.customerCity || form.customerCity.length === 0) {
      valid = false
      enqueueSnackbar('City is required', {
        variant: 'error'
      })
    }

    if (!form.customerState || form.customerState.length === 0) {
      valid = false
      enqueueSnackbar('State is required', {
        variant: 'error'
      })
    }

    if (!form.customerZip || form.customerZip.length === 0) {
      valid = false
      enqueueSnackbar('Zip is required', {
        variant: 'error'
      })
    }

    if (!form.customerPhone || form.customerPhone.length === 0) {
      valid = false
      enqueueSnackbar('Phone is required', {
        variant: 'error'
      })
    }

    if (!form.customerEmail || form.customerEmail.length === 0) {
      valid = false
      enqueueSnackbar('Email is required', {
        variant: 'error'
      })
    }
    if (!form.donation || form.donation.length === 0) {
      valid = false
      enqueueSnackbar(
        'Please indicate a donation amount, or enter zero for none',
        {
          variant: 'error'
        }
      )
    }
    if (!form.cart || Object.keys(form.cart).length === 0) {
      valid = false
      enqueueSnackbar('There is nothing in the order', {
        variant: 'error'
      })
    }
    return valid
  }

  const handleSignup = async () => {
    await axiosClient
      .post('/newsletter', form)
      .then(res => {
        enqueueSnackbar('You have been signed up', {
          variant: 'success'
        })
      })
      .catch(err => {
        enqueueSnackbar('There was a problem signing up' + err, {
          variant: 'error'
        })
      })
  }

  const handleStory = async () => {
    await axiosClient
      .post('/stories', form)
      .then(res => {
        enqueueSnackbar('Your testimony has been submitted.', {
          variant: 'success'
        })
      })
      .catch(err => {
        enqueueSnackbar('There was a problem submitting your testimony ' + err, {
          variant: 'error'
        })
      })
  }

  const requestShipment = async () => {
    const isValid = formIsValid()
    if (isValid) {
      if (form.donation > 0) {
        handleSubmit();
      }
      else {
        setShowDonate(true)
      }
    }
  }

  const handleSubmit = async () => {
    setProgress(true)
    setLeavingPage(true)
    await axiosClient
      .post('/orders', form)
      .then(res => {
        dispatch({ type: 'FORM_CLEAR', payload: '' })
        enqueueSnackbar('Your order has been submitted', {
          variant: 'success'
        })
        setForm({ cart: {} })
        setProgress(false)
        if (form.donation > 0) {
          createDonation(
            form.donation,
            res.data.ops[0]._id,
            form.customerEmail
          )
        } else {
          Router.push('/order/' + res.data.ops[0]._id)
        }
      })
      .catch(err => {
        setProgress(false)
        enqueueSnackbar('There was a problem submitting the order' + err, {
          variant: 'error'
        })
      })
  }

  const createDonation = async (price, orderId, email) => {
    const intPrice = parseInt(Math.floor(price * 100))
    await axiosClient({
      method: 'post',
      url: '/donation',
      data: { amount: intPrice, orderId, email }
    })
      .then(response => {
        stripe.redirectToCheckout({
          sessionId: response.data.sessionId
        })
      })
      .catch(error => {
        enqueueSnackbar('Error with Donation ' + error, {
          variant: 'error'
        })
        console.log(error)
      })
  }

  // Calculate current cases
  let chips = []
  let cartDisplay = []
  let quantity = 0
  let cases = 0
  let items = 0
  let quantitySP = 0
  let casesSP = 0
  let itemsSP = 0
  let keyIndex = 0
  Object.entries(form.cart).map(([k, v], i) => {
    if (v && v.quantity) {
      if (v.title.includes('Vida')) {
        quantitySP += v.quantity
      }
      else {
        quantity += v.quantity
      }
    }
  })
  const modulo = quantity % 48
  cases = Math.floor(quantity / 48)
  items = quantity % 48
  for (let c = 0; c < cases; c++) {
    chips.push(<Chip key={keyIndex++} variant='outlined' label='48' color='secondary' />)
  }
  if (items > 0) {
    if (cases > 1) {
      chips.push(
        <Chip
          key={keyIndex++}
          variant='outlined'
          label={items}
          color='error'
          style={{ backgroundColor: red[500] }}
        />
      )
    } else {
      chips.push(<Chip key={keyIndex++} variant='outlined' color='secondary' label={items} />)
    }
  }
  const moduloSP = quantitySP % 44
  casesSP = Math.floor(quantitySP / 44)
  itemsSP = quantitySP % 44
  for (let c = 0; c < casesSP; c++) {
    chips.push(<Chip key={keyIndex++} variant='outlined' color='secondary' label='44' />)
  }
  if (itemsSP > 0) {
    if (casesSP > 1) {
      chips.push(
        <Chip
          key={keyIndex++}
          variant='outlined' color='error'
          label={itemsSP}
          style={{ backgroundColor: red[500] }}
        />
      )
    } else {
      chips.push(<Chip key={keyIndex++} variant='outlined' color='secondary' label={itemsSP} />)
    }
  }
  if (chips.length > 0) {
    if (selectedTab !== 2) {
      cartDisplay.push(
        <Fab
          id='fab1'
          key='fab1'
          className={classes.fab1}
          variant='extended'
          color='secondary'
        >
          Confirm Order&nbsp;&nbsp;
          <Badge badgeContent={quantity + quantitySP} color='error'>
            <ShoppingCartIcon fontSize='large' style={{ marginTop: 4 }} />&nbsp;&nbsp;&nbsp;&nbsp;
          </Badge>
        </Fab>
      )
      cartDisplay.push(
        <Fab
          id='fab2'
          key='fab2'
          className={classes.fab2}
          variant='extended'
          color='secondary'
        >
          <Badge badgeContent={quantity + quantitySP} color='error'>
            <Typography style={{ marginTop: 7 }}>
              Suggested Donation:&nbsp;
              {numeral((quantity + quantitySP) * 4).format(priceFormat)}&nbsp;($4 per Bible)
            </Typography>
          </Badge>
        </Fab>
      )
    }
    cartDisplay.push(<Grid>{chips}</Grid>)

    if (items > 0 && cases > 0) {
      cartDisplay.push(<br />)
      cartDisplay.push(
        <Typography style={{ color: red[500] }}>
          <WarningIcon style={{ color: red[500] }} />
          Please order an even number of boxes (multiples of 48)
        </Typography>
      )
    }
  }

  return (
    <Container className={classes.root}>
      <AppBar position='fixed'>
        <Grid
          container
          direction="row"
        >
          <Grid item xs={2}>
            <img
              className={classes.barLogo}
              src='https://files.lifereferencemanual.net/go/barlogo.png'
              onClick={() => setSelectedTab(0)}
              style={{ maxHeight: 50, margin: 10, paddingLeft: 20, cursor: 'pointer' }}
            />
          </Grid>
          <Grid container item xs={10} justifyContent="left"
            alignItems="center">
            <Tabs
              value={selectedTab}
              onChange={(event, newValue) => {
                setSelectedTab(newValue)
              }}
              indicatorColor='secondary'
              scrollButtons='auto'
              fullWidth={true}
              centered={true}
            >
              <Tab label='About' value={0} />
              <Tab label='Products' value={1} />
              <Tab label='Cart' value={2} />
              <Tab label='Donate' value={3} />
              <Tab label='Testimonies' value={4} />
              <Tab label='FAQs' value={5} />
            </Tabs>
          </Grid>
        </Grid>
        <Grid className={classes.chips} onClick={() => setSelectedTab(2)}>
          {cartDisplay}
        </Grid>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <Box width={1} className={classes.toolbar}>
        <Fab onClick={handleDrawerToggle} className={classes.menuButton}>
          <MenuIcon />
        </Fab>
        <TabPanel value={selectedTab} index={0} className={classes.tabPanel}>
          <div style={{ marginTop: '25%' }}>
            <img
              src={'https://files.lifereferencemanual.net/go/mainlogo.png'}
              className={classes.mainlogo}
            />
            <BlockListJoined blocks={blocks} category='frontPage' />
          </div>
          <div style={{ margin: 'auto', width: '100%' }}>
            <div style={{ marginTop: 20, marginBottom: 10 }}>
              <Divider />
            </div>
            <span className={'front-header'}>Frequently Asked Questions</span><br />
            <BlockFirst blocks={blocks} category='faq' />
            <Button
              variant='contained'
              color='primary'
              style={{ margin: 20 }}
              onClick={() => setSelectedTab(5)}
              startIcon={<QuestionIcon />}
            >
              More FAQs
            </Button>
            <br />
            <span className={'front-header'}>Have any other questions?</span><br />
            <span className={'front-text'}>Give us a call at (615) 773-1963 or send us an email at gothereforeministries@gmail.com</span>
            <div style={{ marginTop: 20, marginBottom: 10 }}>
              <Divider />
            </div>
            <span className={'front-header'}>Our Partners</span><br />
            <span className={'front-text'}>We're deeply thankful for our committed partners who have distributed hundreds of thousands of Life Reference Manuals over the past few decades.</span>
          </div>
          <Container style={{ maxWidth: '80vw', overflowX: 'scroll', overflowY: 'hidden' }}>
            <List style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
              <ListItem>
                <img
                  style={{ maxHeight: 100 }}
                  src={`/partners/compassion-logo-sm.png`}
                  loading="lazy"
                />
              </ListItem>
              <ListItem>
                <img
                  style={{ maxHeight: 100 }}
                  src={`/partners/crowes-logo-sm.png`}
                  loading="lazy"
                />
              </ListItem>
              <ListItem>
                <img
                  style={{ maxHeight: 100 }}
                  src={`/partners/flashpoint-logo-sm.png`}
                  loading="lazy"
                />
              </ListItem>
              <ListItem>
                <img
                  style={{ maxHeight: 100 }}
                  src={`/partners/kickingbear-logo-sm.png`}
                  loading="lazy"
                />
              </ListItem>
              <ListItem>
                <img
                  style={{ maxHeight: 100 }}
                  src={`/partners/maf-logo-sm.png`}
                  loading="lazy"
                />
              </ListItem>
              <ListItem>
                <img
                  style={{ maxHeight: 100 }}
                  src={`/partners/mario-murillo-logo-sm.png`}
                  loading="lazy"
                />
              </ListItem>
              <ListItem>
                <img
                  style={{ maxHeight: 100 }}
                  src={`/partners/mercy-logo-sm.png`}
                  loading="lazy"
                />
              </ListItem>
              <ListItem>
                <img
                  style={{ maxHeight: 100 }}
                  src={`/partners/raceway-logo-sm.png`}
                  loading="lazy"
                />
              </ListItem>
            </List>
          </Container>
          <img
            src={'https://files.lifereferencemanual.net/go/mainlogo.png'}
            className={classes.footerlogo}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={1} className={classes.tabPanel}>
          <div style={{ textAlign: 'center', marginTop: -10, marginBottom: 10 }}>
            <Typography variant="h1" component="h1" color="secondary" style={{ fontSize: '3rem', fontFamily: 'Georgia' }}>
              Products
            </Typography>
            <hr style={{ height: '3px', backgroundColor: 'navy', }} />
          </div>
          <FormControl variant='outlined'>
            <InputLabel>Search</InputLabel>
            <OutlinedInput
              id='search'
              value={search}
              onChange={searchProducts}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <Grid
            container
            direction='row'
            justify='flex-start'
            alignItems='flex-start'
            alignContent='flex-start'
          >
            {filtered.map(product => (
              <Grid item lg={3} md={4} sm={5} xs={12} key={product._id}>
                <ProductCard
                  key={product._id}
                  product={product}
                  addToCart={addToCart}
                  inCart={form.cart[product._id]}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={selectedTab} index={2} className={classes.tabPanel}>
          {progress ? (
            <CircularProgress />
          ) : (
            <>
              <div style={{ paddingLeft: '40px', textAlign: 'center', marginTop: -10, marginBottom: 10 }}>
                <Typography variant="h1" component="h1" color="secondary" style={{ fontSize: '3rem', fontFamily: 'Georgia' }}>
                  Order Life Reference Manuals
                </Typography>
                <hr style={{ height: '3px', backgroundColor: 'navy', }} />
              </div>
              <Grid
                container
                direction='row'
                spacing={2}
                justify='space-between'
                className={classes.formGroup}
              >
                <Grid item>
                  <TextField
                    required
                    className={classes.textField}
                    variant='outlined'
                    name='customerName'
                    label='Name'
                    defaultValue={form.customerName ? form.customerName : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                    error={form.customerName ? false : true}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    className={classes.textField}
                    variant='outlined'
                    name='customerStreet'
                    label='Street Address'
                    defaultValue={
                      form.customerStreet ? form.customerStreet : ''
                    }
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                    error={form.customerStreet ? false : true}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    className={classes.textField}
                    variant='outlined'
                    name='customerCity'
                    label='City'
                    defaultValue={form.customerCity ? form.customerCity : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                    error={form.customerCity ? false : true}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='customerState'
                    label='State'
                    defaultValue={form.customerState ? form.customerState : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                    error={form.customerState ? false : true}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    className={classes.textField}
                    variant='outlined'
                    name='customerZip'
                    label='Zip'
                    defaultValue={form.customerZip ? form.customerZip : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                    error={form.customerZip ? false : true}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    className={classes.textField}
                    variant='outlined'
                    name='customerPhone'
                    label='Phone'
                    defaultValue={form.customerPhone ? form.customerPhone : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                    error={form.customerPhone ? false : true}
                  />
                </Grid>
                <Grid item>
                  <FormControl>
                    <TextField
                      required
                      className={classes.textField}
                      variant='outlined'
                      name='customerEmail'
                      label='Email'
                      defaultValue={
                        form.customerEmail ? form.customerEmail : ''
                      }
                      onChange={changeField}
                      onBlur={blurField}
                      disabled={readOnly}
                      error={form.customerEmail ? false : true}
                    />
                  </FormControl>
                </Grid>

                <Grid item>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='referral'
                    label='How did you find us?'
                    defaultValue={form.referral ? form.referral : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='customerCompany'
                    label='Company/Ministry Name'
                    defaultValue={
                      form.customerCompany ? form.customerCompany : ''
                    }
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='instructions'
                    label='Leave us a note'
                    defaultValue={form.instructions ? form.instructions : ''}
                    multiline={true}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                direction='row'
                spacing={2}
                justify='space-between'
                className={classes.formGroup}
              >
                <Grid item>
                  <FormControl>
                    <InputLabel htmlFor='donation'>
                      Donation Amount (enter 0 for none)
                    </InputLabel>
                    <Input
                      required
                      error={form.donation ? false : true}
                      id='donation'
                      className={classes.textField}
                      variant='outlined'
                      name='donation'
                      label='Donation Amount'
                      value={form.donation ? form.donation : ''}
                      onChange={changeField}
                      onBlur={blurField}
                      disabled={readOnly}
                      type='number'
                      startAdornment={
                        <InputAdornment position='start'>$</InputAdornment>
                      }
                    />
                    <FormHelperText>
                      Your donation helps us to distribute more Bibles
                      <br />
                      Suggested donation:&nbsp;
                      {numeral((quantity + quantitySP) * 4).format(priceFormat)}&nbsp;($4 per
                      Bible)
                    </FormHelperText>
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        className={classes.checkbox}
                        checked={addFee}
                        onChange={changeAddFee}
                        name='transactionFee'
                        color='secondary'
                      />
                    }
                    label='Cover Transaction Fee'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        className={classes.checkbox}
                        checked={form.newsletter}
                        onChange={changeCheckbox}
                        name='newsletter'
                        color='secondary'
                      />
                    }
                    label='Receive Occasional Newsletter'
                  />
                </Grid>

                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ margin: 20 }}
                    onClick={requestShipment}
                    startIcon={<SendIcon />}
                    disabled={leavingPage}
                  >
                    Request Shipment
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                direction='row'
                justifyContent='flex-start'
                alignItems='flex-start'
                alignContent='flex-start'
              >
                {form.cart && Object.keys(form.cart).length === 0 ?
                  <Typography style={{ marginLeft: 30, color: red[500] }}>
                    <WarningIcon style={{ color: red[500] }} />&nbsp;Your Cart is Empty
                  </Typography>
                  :
                  filtered
                    .filter(product =>
                      Object.keys(form.cart).includes(product._id)
                    )
                    .map(product => (
                      <Grid item lg={3} md={4} sm={5} xs={12}>
                        <ProductCard
                          key={product._id}
                          product={product}
                          addToCart={addToCart}
                          inCart={form.cart[product._id]}
                        />
                      </Grid>
                    ))}
              </Grid>
            </>
          )}
        </TabPanel>
        <TabPanel value={selectedTab} index={3} className={classes.tabPanel}>
          <div style={{ textAlign: 'center', marginTop: -10, marginBottom: 20 }}>
            <Typography variant="h1" component="h1" color="secondary" style={{ fontSize: '3rem', fontFamily: 'Georgia' }}>
              Partner with Go Therefore
            </Typography>
            <hr style={{ height: '3px', backgroundColor: 'navy', }} />
            <Typography variant="h6" component="h6" color="secondary" style={{ fontFamily: 'Georgia' }}>
              Your donations help to place the Word of God with precious souls,<br />
              Please consider partnering with us to further this meaningful work.<br />
              All donations go towards helping to cover our costs, such as printing, packing, shipping, etc..
            </Typography>
          </div>
          <Subscriptions />
          <Donations />
        </TabPanel>
        <TabPanel value={selectedTab} index={4} className={classes.tabPanel}>
          <div style={{ textAlign: 'center', marginTop: -10, marginBottom: 10 }}>
            <Typography variant="h1" component="h1" color="secondary" style={{ fontSize: '3rem', fontFamily: 'Georgia' }}>
              Partner Testimonies
            </Typography>
            <hr style={{ height: '3px', backgroundColor: 'navy', }} />
          </div>
          <Card style={{ marginLeft: '10%' }}>
            <CardContent>
              <Box width={1}>
                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='customerName'
                  label='Name'
                  defaultValue={form.customerName ? form.customerName : ''}
                  onChange={changeField}
                  onBlur={blurField}
                  disabled={readOnly}
                />
                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='customerEmail'
                  label='Email'
                  defaultValue={form.customerEmail ? form.customerEmail : ''}
                  onChange={changeField}
                  onBlur={blurField}
                  disabled={readOnly}
                />
                <Button
                  variant='contained'
                  color='primary'
                  style={{ margin: 20 }}
                  onClick={handleSignup}
                  startIcon={<SendIcon />}
                  disabled={leavingPage}
                >
                  Newsletter Sign Up
                </Button>
              </Box>
            </CardContent>
          </Card>

          <BlockListSegmented blocks={blocks} category='stories' />

          <Card style={{ marginLeft: '10%' }}>
            <CardContent>
              <Box width={1}>
                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='customerEmail'
                  label='Email'
                  defaultValue={form.customerEmail ? form.customerEmail : ''}
                  onChange={changeField}
                  onBlur={blurField}
                  disabled={readOnly}
                />

                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='customerName'
                  label='Name'
                  defaultValue={form.customerName ? form.customerName : ''}
                  onChange={changeField}
                  onBlur={blurField}
                  disabled={readOnly}
                />

                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='location'
                  label='Location'
                  defaultValue={form.location ? form.location : ''}
                  onChange={changeField}
                  onBlur={blurField}
                  disabled={readOnly}
                />

                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='story'
                  label='Story'
                  defaultValue={form.story ? form.story : ''}
                  onChange={changeField}
                  onBlur={blurField}
                  disabled={readOnly}
                />

                <Button
                  variant='contained'
                  color='primary'
                  style={{ margin: 20 }}
                  onClick={handleStory}
                  startIcon={<SendIcon />}
                  disabled={leavingPage}
                >
                  Submit Testimony
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value={selectedTab} index={5} className={classes.tabPanel}>
          <div style={{ textAlign: 'center', marginTop: -10, marginBottom: 10 }}>
            <Typography variant="h1" component="h1" color="secondary" style={{ fontSize: '3rem', fontFamily: 'Georgia' }}>
              Frequently Asked Questions
            </Typography>
            <hr style={{ height: '3px', backgroundColor: 'navy', }} />
          </div>
          <BlockListJoined blocks={blocks} category='faq' />
        </TabPanel>
      </Box>
      <Modal
        id='items'
        className={classes.modalScroll}
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={showPrivacy}>
          <div className={classes.paper} onClick={() => setShowPrivacy(false)}>
            {parse(settings.privacy_policy)}
          </div>
        </Fade>
      </Modal>
      <Modal
        id='donate'
        open={showDonate}
        onClose={() => setShowDonate(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={showDonate}>
          <Box >
            <div className={classes.modalDonate} onClick={() => setShowDonate(false)}>
              <div style={{ paddingLeft: '20px', paddingTop: '10px', textAlign: 'center', marginTop: -10, marginBottom: 10 }}>
                <Typography variant="h1" component="h1" color="secondary" style={{ fontSize: '2rem', fontFamily: 'Georgia' }}>
                  Become a Partner Today!
                </Typography>
                <hr style={{ height: '3px', backgroundColor: 'navy' }} />
              </div>
              <div style={{ textAlign: 'center', paddingTop:'10px', paddingLeft: '30px', paddingRight: '30px' }}>
                <p>Go Therefore Ministries relies on the generous donations of our partners to produce and distribute the Life Reference Manual.</p>
                <p>Would you consider partnering with us in the form of a donation to help us continue fulfilling the Great Commission?</p>
                <p>All donations go directly to the printing, packing, and distribution of more Bibles to more people!</p>
              </div>
              <Box width={1}>
                <Button
                  variant='contained'
                  color='secondary'
                  style={{ margin: 20 }}
                  onClick={() => setShowDonate(false)}
                  startIcon={<AttachMoneyIcon />}
                >
                  Make a Donation
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  style={{ margin: 20 }}
                  onClick={handleSubmit}
                >
                  Not at this time
                </Button>
              </Box>
              <div style={{ marginLeft: '-30px', marginRight: '-30px', marginBottom: '-30px', marginTop: '10px', textAlign: 'center', backgroundColor: '#2B4168', borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px' }}>
                <img
                  src='https://files.lifereferencemanual.net/go/barlogo.png'
                  style={{ maxHeight: 60, padding: 10 }}
                />
              </div>
            </div>

          </Box>
        </Fade>
      </Modal>
      <BottomNavigation position='sticky' className={classes.bottomNav}>
        <Grid>
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => {
              setSelectedTab(newValue)
            }}
            indicatorColor='secondary'
            scrollButtons='auto'
            fullWidth={true}
            variant='scrollable'
          >
            <Tab label='About' value={0} />
            <Tab label='Products' value={1} />
            <Tab label='Cart' value={2} />
            <Tab label='Donate' value={3} />
            <Tab label='Testimonies' value={4} />
            <Tab label='FAQs' value={5} />
          </Tabs>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <EmailIcon color='secondary'
              style={{ marginTop: '0px', marginLeft: '3px', marginRight: '3px', marginBottom: '0px' }}
            />
            {settings.business_email}
            <CallIcon
              color='secondary'
              style={{ marginTop: '0px', marginLeft: '3px', marginRight: '3px', marginBottom: '0px' }}
            />
            {settings.business_phone}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <MenuBookIcon
              onClick={() => setShowPrivacy(!showPrivacy)}
              color='secondary'
              style={{ marginTop: '0px', marginLeft: '3px', marginRight: '3px', marginBottom: '0px' }}
            />
            Privacy Policy
            <MailOutlineIcon
              color='secondary'
              style={{ marginTop: '0px', marginLeft: '6px', marginRight: '3px', marginBottom: '0px' }}
            />
            {settings.business_address}
          </Grid>
        </Grid>
      </BottomNavigation>
      <p>&nbsp;</p><p>&nbsp;</p>
    </Container>
  )
}

export async function getServerSideProps(context) {
  let defaultTab = 0
  if (context.query) {
    const { t } = context.query
    if (t) {
      defaultTab = Number(t)
    }
  }
  const products = await axiosClient
    .get('/products')
    .then(response => response.data)
  const blocks = await axiosClient
    .get('/blocks')
    .then(response => response.data)
  const settings = {}
  const settingsArray = await axiosClient
    .get('/settingsPublic')
    .then(response => response.data)
  settingsArray.map(setting => {
    settings[setting.name] = setting.value
  })

  return {
    props: {
      products,
      blocks,
      settings,
      defaultTab
    }
  }
}

export default connect(state => state)(Form)
