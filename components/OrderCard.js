import React from 'react'
import { connect } from 'react-redux'
import { axiosClient } from '../src/axiosClient'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import clsx from 'clsx'
import { red } from '@material-ui/core/colors'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import LaunchIcon from '@material-ui/icons/Launch'
import CallIcon from '@material-ui/icons/Call'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd h:mm a'
import numeral from 'numeral'
const priceFormat = '$0.00'
import ProductCard from '../components/ProductCardPublic'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import SaveIcon from '@material-ui/icons/Save'
import { green, yellow, orange } from '@material-ui/core/colors'
import EditIcon from '@material-ui/icons/Edit'
import AssignmentIcon from '@material-ui/icons/Assignment'
import CancelIcon from '@material-ui/icons/Cancel'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import DeleteIcon from '@material-ui/icons/Delete'
import ArchiveIcon from '@material-ui/icons/Archive'
import UnarchiveIcon from '@material-ui/icons/Unarchive'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import SearchIcon from '@material-ui/icons/Search'

Array.prototype.sum = function (prop) {
  let total = Number(0)
  for (let i = 0, _len = this.length; i < _len; i++) {
    total += Number(this && this[i] && this[i][prop] ? this[i][prop] : 0)
  }
  return total
}

const formatPhoneNumber = phoneNumberString => {
  let cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  if (cleaned.startsWith('1')) cleaned = cleaned.slice(1)
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phoneNumberString
}

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    fontSize: 'x-large',
    fontWeight: 'bold',
    border: '2px solid rgba(0, 0, 0, 1)',
    marginBottom: -2,
    minHeight: 48,
    maxHeight: 48,
    '&$expanded': {
      minHeight: 48,
      maxHeight: 48
    }
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {}
})(MuiAccordionSummary)

const AccordionDetails = withStyles(theme => ({
  root: {
    border: '2px solid rgba(0, 0, 0, 1)',
    marginBottom: -2,
    padding: theme.spacing(2)
  }
}))(MuiAccordionDetails)

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    margin: 6,
    border: '2px solid rgba(0, 0, 0, 1)',
    borderRadius: 20
  },
  grid: {
    marginTop: -30,
    paddingBottom: 20
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
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
  step: {
    margin: theme.spacing(1),
    minWidth: 300
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
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  textFieldWide: {
    width: '100%',
    margin: 2,
    padding: 2
  }
}))

