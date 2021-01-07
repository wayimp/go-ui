import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Router from 'next/router'
import { axiosClient } from '../src/axiosClient'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TopBar from '../components/AdminTopBar'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import SearchIcon from '@material-ui/icons/Search'
import SendIcon from '@material-ui/icons/Send'
import numeral from 'numeral'
const priceFormat = '$0.00'
import BookCard from '../components/BookCardAdmin'
import { flatten } from 'lodash'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMMM DD, YYYY'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'
import { green } from '@material-ui/core/colors'
import CheckIcon from '@material-ui/icons/Check'
import Select from 'react-select'
import CancelIcon from '@material-ui/icons/Cancel'

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
  center: {
    textAlign: 'center'
  },
  content: {
    textAlign: 'center',
    flexGrow: 1,
    padding: theme.spacing(7)
  },
  root: {
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
      borderBottom: '1px solid #ccc'
    }
  },
  nolines: {
    borderBottom: '2px solid white'
  },
  flexGrid: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexGrow: 1
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%'
  },
  section: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    margin: '5px',
    padding: '8px'
  },
  checkbox: {
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    padding: 6
  },
  buttonWrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  backgroundModal: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    minWidth: 600
  },
  dialogPaper: {
    overflowY: 'visible'
  }
}))

const Page = ({ dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [books, setBooks] = React.useState([])
  const [filtered, setFiltered] = React.useState([])
  const [bookToDelete, setBookToDelete] = React.useState({})
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [showInactive, setShowInactive] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [success, setSuccess] = React.useState(false)

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  })

  const getData = inactive => {
    const url = inactive ? '/books?showInactive=true' : '/books'
    axiosClient({
      method: 'get',
      url,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      const result =
        response.data && Array.isArray(response.data) ? response.data : []
      setBooks(result)
      filterBooks(result, search)
    })
  }

  const changeShowInactive = event => {
    if (event && event.target) {
      const { checked } = event.target
      getData(checked)
      setShowInactive(checked)
    }
  }

  const searchBooks = event => {
    const searchString = event.target.value
    setSearch(searchString)
    filterBooks(books, searchString)
  }

  const filterBooks = (unfiltered, searchString) => {
    if (searchString && searchString.length > 0) {
      let booksSorted = unfiltered
        .map(book => {
          if (book.title.toLowerCase().includes(searchString.toLowerCase()))
            return book
          else return null
        })
        .filter(noNull => noNull)
      setFiltered(booksSorted)
    } else {
      setFiltered(unfiltered)
    }
  }

  useEffect(() => {
    if (token && token.length > 0) {
      getData(showInactive)
    } else {
      Router.push('/')
    }
  }, [])

  const handleConfirmDeleteClose = () => {
    setBookToDelete({})
    setConfirmDelete(false)
  }

  const confirmDeleteBook = book => {
    setBookToDelete(book)
    setConfirmDelete(true)
  }

  const createNew = async () => {
    const newBook = {
      active: true,
      order: 100,
      title: 'new book',
      image: ''
    }
    createBook(newBook)
  }

  const createBook = async book => {
    await axiosClient({
      method: 'post',
      url: '/books',
      data: book,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('New Book Created', {
          variant: 'success'
        })
        getData(showInactive)
      })
      .catch(error => {
        enqueueSnackbar('Error Creating Book: ' + error, {
          variant: 'error'
        })
      })
  }

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Button
              variant='contained'
              color='secondary'
              style={{ margin: 20 }}
              onClick={createNew}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Book
            </Button>
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
            <FormControlLabel
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={showInactive}
                  onChange={changeShowInactive}
                  name='showInactive'
                  color='secondary'
                />
              }
              label='Show Inactive'
            />
          </Grid>
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
                getData={getData}
                showInactive={showInactive}
              />
            ))}
          </Grid>
        </div>
      </main>
    </Container>
  )
}
export default connect(state => state)(Page)
