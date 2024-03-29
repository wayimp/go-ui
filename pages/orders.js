import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Router from 'next/router'
import { axiosClient } from '../src/axiosClient'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import { getLangString } from '../components/Lang'
import Link from '../src/Link'
import TopBar from '../components/AdminTopBar'
import numeral from 'numeral'
const priceFormat = '$0.00'
import OrderCard from '../components/OrderCard'
import { flatten } from 'lodash'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd, MMMM DD, YYYY'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
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
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'
import SearchIcon from '@material-ui/icons/Search'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Checkbox from '@material-ui/core/Checkbox'
import Select from 'react-select'
import CancelIcon from '@material-ui/icons/Cancel'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import MenuOpenIcon from '@material-ui/icons/MenuOpen'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import Pagination from '@material-ui/lab/Pagination'
import { green } from '@material-ui/core/colors'

const formatDate = date => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
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
  section: {
    backgroundColor: '#EDDCD2',
    border: '1px solid #AAA',
    margin: '5px',
    padding: '8px'
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
    overflowY: 'visible',
    minHeight: '55vh'
  }
}))

const Page = ({ dispatch, token, workflows, products, settings }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [orders, setOrders] = React.useState([])
  const [customers, setCustomers] = React.useState([])
  const [customerDialog, setCustomerDialog] = React.useState(false)
  const [customer, setCustomer] = React.useState({})
  const [orderInfo, setOrderInfo] = React.useState({})
  const { enqueueSnackbar } = useSnackbar()
  const [showInactive, setShowInactive] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [confirmUseQuickBooks, setConfirmUseQuickBooks] = React.useState(false)
  const [confirmUseOrder, setConfirmUseOrder] = React.useState(false)
  const [page, setPage] = React.useState(1)

  const changeShowInactive = event => {
    if (event && event.target) {
      const { checked } = event.target
      setShowInactive(checked)
      setPage(1)
    }
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  useEffect(() => {
    getOrders()
  }, [showInactive, page])

  const handleOpenDialog = order => {
    setOrderInfo(order)
    setCustomer({})
    setCustomerDialog(true)
  }

  const handleCloseDialog = () => {
    setOrderInfo({})
    setCustomer({})
    setCustomerDialog(false)
  }

  const selectCustomer = customer => {
    setCustomer(customer)
  }

  const getData = () => {
    getOrders()
    getCustomers()
  }

  const getOrders = () => {
    let url = showInactive ? '/orders?showInactive=true' : '/orders'
    url += showInactive ? `&pageNo=${page}` : `?pageNo=${page}`
    if (search && search.length > 0) {
      url += `&search=${search}`
    }

    axiosClient({
      method: 'get',
      url,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      setOrders(Array.isArray(response.data) ? response.data : [])
    })
  }

  const getCustomers = () => {
    axiosClient({
      method: 'get',
      url: '/customers',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      let result =
        response.data && Array.isArray(response.data) ? response.data : []
      result = result.map(customer => ({
        ...customer,
        label:
          customer.GivenName +
          ' ' +
          customer.FamilyName +
          (customer.CompanyName ? ` (${customer.CompanyName})` : '')
      }))
      setCustomers(result)
    })
  }

  const searchOrders = () => {
    const url = showInactive
      ? `/orders?showInactive=true&search=${search}`
      : `/orders?search=${search}`

    axiosClient({
      method: 'get',
      url,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      setOrders(Array.isArray(response.data) ? response.data : [])
    })
  }

  /*
  const onFocus = () => {
    getData()
  }

  useEffect(() => {
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  })
*/
  const ordersSorted = orders
    .map(order => ({
      ...order,
      daySubmitted: moment(
        order.timeline ? order.timeline[0].timestamp : order.created,
        dateFormat
      ).format(dateDisplay)
    }))
    .sort(function (a, b) {
      const dateA = new Date(a.timeline[0].timestamp),
        dateB = new Date(b.timeline[0].timestamp)
      return dateB - dateA
    })

  const days = Array.isArray(ordersSorted)
    ? [...new Set(ordersSorted.map(order => order.daySubmitted))]
    : []

  useEffect(() => {
    if (token && token.length > 0) {
      getData()
    } else {
      Router.push('/admin')
    }
  }, [token])

  const updateOrderInfo = () => {
    const updated = {
      ...orderInfo,
      customerName: customer.GivenName + ' ' + customer.FamilyName,
      customerStreet: customer.ShipAddr.Line1,
      customerCity: customer.ShipAddr.City,
      customerState: customer.ShipAddr.CountrySubDivisionCode,
      customerZip: customer.ShipAddr.PostalCode,
      customerPhone: customer.PrimaryPhone.FreeFormNumber,
      customerEmail: customer.PrimaryEmailAddr.Address
    }

    setOrderInfo(updated)

    setConfirmUseQuickBooks(false)

    axiosClient
      .patch('/orders', updated)
      .then(res => {
        enqueueSnackbar('Order updated', {
          variant: 'success'
        })
        getOrders()
      })
      .catch(err => {
        enqueueSnackbar('There was a problem updating the order' + err, {
          variant: 'error'
        })
      })
  }

  const updateQuickBooks = () => {
    const splitName = orderInfo.customerName.split(' ')
    const firstName = splitName[0]
    const lastName = splitName[splitName.length - 1]
    const updated = {
      ...customer,
      GivenName: firstName,
      FamilyName: lastName,
      ShipAddr: {
        Line1: orderInfo.customerStreet ? orderInfo.customerStreet.trim() : '',
        City: orderInfo.customerCity ? orderInfo.customerCity.trim() : '',
        CountrySubDivisionCode: orderInfo.customerState
          ? orderInfo.customerState.trim()
          : '',
        PostalCode: orderInfo.customerZip ? orderInfo.customerZip.trim() : ''
      },
      BillAddr: {
        Line1: orderInfo.customerName,
        Line2: orderInfo.customerStreet ? orderInfo.customerStreet.trim() : '',
        Line3:
          (orderInfo.customerCity ? orderInfo.customerCity.trim() : '') +
          ',' +
          (orderInfo.customerState ? orderInfo.customerState.trim() : '') +
          ' ' +
          (orderInfo.customerZip ? orderInfo.customerZip.trim() : ''),
        Line4: ''
      },
      PrimaryPhone: { FreeFormNumber: orderInfo.customerPhone },
      PrimaryEmailAddr: { Address: orderInfo.customerEmail }
    }

    delete updated.label // Quickbooks chokes if you give it extra properties

    setCustomer(updated)

    setConfirmUseOrder(false)

    axiosClient({
      method: 'patch',
      url: '/customers',
      data: updated,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        enqueueSnackbar('QuickBooks updated', {
          variant: 'success'
        })
      })
      .catch(err => {
        enqueueSnackbar('There was a problem updating QuickBooks ' + err, {
          variant: 'error'
        })
      })
  }

  const createQuickBooksCustomer = () => {
    let firstName = orderInfo?.customerName || ''
    let lastName = orderInfo?.customerName || ''
    const spacePosition = orderInfo?.customerName?.indexOf(' ')
    if (spacePosition > 0) {
      firstName = orderInfo.customerName
        .split(' ')
        .slice(0, -1)
        .join(' ')
      lastName = orderInfo.customerName
        .split(' ')
        .slice(-1)
        .join(' ')
    }

    const newCustomer = {
      Taxable: false,
      GivenName: firstName,
      FamilyName: lastName,
      Notes: 'Created from web order',
      DisplayName: orderInfo.customerName,
      PrintOnCheckName: orderInfo.customerName,
      CompanyName: orderInfo.customerCompany,
      Active: true,
      BillAddr: {
        Line1: orderInfo.customerStreet,
        City: orderInfo.customerCity,
        CountrySubDivisionCode: orderInfo.customerState,
        PostalCode: orderInfo.customerZip
      },
      ShipAddr: {
        Line1: orderInfo.customerStreet,
        City: orderInfo.customerCity,
        CountrySubDivisionCode: orderInfo.customerState,
        PostalCode: orderInfo.customerZip
      },
      PrimaryPhone: { FreeFormNumber: orderInfo.customerPhone },
      PrimaryEmailAddr: { Address: orderInfo.customerEmail },
      CurrencyRef: {
        value: 'USD',
        name: 'United States Dollar'
      },
      PreferredDeliveryMethod: 'Print'
    }

    axiosClient({
      method: 'patch',
      url: '/customers',
      data: newCustomer,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        enqueueSnackbar('QuickBooks updated', {
          variant: 'success'
        })
        if (res.data) {
          setCustomers(customers.concat(res.data))
          setCustomer(res.data)
        }
      })
      .catch(err => {
        enqueueSnackbar('There was a problem updating QuickBooks ' + err, {
          variant: 'error'
        })
      })
  }

  const createQuickBooksInvoice = () => {
    const splitName = orderInfo.customerName.split(' ')
    const firstName = splitName[0]
    const lastName = splitName[splitName.length - 1]
    const date = moment().tz('America/Chicago')
    const dueDate = moment(date).add(1, 'M')

    const newInvoice = {
      AllowIPNPayment: true,
      AllowOnlinePayment: true,
      AllowOnlineCreditCardPayment: true,
      AllowOnlineACHPayment: true,
      TxnDate: formatDate(date),
      DueDate: formatDate(dueDate),
      TotalAmt: Number(orderInfo.donation),
      ApplyTaxAfterDiscount: false,
      CustomerRef: {
        value: customer.Id,
        name: customer.DisplayName
      },
      CustomerMemo: {
        value: settings.customer_memo
      },
      Balance: Number(orderInfo.donation),
      BillAddr: {
        Line1: orderInfo.customerName,
        Line2: orderInfo.customerStreet ? orderInfo.customerStreet.trim() : '',
        Line3:
          (orderInfo.customerCity ? orderInfo.customerCity.trim() : '') +
          ', ' +
          (orderInfo.customerState ? orderInfo.customerState.trim() : '') +
          ' ' +
          (orderInfo.customerZip ? orderInfo.customerZip.trim() : ''),
        Line4: ''
      },
      ShipAddr: {
        Line1: orderInfo.customerStreet ? orderInfo.customerStreet.trim() : '',
        City: orderInfo.customerCity ? orderInfo.customerCity.trim() : '',
        CountrySubDivisionCode: orderInfo.customerState
          ? orderInfo.customerState.trim()
          : '',
        PostalCode: orderInfo.customerZip ? orderInfo.customerZip : ''
      },
      BillEmail: { Address: orderInfo.customerEmail },
      CurrencyRef: {
        value: 'USD',
        name: 'United States Dollar'
      },
      Line: []
    }

    // Count the total number of Bibles to assign an arbitrary rate to match the donation amount
    let totalQty = 0
    let rate = 0
    Object.entries(orderInfo.cart).forEach(([key, value]) => {
      totalQty += value.quantity
    })
    if (totalQty > 0) {
      rate = Number(orderInfo.donation) / totalQty || 0.0
    }

    Object.entries(orderInfo.cart).forEach(([key, value]) => {
      newInvoice.Line.push({
        Description: value.title,
        Amount: value.quantity * rate,
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: {
            value: value.qbId,
            name: value.qbName
          },
          UnitPrice: rate,
          Qty: value.quantity
        }
      })
    })

    axiosClient({
      method: 'patch',
      url: '/invoice',
      data: newInvoice,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        enqueueSnackbar('QuickBooks invoice created', {
          variant: 'success'
        })
        const link = `https://app.qbo.intuit.com/app/invoice?txnId=${res.data.Invoice.Id}`
        window.open(link)
      })
      .catch(err => {
        enqueueSnackbar('There was a problem updating QuickBooks ' + err, {
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
            <FormControl variant='outlined'>
              <InputLabel>Name</InputLabel>
              <OutlinedInput
                id='search'
                value={search}
                onChange={event => setSearch(event.target.value)}
                startAdornment={
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
            <Button
              variant='contained'
              color='secondary'
              style={{ margin: 20 }}
              onClick={searchOrders}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
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
              label='Show Archived'
            />
          </Grid>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Pagination count={10} page={page} onChange={handlePageChange} />
          </Grid>
          <Box width={1}>
            {ordersSorted.length === 0 ? (
              <h2>Nothing Here</h2>
            ) : (
              days.map(day => (
                <Card key={day} className={classes.section}>
                  <h3>{day}</h3>
                  <Grid
                    container
                    spacing={1}
                    justify='center'
                    alignItems='flex-start'
                  >
                    {ordersSorted
                      .filter(order => order.daySubmitted === day)
                      .map(order => (
                        <OrderCard
                          key={order._id}
                          propsOrder={order}
                          workflows={workflows}
                          products={products}
                          getData={getOrders}
                          showInactive={showInactive}
                          handleOpenDialog={handleOpenDialog}
                        />
                      ))}
                  </Grid>
                </Card>
              ))
            )}
          </Box>
        </div>
      </main>
      <Dialog
        id='selectCustomer'
        maxWidth={'md'}
        fullHeight={true}
        open={customerDialog}
        onClose={handleCloseDialog}
        classes={{
          paperFullWidth: classes.dialogPaper
        }}
      >
        <DialogTitle>
          Select Customer from QuickBooks{' '}
          {orderInfo.customerName ? 'to Match: ' + orderInfo.customerName : ''}
        </DialogTitle>
        <DialogContent
          classes={{
            root: classes.dialogPaper
          }}
        >
          <Select
            id='customers'
            instanceId='customers'
            styles={selectStyles}
            className='customersSelect'
            classNamePrefix='select'
            isClearable={true}
            isSearchable={true}
            name='customers'
            options={customers}
            onChange={selectCustomer}
          />

          {customer && customer.GivenName ? (
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell />
                  <TableCell align='left' component='th' scope='row'>
                    <Button
                      variant='contained'
                      color='secondary'
                      style={{ margin: 10 }}
                      onClick={() => setConfirmUseQuickBooks(true)}
                      startIcon={
                        <MenuOpenIcon style={{ transform: 'rotate(180deg)' }} />
                      }
                    >
                      Use QuickBooks Info
                    </Button>
                  </TableCell>
                  <TableCell align='left' component='th' scope='row'>
                    <Button
                      variant='contained'
                      color='secondary'
                      style={{ margin: 10 }}
                      onClick={() => setConfirmUseOrder(true)}
                      startIcon={<MenuOpenIcon />}
                    >
                      Use Order Info
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Name:
                  </TableCell>
                  <TableCell align='left'>
                    {customer.GivenName && customer.FamilyName
                      ? customer.GivenName + ' ' + customer.FamilyName
                      : ''}
                    <Tooltip title='Open in QuickBooks'>
                      <IconButton color='primary'>
                        <Link
                          href={`https://c72.qbo.intuit.com/app/customerdetail?nameId=${customer.Id}`}
                          target={customer.Id}
                        >
                          <AccountBoxIcon />
                        </Link>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align='left'>
                    {orderInfo.customerName ? orderInfo.customerName : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Address:
                  </TableCell>
                  <TableCell align='left'>
                    {customer && customer.ShipAddr && customer.ShipAddr.Line1
                      ? customer.ShipAddr.Line1
                      : ''}
                    <br />
                    {customer && customer.ShipAddr && customer.ShipAddr.City
                      ? customer.ShipAddr.City
                      : ''}
                    ,&nbsp;
                    {customer &&
                    customer.ShipAddr &&
                    customer.ShipAddr.CountrySubDivisionCode
                      ? customer.ShipAddr.CountrySubDivisionCode
                      : ''}
                    &nbsp;
                    {customer &&
                    customer.ShipAddr &&
                    customer.ShipAddr.PostalCode
                      ? customer.ShipAddr.PostalCode
                      : ''}
                  </TableCell>
                  <TableCell align='left'>
                    {orderInfo.customerStreet ? orderInfo.customerStreet : ''}
                    <br />
                    {orderInfo.customerCity ? orderInfo.customerCity : ''}
                    ,&nbsp;
                    {orderInfo.customerState ? orderInfo.customerState : ''}
                    &nbsp;
                    {orderInfo.customerZip ? orderInfo.customerZip : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Phone:
                  </TableCell>
                  <TableCell align='left'>
                    {customer &&
                    customer.PrimaryPhone &&
                    customer.PrimaryPhone.FreeFormNumber
                      ? customer.PrimaryPhone.FreeFormNumber
                      : ''}
                  </TableCell>
                  <TableCell align='left'>
                    {orderInfo.customerPhone ? orderInfo.customerPhone : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Email:
                  </TableCell>
                  <TableCell align='left'>
                    {customer &&
                    customer.PrimaryEmailAddr &&
                    customer.PrimaryEmailAddr.Address
                      ? customer.PrimaryEmailAddr.Address
                      : ''}
                  </TableCell>
                  <TableCell align='left'>
                    {orderInfo.customerEmail ? orderInfo.customerEmail : ''}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            ''
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            style={{ margin: 10 }}
            onClick={() => createQuickBooksCustomer()}
            startIcon={<AddCircleOutlineIcon />}
          >
            Create New Customer
          </Button>
          <Button
            variant='contained'
            color='secondary'
            style={{ margin: 10 }}
            onClick={() => createQuickBooksInvoice()}
            startIcon={<AddCircleOutlineIcon />}
          >
            Create New Invoice
          </Button>
          <Button
            variant='contained'
            color='primary'
            style={{ margin: 10 }}
            onClick={handleCloseDialog}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmUseQuickBooks}
        onClose={() => setConfirmUseQuickBooks(false)}
      >
        <DialogTitle>
          This will replace the Order info with QuickBooks info.
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setConfirmUseQuickBooks(false)}
            color='secondary'
          >
            Cancel
          </Button>
          <Button color='primary' autoFocus onClick={updateOrderInfo}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmUseOrder} onClose={() => setConfirmUseOrder(false)}>
        <DialogTitle>
          This will update the QuickBooks info with the Order info.
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmUseOrder(false)} color='secondary'>
            Cancel
          </Button>
          <Button color='primary' autoFocus onClick={updateQuickBooks}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export async function getServerSideProps (context) {
  const workflows = await axiosClient
    .get('/workflows')
    .then(response => response.data)
  const products = await axiosClient
    .get('/products')
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
      workflows,
      products,
      settings
    }
  }
}

export default connect(state => state)(Page)