const OrderCard = ({
  propsOrder,
  workflows,
  products,
  token,
  getData,
  showInactive,
  handleOpenDialog
}) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [order, setOrder] = React.useState(propsOrder)
  const [expanded, setExpanded] = React.useState(false)
  const [details, setDetails] = React.useState(false)
  const [edit, setEdit] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [openProducts, setOpenProducts] = React.useState(false)

  const handleOpenProducts = () => {
    setOpenProducts(true)
  }

  const handleCloseProducts = () => {
    setOpenProducts(false)
  }

  const cart = []
  Object.entries(order.cart).forEach(([key, value]) => {
    cart.push({ ...value, _id: key })
  })

  const handleConfirmDeleteOpen = () => {
    setConfirmDelete(true)
  }

  const handleConfirmDeleteClose = () => {
    setConfirmDelete(false)
  }

  const handleEditOpen = () => {
    setEdit(true)
  }

  const handleEditClose = () => {
    setEdit(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDetailsClick = () => {
    setDetails(!details)
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const addAction = action => {
    let timeline = Array.from(order.timeline)

    timeline = timeline.concat([
      {
        action,
        timestamp: moment().tz('America/Chicago')
      }
    ])

    const updated = {
      ...order,
      timeline
    }

    updateOrder(updated)
  }

  const removeAction = action => {
    let timeline = Array.from(order.timeline)
    timeline = timeline.filter(t => t.action !== action)

    const updated = {
      ...order,
      timeline
    }

    updateOrder(updated)
  }

  const updateOrder = async updated => {
    setOrder(updated)
    axiosClient
      .patch('/orders', updated)
      .then(res => {
        enqueueSnackbar('Order updated', {
          variant: 'success'
        })
      })
      .catch(err => {
        enqueueSnackbar('There was a problem updating the order' + err, {
          variant: 'error'
        })
      })
  }

  const changeStatus = (workflow, status) => {
    let timeline = Array.from(order.timeline)
    let found = false

    timeline = timeline.map(t => {
      if (t.action === workflow.action) {
        found = true
        return {
          ...t,
          status,
          timestamp: moment().tz('America/Chicago')
        }
      } else {
        return t
      }
    })

    if (!found) {
      timeline = timeline.concat([
        {
          ...workflow,
          status,
          timestamp: moment().tz('America/Chicago')
        }
      ])
    }

    const updated = {
      ...order,
      timeline
    }

    updateOrder(updated)
  }

  const changeFieldValue = (workflow, fi, value) => {
    let timeline = Array.from(order.timeline)
    let found = false

    let workflowUpdate = JSON.parse(JSON.stringify(workflow))
    workflowUpdate.fields[fi].value = value
    workflowUpdate.timestamp = moment().tz('America/Chicago')

    timeline = timeline.map(t => {
      if (t.action === workflow.action) {
        found = true
        return workflowUpdate
      } else {
        return t
      }
    })

    if (!found) {
      timeline = timeline.concat([workflowUpdate])
    }

    const updated = {
      ...order,
      timeline
    }

    updateOrder(updated)
  }

  const changeValue = async (name, value) => {
    const updated = {
      ...order,
      [name]: value
    }
    setOrder(updated)
  }

  const handleArchive = archived => {
    changeValue('archived', archived)
    const updated = {
      ...order,
      archived
    }
    updateOrder(updated)
  }

  const changeField = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    changeValue(fieldName, fieldValue)
  }

  const handleCancel = () => {
    changeValue('notes', propsOrder.notes)
    handleClose()
  }

  const handleSubmit = () => {
    updateOrder(order)
    handleClose()
  }

  const handleEditCancel = () => {
    changeValue('notes', propsOrder.notes)
    handleEditClose()
  }

  const handleEditSubmit = () => {
    updateOrder(order)
    handleEditClose()
  }

  const handleDelete = async () => {
    setConfirmDelete(false)
    await axiosClient({
      method: 'delete',
      url: '/orders/' + order._id,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('Order Deleted', {
          variant: 'success'
        })
        getData(showInactive)
      })
      .catch(error => {
        enqueueSnackbar('Error Deleting Order: ' + error, {
          variant: 'error'
        })
      })
  }

  const addToCart = (product, quantity) => {
    let { cart } = order

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
      ...order,
      cart
    }

    updateOrder(updated)
    handleCloseProducts()
  }

  return (
    <Card className={classes.root}>
      {moment(order.timeline ? order.timeline[0].timestamp : order.created)
        .tz('America/Chicago')
        .format('h:mm a')}
      <CardHeader
        style={{ textAlign: 'left' }}
        title={
          <IconButton color='primary'>
            <MonetizationOnIcon />
            {numeral(order.donation).format('0')}
          </IconButton>
        }
        action={
          <>
            <Tooltip title='Edit'>
              <IconButton onClick={handleEditOpen} color='primary'>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Notes'>
              <IconButton onClick={handleOpen} color='primary'>
                <AssignmentIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Order Page'>
              <IconButton color='primary'>
                <Link href={`/order/${order._id}`} target={order._id}>
                  <LaunchIcon />
                </Link>
              </IconButton>
            </Tooltip>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: details
              })}
              onClick={handleDetailsClick}
              aria-expanded={details}
              aria-label='show details'
            >
              <ExpandMoreIcon />
            </IconButton>
          </>
        }
      ></CardHeader>
      <CardContent style={{ marginTop: -40 }}>
        <Typography variant='h5'>
          {order.customerName}
          <Tooltip title='Search QuickBooks'>
            <IconButton
              onClick={() =>
                handleOpenDialog(JSON.parse(JSON.stringify(order)))
              }
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </Typography>
        <Grid>
          <Link href={`tel:${order.customerPhone}`}>
            <IconButton color='primary'>
              <CallIcon />
              {formatPhoneNumber(order.customerPhone)}
            </IconButton>
          </Link>

          <CopyToClipboard
            text={order.customerEmail}
            onCopy={() =>
              enqueueSnackbar('Email Copied', {
                variant: 'success'
              })
            }
          >
            <Tooltip title={order.customerEmail}>
              <IconButton color='primary'>
                <MailOutlineIcon />
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
        </Grid>
        {workflows.map((workflow, wi) => {
          const section = []
          let workflowExisting = JSON.parse(JSON.stringify(workflow))
          const existing = order.timeline.find(
            step => step.action === workflow.action
          )
          if (existing) {
            workflowExisting = { ...workflowExisting, ...existing }
          }

          return (
            <Accordion
              square
              expanded={details}
              onChange={() =>
                changeStatus(
                  workflowExisting,
                  workflowExisting.status === 1
                    ? 2
                    : workflowExisting.status === 2
                    ? 0
                    : 1
                )
              }
              key={wi}
            >
              <AccordionSummary
                style={{
                  background:
                    workflowExisting.status === 1
                      ? '#00de74'
                      : workflowExisting.status === 2
                      ? '#ffd55b'
                      : '#fff8b2'
                }}
              >
                {workflowExisting.action}
              </AccordionSummary>
              <AccordionDetails>
                {workflowExisting.fields.map((field, fi) => {
                  return (
                    <TextField
                      key={'field' + fi}
                      label={field.label}
                      defaultValue={field.value}
                      type={field.inputType}
                      onBlur={event =>
                        changeFieldValue(
                          workflowExisting,
                          fi,
                          event.target.value
                        )
                      }
                    />
                  )
                })}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </CardContent>
      <CardActions>
        {order.archived ? (
          <>
            <Tooltip title='Delete Permanently'>
              <IconButton onClick={handleConfirmDeleteOpen} color='primary'>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => handleArchive(false)} color='primary'>
              <UnarchiveIcon />
              &nbsp;Unarchive
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => handleArchive(true)} color='primary'>
            <ArchiveIcon />
            &nbsp;Archive
          </IconButton>
        )}
        <IconButton onClick={handleOpenProducts} color='primary'>
          <AddCircleOutlineIcon />
          &nbsp;New Title
        </IconButton>
      </CardActions>

      <Box width={1}>
        <Collapse in={details} timeout='auto' unmountOnExit>
          <Grid
            container
            justify='flex-start'
            alignItems='flex-start'
            alignContent='flex-start'
          >
            {cart.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
                inCart={product}
              />
            ))}
          </Grid>
        </Collapse>
      </Box>

      <Modal
        id='edit'
        className={classes.modal}
        open={edit}
        onClose={handleEditClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={edit}>
          <div className={classes.paper}>
            <Box width={1}>
              <Grid>
                <TextField
                  className={classes.textFieldWide}
                  multiline={true}
                  variant='outlined'
                  name='customerName'
                  label='Name'
                  defaultValue={order.customerName ? order.customerName : ''}
                  onBlur={changeField}
                />
              </Grid>
              <Grid>
                <TextField
                  className={classes.textFieldWide}
                  multiline={true}
                  variant='outlined'
                  name='customerStreet'
                  label='Street Address'
                  defaultValue={
                    order.customerStreet ? order.customerStreet : ''
                  }
                  onBlur={changeField}
                />
              </Grid>
              <Grid>
                <TextField
                  className={classes.textFieldWide}
                  multiline={true}
                  variant='outlined'
                  name='customerCity'
                  label='City'
                  defaultValue={order.customerCity ? order.customerCity : ''}
                  onBlur={changeField}
                />
              </Grid>
              <Grid>
                <TextField
                  className={classes.textField}
                  multiline={true}
                  variant='outlined'
                  name='customerState'
                  label='State'
                  defaultValue={order.customerState ? order.customerState : ''}
                  onBlur={changeField}
                />
                <TextField
                  className={classes.textField}
                  multiline={true}
                  variant='outlined'
                  name='customerZip'
                  label='Zip'
                  defaultValue={order.customerZip ? order.customerZip : ''}
                  onBlur={changeField}
                />
              </Grid>
              <Grid>
                <TextField
                  className={classes.textFieldWide}
                  multiline={true}
                  variant='outlined'
                  name='customerPhone'
                  label='Phone'
                  defaultValue={order.customerPhone ? order.customerPhone : ''}
                  onBlur={changeField}
                />
              </Grid>
              <Grid>
                <TextField
                  className={classes.textFieldWide}
                  multiline={true}
                  variant='outlined'
                  name='customerEmail'
                  label='Email'
                  defaultValue={order.customerEmail ? order.customerEmail : ''}
                  onBlur={changeField}
                />
              </Grid>
            </Box>
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
                onClick={handleEditCancel}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                color='primary'
                style={{ margin: 20 }}
                onClick={handleEditSubmit}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Grid>
          </div>
        </Fade>
      </Modal>

      <Modal
        id='notes'
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
                  multiline={true}
                  variant='outlined'
                  name='instructions'
                  label='Customer Message'
                  defaultValue={order.instructions ? order.instructions : ''}
                  onBlur={changeField}
                />
              </Grid>
              <Grid>
                <TextField
                  className={classes.textFieldWide}
                  multiline={true}
                  variant='outlined'
                  name='notes'
                  label='Notes'
                  defaultValue={order.notes ? order.notes : ''}
                  onBlur={changeField}
                />
              </Grid>
            </Box>
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
                onClick={handleCancel}
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

      <Modal
        id='items'
        className={classes.modalScroll}
        open={openProducts}
        onClose={handleCloseProducts}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openProducts}>
          <div className={classes.paper}>
            <Grid
              container
              direction='row'
              justifyContent='flex-start'
              alignItems='flex-start'
              alignContent='flex-start'
            >
              {products.map(product => (
                <Grid item lg={3} md={4} sm={5} xs={12} key={product._id}>
                  <ProductCard
                    key={product._id}
                    product={product}
                    addToCart={addToCart}
                    inCart={cart[product._id]}
                    small={true}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </Fade>
      </Modal>
      
      <Dialog open={confirmDelete} onClose={handleConfirmDeleteClose}>
        <DialogTitle id='alert-dialog-title'>
          Are you sure you want to delete this order?
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
    </Card>
  )
}

export default connect(state => state)(OrderCard)
