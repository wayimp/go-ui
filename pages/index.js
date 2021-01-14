import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { axiosClient } from '../src/axiosClient'
import { useSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TabPanel from '../components/TabPanel'
import numeral from 'numeral'
const priceFormat = '$0'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMM DD hh:mm a'
import BookCard from '../components/BookCardPublic'
import Container from '@material-ui/core/Container'
import Badge from '@material-ui/core/Badge'
import Card from '@material-ui/core/Card'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import AppBar from '@material-ui/core/AppBar'
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
import WarningIcon from '@material-ui/icons/Warning'
import { red } from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress'
import SendIcon from '@material-ui/icons/Send'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

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
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
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
  center: {
    textAlign: 'center'
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
    margin: 2,
    padding: 2
  },
  textFieldWide: {
    width: '100%',
    margin: 2,
    padding: 2
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
    margin: 10
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
  }
}))

const Form = ({ books, dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [form, setForm] = React.useState({ cart: {} })
  const { enqueueSnackbar } = useSnackbar()
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [readOnly, setReadOnly] = React.useState(false)
  const [filtered, setFiltered] = React.useState(books)
  const [search, setSearch] = React.useState('')
  const [progress, setProgress] = React.useState(false)

  useEffect(() => {
    setProgress(false)
  })

  const searchBooks = event => {
    const searchString = event.target.value
    setSearch(searchString)
    filterBooks(searchString)
  }

  const filterBooks = searchString => {
    if (searchString && searchString.length > 0) {
      let booksSorted = books
        .map(book => {
          if (book.title.toLowerCase().includes(searchString.toLowerCase()))
            return book
          else return null
        })
        .filter(noNull => noNull)
      setFiltered(booksSorted)
    } else {
      setFiltered(books)
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

  const blurField = event => {}

  const changeCheckbox = event => {
    const updated = {
      ...form,
      [event.target.name]: event.target.checked
    }
    setForm(updated)
  }

  const addToCart = (book, quantity) => {
    let { cart } = form

    if (cart[book._id]) {
      cart[book._id].quantity += quantity
    } else {
      cart[book._id] = { title: book.title, image: book.image, quantity }
    }

    if (cart[book._id].quantity <= 0) {
      delete cart[book._id]
    }

    const updated = {
      ...form,
      cart
    }
    setForm(updated)
  }

  const handleSubmit = async () => {
    setProgress(true)

    await axiosClient
      .post('/orders', form)
      .then(res => {
        dispatch({ type: 'FORM_CLEAR', payload: '' })
        enqueueSnackbar('Your order has been submitted', {
          variant: 'success'
        })
        setProgress(false)
        Router.push('/order/' + res.data.ops[0]._id)
      })
      .catch(err => {
        setProgress(false)
        enqueueSnackbar('There was a problem submitting the order' + err, {
          variant: 'error'
        })
      })
  }

  // Calculate current cases
  let chips = []
  let cartDisplay = []
  let quantity = 0
  let cases = 0
  let items = 0
  let keyIndex = 0
  Object.entries(form.cart).map(([k, v], i) => {
    if (v && v.quantity) {
      quantity += v.quantity
    }
  })
  const modulo = quantity % 24
  cases = Math.floor(quantity / 24)
  items = quantity % 24
  for (let c = 0; c < cases; c++) {
    chips.push(
      <Chip key={keyIndex++} variant='outlined' label='24' color='primary' />
    )
  }
  if (items > 0) {
    if (cases > 0) {
      chips.push(
        <Chip
          key={keyIndex++}
          variant='outlined'
          label={items}
          color='secondary'
        />
      )
      chips.push(
        <Tooltip title='Add even case lots of 24'>
          <WarningIcon style={{ color: red[500] }} />
        </Tooltip>
      )
    } else {
      chips.push(
        <Chip
          key={keyIndex++}
          variant='outlined'
          label={items}
          color='primary'
        />
      )
    }
  }
  if (chips.length > 0) {
    cartDisplay.push(
      <IconButton aria-label='shopping-basket' color='inherit'>
        <Badge badgeContent={quantity ? quantity : 0} color='error'>
          <ShoppingCartIcon fontSize='large' />
        </Badge>
      </IconButton>
    )
    cartDisplay.push(<Grid>{chips}</Grid>)
    cartDisplay.push(
      <Grid>
        <Typography style={{ marginTop: 7 }}>
          Suggested Donation:&nbsp;
          {numeral(quantity * 3).format(priceFormat)}&nbsp;($3 per book)
        </Typography>
      </Grid>
    )
  }

  return (
    <Container className={classes.root}>
      <AppBar position='sticky' color='default'>
        <Grid>
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => {
              setSelectedTab(newValue)
            }}
            indicatorColor='primary'
            textColor='primary'
            variant='scrollable'
            scrollButtons='auto'
          >
            <img src='/images/logo.png' style={{ maxHeight: 60, margin: 10 }} />
            <Tab label='Catalog' value={0} />
            <Tab label='Order' value={1} />
          </Tabs>
        </Grid>
        <Grid className={classes.chips} onClick={() => setSelectedTab(1)}>
          {cartDisplay}
        </Grid>
      </AppBar>
      <Box width={1}>
        <TabPanel value={selectedTab} index={0} className={classes.tabPanel}>
          <FormControl variant='outlined'>
            <InputLabel>Search</InputLabel>
            <OutlinedInput
              id='search'
              value={search}
              onChange={searchBooks}
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
            {filtered.map(book => (
              <BookCard
                key={book._id}
                book={book}
                addToCart={addToCart}
                inCart={form.cart[book._id]}
              />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={selectedTab} index={1} className={classes.tabPanel}>
          {progress ? (
            <CircularProgress />
          ) : (
            <>
              <Grid
                container
                direction='row'
                spacing={2}
                justify='space-between'
                className={classes.formGroup}
              >
                <Grid item>
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
                </Grid>
                <Grid item>
                  <TextField
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
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='customerCity'
                    label='City'
                    defaultValue={form.customerCity ? form.customerCity : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
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
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='customerZip'
                    label='Zip'
                    defaultValue={form.customerZip ? form.customerZip : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='customerPhone'
                    label='Phone'
                    defaultValue={form.customerPhone ? form.customerPhone : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item>
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
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='donation'
                    label='Donation Amount'
                    defaultValue={form.donation ? form.donation : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                    helperText='Your donation helps us to distribute more Bibles'
                    type='number'
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='instructions'
                    label='Additional Instructions'
                    defaultValue={form.instructions ? form.instructions : ''}
                    onChange={changeField}
                    onBlur={blurField}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={!form.cart || Object.keys(form.cart).length === 0}
                    style={{ margin: 20 }}
                    onClick={handleSubmit}
                    startIcon={<SendIcon />}
                  >
                    Request Shipment
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                direction='row'
                justify='flex-start'
                alignItems='flex-start'
                alignContent='flex-start'
              >
                {filtered
                  .filter(book => Object.keys(form.cart).includes(book._id))
                  .map(book => (
                    <BookCard
                      key={book._id}
                      book={book}
                      addToCart={addToCart}
                      inCart={form.cart[book._id]}
                    />
                  ))}
              </Grid>
            </>
          )}
        </TabPanel>
      </Box>
    </Container>
  )
}

export async function getServerSideProps (context) {
  const books = await axiosClient.get('/books').then(response => response.data)

  return {
    props: {
      books
    }
  }
}

export default connect(state => state)(Form)
