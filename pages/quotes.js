import React, { useState, useEffect } from 'react'
import SunEditor, { buttonList } from 'suneditor-react'
import Router from 'next/router'
import { axiosClient } from '../src/axiosClient'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TopBar from '../components/AdminTopBar'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import numeral from 'numeral'
const priceFormat = '$0.00'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMMM DD, YYYY'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import EditIcon from '@material-ui/icons/Edit'
import Select from 'react-select'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'

import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'

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
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    width: '80%',
    minWidth: 400
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  field: {
    margin: 0,
    padding: 0
  },
  iconButton: {
    padding: 0,
    margin: 0
  },
  section: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    margin: '5px',
    padding: '8px'
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
  select: { minWidth: 150 }
}))

const Page = ({ dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [creating, setCreating] = React.useState(false)
  const [quote, setQuote] = React.useState({})
  const [quoteToDelete, setQuoteToDelete] = React.useState({})
  const [quotes, setQuotes] = React.useState([])
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleEditorChange = content => {
    changeValue('text', content)
  }

  const getData = () => {
    axiosClient({
      method: 'get',
      url: '/quotes',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      const result =
        response.data && Array.isArray(response.data) ? response.data : []
      setQuotes(result)
    })
  }

  const handleOpen = () => {
    const quote = {
      order: 100,
      text: ''
    }
    setQuote(quote)
    setCreating(true)
    setOpen(true)
  }

  const handleEdit = quote => {
    setQuote(quote)
    setCreating(false)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmDeleteClose = () => {
    setQuoteToDelete({})
    setConfirmDelete(false)
  }

  const confirmQuoteToDelete = quote => {
    setQuoteToDelete(quote)
    setConfirmDelete(true)
  }

  useEffect(() => {
    const roles = cookie.get('roles')
    if (token && token.length > 0 && roles && roles.includes('admin')) {
      getData()
    } else {
      Router.push('/admin')
    }
  }, [])

  const changeValue = (name, value) => {
    const updated = {
      ...quote,
      [name]: value
    }
    setQuote(updated)
  }

  const changeField = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    changeValue(fieldName, fieldValue)
  }

  const changeCheckbox = event => {
    const updated = {
      ...quote,
      [event.target.name]: event.target.checked ? 'admin' : ''
    }
    setQuote(updated)
  }

  const saveQuote = async () => {
    await axiosClient({
      method: creating ? 'post' : 'patch',
      url: '/quotes',
      data: quote,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('New Quote Created', {
          variant: 'success'
        })
        getData()
      })
      .catch(error => {
        enqueueSnackbar('Error Creating Quote: ' + error, {
          variant: 'error'
        })
      })
    handleClose()
  }

  const deleteQuote = async () => {
    if (quoteToDelete) {
      await axiosClient({
        method: 'delete',
        url: `/quotes/${quoteToDelete._id}`,
        data: quote,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          enqueueSnackbar('Quote Deleted', {
            variant: 'success'
          })
          getData()
        })
        .catch(error => {
          enqueueSnackbar('Error Deleting Quote: ' + error, {
            variant: 'error'
          })
        })
    }
    setQuoteToDelete(null)
    handleConfirmDeleteClose()
  }

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    // uploadHandler is a function
    resizeImage(files, uploadHandler)
  }

  const resizeImage = (files, uploadHandler) => {
    const uploadFile = files[0]
    const img = document.createElement('img')
    const canvas = document.createElement('canvas')
    const reader = new FileReader()

    reader.onload = function (e) {
      img.src = e.target.result
      img.onload = function () {
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          async function (blob) {
            uploadHandler([new File([blob], uploadFile.name)])
          },
          uploadFile.type,
          1
        )
      }
    }

    reader.readAsDataURL(uploadFile)
  }

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Button
            variant='contained'
            color='secondary'
            style={{ margin: 20 }}
            onClick={handleOpen}
            startIcon={<FormatQuoteIcon />}
          >
            New Testimonial
          </Button>

          <Box width={1}>
            <Grid>
              <List>
                {quotes.map((quote, index) => (
                  <ListItem key={'quote' + index}>
                    <ListItemAvatar>
                      <Typography>{quote.order ? quote.order : ''}</Typography>
                    </ListItemAvatar>
                    <ListItemText
                      edge='begin'
                      primary={`${quote.author}`}
                      secondary={`${quote.location}`}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title='Edit'>
                        <IconButton onClick={() => handleEdit(quote)}>
                          <EditIcon color='secondary' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete'>
                        <IconButton onClick={() => confirmQuoteToDelete(quote)}>
                          <DeleteIcon color='secondary' />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Box>
        </div>
      </main>
      <Modal
        id='edit'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Box width={1}>
              <Grid>
                <TextField
                  className={classes.textFieldWide}
                  variant='outlined'
                  name='order'
                  label='Sort Order'
                  type='number'
                  defaultValue={quote.order}
                  onChange={changeField}
                />
                <br />
                <SunEditor
                  setOptions={{
                    minHeight: 300,
                    minWidth: 300,
                    imageUrlInput: true,
                    imageUploadHeader: { Authorization: `Bearer ${token}` },
                    imageUploadUrl: 'http://localhost:8040/images',
                    buttonList: [
                      ['undo', 'redo'],
                      ['bold', 'italic', 'underline'],
                      ['font', 'fontColor', 'fontSize', 'align', 'blockquote'],
                      ['image', 'imageGallery', 'video', 'link']
                    ],
                    imageGalleryUrl: 'http://localhost:8040/images'
                  }}
                  onImageUploadBefore={handleImageUploadBefore}
                  onChange={handleEditorChange}
                  setContents={quote.text}
                />
              </Grid>
              <Grid
                container
                direction='row'
                justify='flex-end'
                alignItems='flex-end'
              >
                <Button
                  variant='contained'
                  color='primary'
                  style={{ margin: 10 }}
                  onClick={handleClose}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  color='secondary'
                  style={{ margin: 10 }}
                  onClick={saveQuote}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </Grid>
            </Box>
          </div>
        </Fade>
      </Modal>
      <Dialog open={confirmDelete} onClose={handleConfirmDeleteClose}>
        <DialogTitle>{`Are you sure you want to delete this quote?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={deleteQuote} color='secondary' autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default connect(state => state)(Page)
