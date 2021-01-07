import React, { useState } from 'react'
import { axiosClient } from '../src/axiosClient'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { flatten } from 'lodash'
import { LabelDivider } from 'mui-label-divider'
import { getLangString } from './Lang'
import {
  Grid,
  Collapse,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Modal,
  Backdrop,
  Fade,
  FormControl,
  FormControlLabel,
  TextField,
  Switch,
  Tooltip,
  Checkbox
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DeleteIcon from '@material-ui/icons/Delete'
import ListAltIcon from '@material-ui/icons/ListAlt'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
  segmentSelect: {
    minWidth: 200
  },
  smallField: {
    maxWidth: 140,
    padding: theme.spacing(1)
  },
  root: {
    maxWidth: 400,
    margin: 10,
    overflow: 'visible'
  },
  media: {
    height: 300
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
    padding: theme.spacing(2)
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  field: {
    padding: theme.spacing(1)
  },
  thumb: {
    maxWidth: 200,
    maxHeight: 200,
    margin: 20
  },
  card: {
    maxWidth: 400,
    margin: 10,
    overflow: 'visible',
    height: '98%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardActions: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  }
}))

const BookDisplay = ({ book, token, getData, showInactive }) => {
  {
    const classes = useStyles()
    const [expanded, setExpanded] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const [open, setOpen] = React.useState(false)
    const [bookEdit, setBookEdit] = useState({})
    const [confirmDelete, setConfirmDelete] = React.useState(false)

    const handleConfirmDeleteOpen = () => {
      setConfirmDelete(true)
    }

    const handleConfirmDeleteClose = () => {
      setConfirmDelete(false)
    }

    const changeField = (name, value) => {
      const updated = {
        ...bookEdit,
        [name]: value
      }
      setBookEdit(updated)
    }

    const handleSwitchChange = event => {
      changeField(event.target.name, event.target.checked)
    }

    const handleOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
    }

    const handleEdit = () => {
      const edit = JSON.parse(JSON.stringify(book))
      setBookEdit(edit)
      setOpen(true)
    }

    const handleSubmit = async () => {
      handleSave(bookEdit)
      handleClose()
    }

    const handleSave = async bookSave => {
      // If it has an ID aleady, then post it, or else update it.
      await axiosClient({
        method: bookSave._id ? 'patch' : 'post',
        url: '/books',
        data: bookSave,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          enqueueSnackbar('Book Saved', {
            variant: 'success'
          })
          getData()
        })
        .catch(error => {
          enqueueSnackbar('Error Saving Book ' + error, {
            variant: 'error'
          })
        })
    }

    const handleDelete = async () => {
      setConfirmDelete(false)
      await axiosClient({
        method: 'delete',
        url: '/books/' + book._id,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          enqueueSnackbar('Book Deleted', {
            variant: 'success'
          })
          getData(showInactive)
        })
        .catch(error => {
          enqueueSnackbar('Error Deleting Book: ' + error, {
            variant: 'error'
          })
        })
    }

    const handleExpandClick = () => {
      setExpanded(!expanded)
    }

    const handleVariantChange = (index, selected) => {
      const sv = selectedVariant.slice()
      sv[index] = selected
      setSelectedVariant(sv)
    }

    return (
      <Grid item lg={3} md={4} sm={5} xs={12} key={book._id}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={book.image || ''}
            title={book.title || ''}
          />
          <CardContent>
            <Typography variant='h6' component='h3'>
              {book.title}
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Tooltip title='Edit'>
              <IconButton onClick={handleEdit}>
                <EditIcon color='secondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton onClick={handleConfirmDeleteOpen}>
                <DeleteIcon color='secondary' />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
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
                <Grid item xs={3}>
                  <FormControlLabel
                    labelPlacement='top'
                    control={
                      <Switch
                        className={classes.switch}
                        checked={bookEdit.active}
                        onChange={handleSwitchChange}
                        name='active'
                        color='primary'
                      />
                    }
                    label='Active'
                  />
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <TextField
                      className={classes.field}
                      variant='outlined'
                      id='title'
                      label='Title'
                      defaultValue={bookEdit.title ? bookEdit.title : ''}
                      onChange={event =>
                        changeField('title', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <TextField
                      className={classes.field}
                      variant='outlined'
                      id='image'
                      label='Image'
                      defaultValue={bookEdit.image ? bookEdit.image : ''}
                      onChange={event =>
                        changeField('image', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <TextField
                      className={classes.field}
                      variant='outlined'
                      id='order'
                      label='Order'
                      type='number'
                      defaultValue={bookEdit.order ? bookEdit.order : ''}
                      onChange={event =>
                        changeField('order', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <img src={bookEdit.image || ''} className={classes.thumb} />
                </Grid>
              </Grid>
              <Grid
                container
                direction='row'
                justify='flex-end'
                alignItems='flex-start'
              >
                <Button
                  variant='contained'
                  color='secondary'
                  style={{ margin: 20 }}
                  onClick={handleClose}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  style={{ margin: 20 }}
                  onClick={handleSubmit}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </Grid>
            </div>
          </Fade>
        </Modal>
        <Dialog open={confirmDelete} onClose={handleConfirmDeleteClose}>
          <DialogTitle id='alert-dialog-title'>
            Are you sure you want to delete this book?
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleConfirmDeleteClose} color='secondary'>
              Cancel
            </Button>
            <Button onClick={handleDelete} color='primary' autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    )
  }
}

export default connect(state => state)(BookDisplay)
