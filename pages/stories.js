import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import clsx from 'clsx'
import { axiosClient } from '../src/axiosClient'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TopBar from '../components/AdminTopBar'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import EditIcon from '@material-ui/icons/Edit'
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
import SyncIcon from '@material-ui/icons/Sync'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import CheckIcon from '@material-ui/icons/Check'
import BackupIcon from '@material-ui/icons/Backup'

import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'

const useStyles = makeStyles(theme => ({
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
    width: '80%'
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
  const [story, setStory] = React.useState({})
  const [storyToDelete, setStoryToDelete] = React.useState({})
  const [stories, setStories] = React.useState([])
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const getData = () => {
    axiosClient({
      method: 'get',
      url: '/stories',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      const result =
        response.data && Array.isArray(response.data) ? response.data : []
      setStories(result)
    })
  }

  const handleOpen = () => {
    const story = {
      order: 100,
      action: '',
      fields: []
    }
    setStory(story)
    setCreating(true)
    setOpen(true)
  }

  const handleEdit = story => {
    setStory(story)
    setCreating(false)
    setOpen(true)
  }


  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const roles = cookie.get('roles')
    if (token && token.length > 0 && roles && roles.includes('admin')) {
      getData()
    } else {
      Router.push('/admin')
    }
  }, [])

  const changeValue = async (name, value) => {
    const updated = {
      ...story,
      [name]: value
    }
    setStory(updated)
  }

  const changeField = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    changeValue(fieldName, fieldValue)
  }

  const changeCheckbox = event => {
    const updated = {
      ...story,
      [event.target.name]: event.target.checked ? 'admin' : ''
    }
    setStory(updated)
  }

  const saveStory = async story => {
    await axiosClient({
      method: 'patch',
      url: '/stories',
      data: story,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('Story Updated', {
          variant: 'success'
        })
        getData()
      })
      .catch(error => {
        enqueueSnackbar('Error Updating Story: ' + error, {
          variant: 'error'
        })
      })
    handleClose()
  }

  const deleteStory = async story => {
    await axiosClient({
      method: 'delete',
      url: `/stories/${story._id}`,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('Story Deleted', {
          variant: 'success'
        })
        getData()
      })
      .catch(error => {
        enqueueSnackbar('Error Deleting Story: ' + error, {
          variant: 'error'
        })
      })
    handleClose()
  }

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Box width={1}>
            <Grid>
              <List>
                {stories.map((story, index) => (
                  <ListItem key={'story' + index}>
                    <ListItemText
                      edge='begin'
                      primary={`${story.customerName}`}
                      secondary={`${story.location}`}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title='Edit'>
                        <IconButton onClick={() => handleEdit(story)}>
                          <EditIcon color='secondary' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete'>
                        <IconButton onClick={() => deleteStory(story)}>
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
            <Grid container spacing={1} justify='space-between'>
              <Grid item xs={12}>

                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='customerName'
                  label='Name'
                  defaultValue={story.customerName ? story.customerName : ''}
                  onChange={changeField}
                />

                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='location'
                  label='Location'
                  defaultValue={story.location ? story.location : ''}
                  onChange={changeField}
                />

                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='customerEmail'
                  label='Email'
                  defaultValue={story.customerEmail ? story.customerEmail : ''}
                  onChange={changeField}
                />

                <br />
                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='story'
                  label='Story'
                  fullWidth
                  multiline
                  defaultValue={story.story ? story.story : ''}
                  onChange={changeField}
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
                  onClick={() => saveStory(story)}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </Container>
  )
}

export default connect(state => state)(Page)
