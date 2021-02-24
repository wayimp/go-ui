import React, { useState } from 'react'
import { axiosClient } from '../src/axiosClient'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { flatten } from 'lodash'
import { LabelDivider } from 'mui-label-divider'
import { getLangString } from './Lang'
import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import Tooltip from '@material-ui/core/Tooltip'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DeleteIcon from '@material-ui/icons/Delete'
import ListAltIcon from '@material-ui/icons/ListAlt'
import { useSnackbar } from 'notistack'
import imageCompression from 'browser-image-compression'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

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
    maxWidth: 300,
    maxHeight: 300,
    margin: 20
  },
  card: {
    maxWidth: 400,
    margin: 10,
    overflow: 'visible',
    height: '98%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  cardActions: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  media: {
    height: 300,
    position: 'relative'
  },
  limitedIcon: {
    position: 'absolute',
    top: 6,
    left: 0,
    display: 'block',
    width: 'auto',
    height: 'auto'
  },
  newIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    display: 'block',
    width: 'auto',
    height: 'auto'
  },
  constitutionIcon: {
    position: 'absolute',
    top: 240,
    left: 0,
    display: 'block',
    width: 'auto',
    height: 'auto',
    maxWidth: 240
  }
}))

const ProductDisplay = ({ product, token, getData, showInactive }) => {
  {
    const classes = useStyles()
    const [expanded, setExpanded] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const [open, setOpen] = React.useState(false)
    const [productEdit, setProductEdit] = useState({})
    const [confirmDelete, setConfirmDelete] = React.useState(false)

    const handleConfirmDeleteOpen = () => {
      setConfirmDelete(true)
    }

    const handleConfirmDeleteClose = () => {
      setConfirmDelete(false)
    }

    const changeField = (name, value) => {
      const updated = {
        ...productEdit,
        [name]: value
      }
      setProductEdit(updated)
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
      const edit = JSON.parse(JSON.stringify(product))
      setProductEdit(edit)
      setOpen(true)
    }

    const handleSubmit = async () => {
      handleSave(productEdit)
      handleClose()
    }

    const handleSave = async productSave => {
      // If it has an ID aleady, then post it, or else update it.
      await axiosClient({
        method: productSave._id ? 'patch' : 'post',
        url: '/products',
        data: productSave,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          enqueueSnackbar('Product Saved', {
            variant: 'success'
          })
          getData()
        })
        .catch(error => {
          enqueueSnackbar('Error Saving Product ' + error, {
            variant: 'error'
          })
        })
    }

    const handleDelete = async () => {
      setConfirmDelete(false)
      await axiosClient({
        method: 'delete',
        url: '/products/' + product._id,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          enqueueSnackbar('Product Deleted', {
            variant: 'success'
          })
          getData(showInactive)
        })
        .catch(error => {
          enqueueSnackbar('Error Deleting Product: ' + error, {
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

    const handleImageUpload = async event => {
      const imageFile = event.target.files[0]
      console.log('originalFile instanceof Blob', imageFile instanceof Blob) // true
      console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      try {
        const compressedFile = await imageCompression(imageFile, options)
        console.log(
          'compressedFile instanceof Blob',
          compressedFile instanceof Blob
        ) // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ) // smaller than maxSizeMB
        await uploadToServer(compressedFile, imageFile.name)
      } catch (error) {
        enqueueSnackbar('Error Compressing Image ' + error, {
          variant: 'error'
        })
      }
    }

    const uploadToServer = async (compressedFile, fileName) => {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 512,
        useWebWorker: true
      }
      try {
        const formData = new FormData()
        formData.append('file-0', new File([compressedFile], fileName))
        await axiosClient({
          method: 'post',
          url: '/images',
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            enqueueSnackbar('Image Uploaded', {
              variant: 'success'
            })
            changeField(
              'image',
              `https://tanque.nyc3.digitaloceanspaces.com/up/${fileName}`
            )
          })
          .catch(error => {
            enqueueSnackbar('Error Uploading Image ' + error, {
              variant: 'error'
            })
          })
      } catch (error) {
        enqueueSnackbar('Error Compressing Image ' + error, {
          variant: 'error'
        })
      }
    }

    return (
      <Grid item lg={3} md={4} sm={5} xs={12} key={product._id}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={product.image || ''}
            title={product.title || ''}
          />
          {product.limited ? (
            <img
              src={'https://files.lifereferencemanual.net/go/LimitedStock.png'}
              className={classes.limitedIcon}
            />
          ) : (
            ''
          )}
          {product.new ? (
            <img
              src={'https://files.lifereferencemanual.net/go/new.png'}
              className={classes.newIcon}
            />
          ) : (
            ''
          )}
          {product.constitution ? (
            <img
              src={'https://files.lifereferencemanual.net/go/constitution.png'}
              className={classes.constitutionIcon}
            />
          ) : (
            ''
          )}
          <CardContent>
            <Typography variant='h6' component='h3'>
              {product.title}
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
              <Grid
                container
                direction='row'
                justify='flex-start'
                alignItems='center'
              >
                <FormControlLabel
                  labelPlacement='top'
                  control={
                    <Switch
                      className={classes.switch}
                      checked={productEdit.active}
                      onChange={handleSwitchChange}
                      name='active'
                      color='primary'
                    />
                  }
                  label='Active'
                />
                <FormControlLabel
                  labelPlacement='top'
                  control={
                    <Switch
                      className={classes.switch}
                      checked={productEdit.limited}
                      onChange={handleSwitchChange}
                      name='limited'
                      color='primary'
                    />
                  }
                  label='Limited'
                />
                <FormControlLabel
                  labelPlacement='top'
                  control={
                    <Switch
                      className={classes.switch}
                      checked={productEdit.new}
                      onChange={handleSwitchChange}
                      name='new'
                      color='primary'
                    />
                  }
                  label='New'
                />
                <FormControlLabel
                  labelPlacement='top'
                  control={
                    <Switch
                      className={classes.switch}
                      checked={productEdit.constitution}
                      onChange={handleSwitchChange}
                      name='constitution'
                      color='primary'
                    />
                  }
                  label='Constitution'
                />
                <FormControl>
                  <TextField
                    className={classes.field}
                    variant='outlined'
                    id='title'
                    label='Title'
                    defaultValue={productEdit.title ? productEdit.title : ''}
                    onChange={event => changeField('title', event.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    className={classes.field}
                    variant='outlined'
                    id='order'
                    label='Order'
                    type='number'
                    defaultValue={productEdit.order ? productEdit.order : ''}
                    onChange={event => changeField('order', event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid
                container
                direction='row'
                justify='flex-start'
                alignItems='center'
              >
                <FormControl>
                  <TextField
                    className={classes.field}
                    variant='outlined'
                    id='image'
                    label='Image'
                    value={productEdit.image ? productEdit.image : ''}
                    onChange={event => changeField('image', event.target.value)}
                  />
                </FormControl>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                />
              </Grid>
              <img src={productEdit.image || ''} className={classes.thumb} />
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
            Are you sure you want to delete this product?
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

export default connect(state => state)(ProductDisplay)
