import React, { useState, useEffect } from 'react'
import SunEditor, { buttonList } from 'suneditor-react'
import Router from 'next/router'
import { axiosClient, baseURL } from '../src/axiosClient'
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
import Switch from '@material-ui/core/Switch'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import EditIcon from '@material-ui/icons/Edit'
import Select from 'react-select'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import imageCompression from 'browser-image-compression'
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined'
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined'
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'
import VideocamIcon from '@material-ui/icons/Videocam'

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
  }
}))

const Page = ({ dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [openText, setOpenText] = React.useState(false)
  const [openVideo, setOpenVideo] = React.useState(false)
  const [creating, setCreating] = React.useState(false)
  const [block, setBlock] = React.useState({})
  const [blockToDelete, setBlockToDelete] = React.useState({})
  const [blocks, setBlocks] = React.useState([])
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const categoryOptions = [
    { value: 'stories', label: 'Stories' },
    { value: 'frontPage', label: 'Front Page' }
  ]

  const handleCategoryChange = option => {
    changeValue('category', option.value)
  }

  const handleEditorChange = content => {
    changeValue('html', content)
  }

  const getData = () => {
    axiosClient({
      method: 'get',
      url: '/blocks?showInactive=true'
    }).then(response => {
      const result =
        response.data && Array.isArray(response.data) ? response.data : []
      setBlocks(result)
    })
  }

  const handleOpenText = () => {
    const block = {
      active: true,
      type: 'text',
      category: 'stories',
      order: 100
    }
    setBlock(block)
    setCreating(true)
    setOpenText(true)
  }

  const handleOpenVideo = () => {
    const block = {
      active: true,
      type: 'video',
      category: 'stories',
      order: 100
    }
    setBlock(block)
    setCreating(true)
    setOpenVideo(true)
  }

  const handleEdit = block => {
    setBlock(block)
    setCreating(false)
    if (block.type === 'text') {
      setOpenText(true)
    } else if (block.type === 'video') {
      setOpenVideo(true)
    }
  }

  const handleClose = () => {
    setOpenText(false)
    setOpenVideo(false)
  }

  const handleConfirmDeleteClose = () => {
    setBlockToDelete({})
    setConfirmDelete(false)
  }

  const confirmBlockToDelete = block => {
    setBlockToDelete(block)
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
      ...block,
      [name]: value
    }
    setBlock(updated)
  }

  const changeField = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    changeValue(fieldName, fieldValue)
  }

  const handleSwitchChange = event => {
    changeValue(event.target.name, event.target.checked)
  }

  const saveBlock = async blockToSave => {
    await axiosClient({
      method: creating ? 'post' : 'patch',
      url: '/blocks',
      data: blockToSave,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('New Block Created', {
          variant: 'success'
        })
        getData()
      })
      .catch(error => {
        enqueueSnackbar('Error Creating Block: ' + error, {
          variant: 'error'
        })
      })
    handleClose()
  }

  const deleteBlock = async () => {
    if (blockToDelete) {
      await axiosClient({
        method: 'delete',
        url: `/blocks/${blockToDelete._id}`,
        data: block,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          enqueueSnackbar('Block Deleted', {
            variant: 'success'
          })
          getData()
        })
        .catch(error => {
          enqueueSnackbar('Error Deleting Block: ' + error, {
            variant: 'error'
          })
        })
    }
    setBlockToDelete(null)
    handleConfirmDeleteClose()
  }

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    // uploadHandler is a function
    resizeImage(files, uploadHandler)
  }

  const resizeImage = async (files, uploadHandler) => {
    const imageFile = files[0]
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true
    }
    try {
      const compressedFile = await imageCompression(imageFile, options)
      uploadHandler([new File([compressedFile], imageFile.name)])
    } catch (error) {
      console.log(error)
    }
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
              onClick={handleOpenText}
              startIcon={<TextFieldsIcon />}
            >
              New Text Block
            </Button>
            <Button
              variant='contained'
              color='secondary'
              style={{ margin: 20 }}
              onClick={handleOpenVideo}
              startIcon={<VideocamIcon />}
            >
              New Video Block
            </Button>
          </Grid>
          <Box width={1}>
            <Grid>
              <List>
                {blocks.map((block, index) => (
                  <ListItem key={'block' + index}>
                    <ListItemAvatar>
                      <Grid
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                      >
                        {block.active ? (
                          <CheckBoxOutlinedIcon />
                        ) : (
                          <CheckBoxOutlineBlankOutlinedIcon />
                        )}
                        &nbsp;
                        {block.type === 'video' ? (
                          <VideocamIcon />
                        ) : (
                          <TextFieldsIcon />
                        )}
                        &nbsp;
                      </Grid>
                    </ListItemAvatar>
                    <ListItemText
                      edge='begin'
                      primary={block.description}
                      secondary={
                        categoryOptions.find(
                          category => category.value === block.category
                        ).label
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title='Edit'>
                        <IconButton onClick={() => handleEdit(block)}>
                          <EditIcon color='secondary' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete'>
                        <IconButton onClick={() => confirmBlockToDelete(block)}>
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
        open={openText}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openText}>
          <div className={classes.paper}>
            <Box width={1}>
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
                      checked={block.active}
                      onChange={handleSwitchChange}
                      name='active'
                      color='primary'
                    />
                  }
                  label='Active'
                />
                <Grid item xs={3}>
                  <Select
                    id='category'
                    name='category'
                    onChange={handleCategoryChange}
                    options={categoryOptions}
                    styles={selectStyles}
                    defaultValue={categoryOptions.find(
                      option => option.value == block.category
                    )}
                    className='itemsSelect'
                    classNamePrefix='select'
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='order'
                    label='Sort Order'
                    type='number'
                    defaultValue={block.order}
                    onChange={changeField}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='description'
                    label='Description'
                    defaultValue={block.description}
                    onChange={changeField}
                  />
                </Grid>
              </Grid>
              <SunEditor
                setOptions={{
                  minHeight: 300,
                  minWidth: 300,
                  imageUrlInput: true,
                  imageUploadHeader: { Authorization: `Bearer ${token}` },
                  imageUploadUrl: `${baseURL}/images`,
                  buttonList: [
                    ['undo', 'redo'],
                    ['bold', 'italic', 'underline'],
                    ['font', 'fontColor', 'fontSize', 'align', 'blockquote'],
                    ['image', 'imageGallery', 'link']
                  ],
                  imageGalleryUrl: `${baseURL}/images`
                }}
                onImageUploadBefore={handleImageUploadBefore}
                onChange={handleEditorChange}
                setContents={block.html}
              />
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
                  onClick={() => saveBlock(block)}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </Grid>
            </Box>
          </div>
        </Fade>
      </Modal>
      <Modal
        id='edit'
        className={classes.modal}
        open={openVideo}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openVideo}>
          <div className={classes.paper}>
            <Box width={1}>
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
                      checked={block.active}
                      onChange={handleSwitchChange}
                      name='active'
                      color='primary'
                    />
                  }
                  label='Active'
                />
                <Grid item xs={3}>
                  <Select
                    id='category'
                    name='category'
                    onChange={handleCategoryChange}
                    options={categoryOptions}
                    styles={selectStyles}
                    defaultValue={categoryOptions.find(
                      option => option.value == block.category
                    )}
                    className='itemsSelect'
                    classNamePrefix='select'
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='order'
                    label='Sort Order'
                    type='number'
                    defaultValue={block.order}
                    onBlur={changeField}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    className={classes.textField}
                    variant='outlined'
                    name='description'
                    label='Description'
                    defaultValue={block.description}
                    onBlur={changeField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.textFieldWide}
                    variant='outlined'
                    name='html'
                    label='Video Link'
                    defaultValue={block.html}
                    onChange={changeField}
                  />
                </Grid>
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
                  onClick={() => saveBlock(block)}
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
        <DialogTitle>{`Are you sure you want to delete this block?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={deleteBlock} color='secondary' autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default connect(state => state)(Page)
