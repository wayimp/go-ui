import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { axiosClient } from '../src/axiosClient'
import { connect } from 'react-redux'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TopBar from '../components/AdminTopBar'
import numeral from 'numeral'
const priceFormat = '$0.00'
import { flatten } from 'lodash'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMMM DD, YYYY'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'
import { DataGrid } from '@material-ui/data-grid'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import IconButton from '@material-ui/core/IconButton'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Tooltip from '@material-ui/core/Tooltip'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import Select from 'react-select'
import TextField from '@material-ui/core/TextField'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import PhoneMissedIcon from '@material-ui/icons/PhoneMissed'
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled'
import PhoneEnabledIcon from '@material-ui/icons/PhoneEnabled'
import VoicemailIcon from '@material-ui/icons/Voicemail'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import LaunchIcon from '@material-ui/icons/Launch'
import AssignmentIcon from '@material-ui/icons/Assignment'
import CancelIcon from '@material-ui/icons/Cancel'
import SaveIcon from '@material-ui/icons/Save'

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
  modalScroll: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    overflow: 'scroll',
    maxWidth: '80%',
    maxHeight: '80%',
    display: 'block'
  },
  modalNotes: {
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
    margin: 4,
    padding: 4
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
  const { enqueueSnackbar } = useSnackbar()
  const [bibles, setBibles] = useState([])
  const [showBibles, setShowBibles] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [invoice, setInvoice] = useState({})
  const [status, setStatus] = useState([])
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [productOptions, setProductOptions] = useState([])
  const [productSelected, setProductSelected] = useState('')
  const [searchString, setSearchString] = useState('')
  const [sortModel, setSortModel] = useState([
    { field: 'totalDonations', sort: 'desc' }
  ])

  const changeField = event => {
    setSearchString(event.target.value)
  }

  const search = () => {
    loadServerRows(0)
  }

  useEffect(() => {
    if (token && token.length > 0) {
      getProducts()
    } else {
      Router.push('/admin')
    }
  }, [])

  const getProducts = () => {
    axiosClient({
      method: 'get',
      url: '/products?showInactive=true',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      const result =
        response.data && Array.isArray(response.data) ? response.data : []
      const options = result
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(product => {
          return { value: product.qbName, label: product.title }
        })
      setProductOptions(options)
    })
  }

  const selectProduct = product => {
    if (product) {
      setProductSelected(product.value)
    } else {
      setProductSelected('')
    }
  }

  const handlePageChange = params => {
    setPage(params.page)
  }

  const displayBibles = b => {
    setBibles(b)
    setShowBibles(true)
  }

  const closeShowBibles = () => {
    setShowBibles(false)
  }

  const editInvoice = id => {
    const findInvoice = invoices.find(inv => inv._id === id)
    if (findInvoice.Contacts && findInvoice.Contacts.length > 0) {
      setInvoice(findInvoice)
      const notes = findInvoice.Contacts[0].timeline.map(step => step.action)
      setStatus(notes)
    } else {
      // Create a new contact record in the database
      axiosClient({
        method: 'get',
        url: `/contacts/${findInvoice.customerId}`
      })
        .then(response => {
          setInvoice({ ...findInvoice, Contacts: [response.data] })
          setStatus([])
        })
        .catch(error => {
          enqueueSnackbar('Error Creating Contact: ' + error, {
            variant: 'error'
          })
          console.log(error)
        })
    }
    setShowNotes(true)
  }

  const closeShowNotes = () => {
    setShowNotes(false)
  }

  const handleSubmit = () => {
    // Save in list and on the server
    const updatedInvoices = invoices.map(inv =>
      inv.customerId !== invoice.customerId ? inv : invoice
    )
    setInvoices(updatedInvoices)
    const contact = invoice.Contacts[0]

    axiosClient({
      method: 'patch',
      url: '/contacts',
      headers: { Authorization: `Bearer ${token}` },
      data: contact
    })
      .then(res => {
        enqueueSnackbar('Contact updated', {
          variant: 'success'
        })
      })
      .catch(err => {
        enqueueSnackbar('There was a problem updating the contact' + err, {
          variant: 'error'
        })
      })

    closeShowNotes()
  }

  const changeNotes = event => {
    const fieldValue = event.target.value
    const contact = invoice.Contacts[0]
    const updatedContact = { ...contact, notes: fieldValue }
    const updatedInvoice = { ...invoice, Contacts: [updatedContact] }
    setInvoice(updatedInvoice)
  }

  const changeStatus = (event, newStatus) => {
    // Remove from timeline if removed from toggle buttons
    const contact = invoice.Contacts[0]

    const updatedTimeline = contact.timeline.filter(entry =>
      newStatus.includes(entry.action)
    )
    const timelineStatus = updatedTimeline.map(entry => entry.action)
    // Add to timeline if added with toggle buttons
    newStatus.map(status => {
      if (!timelineStatus.includes(status)) {
        updatedTimeline.push({
          action: status,
          timestamp: moment().tz('America/Chicago')
        })
      }
    })
    const updatedStatus = updatedTimeline.map(step => step.action)
    setStatus(updatedStatus)
    const updatedContact = { ...contact, timeline: updatedTimeline }
    const updatedInvoice = { ...invoice, Contacts: [updatedContact] }
    setInvoice(updatedInvoice)
  }

  const renderStatus = (id, contacts) => {
    const statusIcons = [
      <Tooltip title='Edit Notes'>
        <IconButton color='primary' onClick={() => editInvoice(id)}>
          <LaunchIcon />
        </IconButton>
      </Tooltip>
    ]

    if (contacts && contacts.length > 0) {
      if (contacts[0].notes) {
        statusIcons.push(
          <Tooltip title='Notes'>
            <AssignmentIcon />
          </Tooltip>
        )
      }

      const missed = contacts[0].timeline.find(step => step.action === 'Missed')
      if (missed) {
        statusIcons.push(
          <Tooltip title='Missed'>
            <PhoneMissedIcon />
          </Tooltip>
        )
      }
      const disabled = contacts[0].timeline.find(
        step => step.action === 'Disabled'
      )
      if (disabled) {
        statusIcons.push(
          <Tooltip title='Do Not Call'>
            <PhoneDisabledIcon />
          </Tooltip>
        )
      }

      const called = contacts[0].timeline.find(step => step.action === 'Called')
      if (called) {
        statusIcons.push(
          <Tooltip title='Called'>
            <PhoneEnabledIcon />
          </Tooltip>
        )
      }

      const voicemail = contacts[0].timeline.find(
        step => step.action === 'Voicemail'
      )
      if (voicemail) {
        statusIcons.push(
          <Tooltip title='Left Voicemail'>
            <VoicemailIcon />
          </Tooltip>
        )
      }

      const emailed = contacts[0].timeline.find(
        step => step.action === 'Emailed'
      )
      if (emailed) {
        statusIcons.push(
          <Tooltip title='Emailed'>
            <MailOutlineIcon />
          </Tooltip>
        )
      }

      const donated = contacts[0].timeline.find(
        step => step.action === 'Donated'
      )
      if (donated) {
        statusIcons.push(
          <Tooltip title='Donation Received'>
            <AttachMoneyIcon />
          </Tooltip>
        )
      }
    }
    return <Grid>{statusIcons}</Grid>
  }

  const columns = [
    {
      field: 'customerName',
      headerName: 'Name',
      width: 200,
      sortable: false,
      renderCell: params => (
        <span>
          <Tooltip title='Open in QuickBooks'>
            <IconButton color='primary'>
              <Link
                href={`https://c72.qbo.intuit.com/app/customerdetail?nameId=${params.row.customerId}`}
                target='_blank'
              >
                <AccountBoxIcon />
              </Link>
            </IconButton>
          </Tooltip>
          {params.value}
        </span>
      )
    },
    {
      field: 'recent',
      headerName: 'Contact',
      type: 'date',
      width: 150
    },
    {
      field: 'totalBibles',
      headerName: 'Bibles',
      type: 'number',
      renderCell: params => (
        <span>
          <Tooltip title='Show Details'>
            <IconButton
              color='primary'
              onClick={() => displayBibles(params.getValue('bibles'))}
            >
              <MenuBookIcon />
            </IconButton>
          </Tooltip>
          {params.value}
        </span>
      ),
      width: 120
    },
    {
      field: 'totalDonations',
      headerName: 'Donations',
      type: 'number',
      width: 120,
      renderCell: params => numeral(params.value).format('$0')
    },
    { field: 'customerCity', headerName: 'City', width: 160, sortable: false },
    {
      field: 'customerState',
      headerName: 'State',
      width: 110,
      sortable: false
    },
    {
      field: 'customerZip',
      headerName: 'Zip',
      width: 110,
      sortable: false,
      hide: true
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'string',
      renderCell: params => (
        <span>
          {renderStatus(params.getValue('_id'), params.getValue('Contacts'))}
        </span>
      ),
      width: 240
    }
  ]

  const loadServerRows = (page, sortModelCurrent) => {
    let url = `/invoices?page=${page}`
    if (productSelected && productSelected.length > 0) {
      url += `&code=${productSelected}`
    }
    if (searchString && searchString.length > 0) {
      url += `&search=${searchString}`
    }
    if (sortModelCurrent) {
      url += `&field=${sortModelCurrent[0].field}&sort=${sortModelCurrent[0].sort}`
    } else if (sortModel) {
      url += `&field=${sortModel[0].field}&sort=${sortModel[0].sort}`
    }

    axiosClient({
      method: 'get',
      url,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      setTotalCount(response.data.count)
      setInvoices(response.data.invoices)
    })
  }

  const handleSortModelChange = params => {
    if (params.sortModel !== sortModel) {
      setSortModel(params.sortModel)
      loadServerRows(0, params.sortModel)
    }
  }

  useEffect(() => {
    let active = true

    ;(async () => {
      setLoading(true)
      const newRows = await loadServerRows(page)

      if (!active) {
        return
      }

      setLoading(false)
    })()

    return () => {
      active = false
    }
  }, [page])

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Grid container spacing={1} justify='space-between'>
            <Grid item xs={4}>
              <Select
                style={{ marginBottom: 4 }}
                id='products'
                className='itemsSelect'
                classNamePrefix='select'
                onChange={selectProduct}
                name='products'
                options={productOptions}
                isClearable={true}
                isSearchable={true}
              />
            </Grid>
            <Grid item>
              <TextField
                className={classes.textField}
                variant='outlined'
                name='searchString'
                label='Search String'
                onChange={changeField}
              />
            </Grid>
            <Grid>
              <Button variant='outlined' color='primary' onClick={search}>
                Search
              </Button>
            </Grid>
          </Grid>
          <div style={{ display: 'flex', minHeight: 780 }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                rows={invoices}
                columns={columns}
                pagination
                pageSize={20}
                rowCount={totalCount}
                paginationMode='server'
                onPageChange={handlePageChange}
                loading={loading}
                sortingMode='server'
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
              />
            </div>
          </div>
        </div>
      </main>
      <Modal
        id='edit'
        className={classes.modalScroll}
        open={showBibles}
        onClose={closeShowBibles}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={showBibles}>
          <div className={classes.paper}>
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
                onClick={closeShowBibles}
              >
                Ok
              </Button>
            </Grid>
            <Box width={1}>
              <List dense={true}>
                {bibles.map((bible, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      {bible.SalesItemLineDetail.Qty}
                    </ListItemAvatar>
                    <ListItemText>{bible.Description}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        </Fade>
      </Modal>
      <Modal
        id='notes'
        className={classes.modalNotes}
        open={showNotes}
        onClose={closeShowNotes}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={showNotes}>
          <div className={classes.paper}>
            <Box width={1}>
              <Grid>
                <ToggleButtonGroup onChange={changeStatus} value={status}>
                  <ToggleButton value='Missed'>
                    <PhoneMissedIcon />
                  </ToggleButton>
                  <ToggleButton value='Disabled'>
                    <PhoneDisabledIcon />
                  </ToggleButton>
                  <ToggleButton value='Called'>
                    <PhoneEnabledIcon />
                  </ToggleButton>
                  <ToggleButton value='Voicemail'>
                    <VoicemailIcon />
                  </ToggleButton>
                  <ToggleButton value='Emailed'>
                    <MailOutlineIcon />
                  </ToggleButton>
                  <ToggleButton value='Donated'>
                    <AttachMoneyIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid>
                <TextField
                  className={classes.textFieldWide}
                  multiline={true}
                  variant='outlined'
                  name='notes'
                  label='Notes'
                  defaultValue={
                    invoice.Contacts && invoice.Contacts[0]
                      ? invoice.Contacts[0].notes
                      : ''
                  }
                  onBlur={changeNotes}
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
                onClick={closeShowNotes}
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
    </Container>
  )
}

export default connect(state => state)(Page)
