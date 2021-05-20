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
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import Select from 'react-select'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

var currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

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
  const { enqueueSnackbar } = useSnackbar()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [bibles, setBibles] = useState([])
  const [showBibles, setShowBibles] = useState(false)

  const displayBibles = b => {
    setBibles(b)
    setShowBibles(true)
  }

  const closeShowBibles = () => {
    setShowBibles(false)
  }

  const getData = () => {
    let url = '/monthly'

    axiosClient({
      method: 'get',
      url,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      setInvoices(response.data)
    })
  }

  useEffect(() => {
    if (token && token.length > 0) {
      getData()
    } else {
      Router.push('/admin')
    }
  }, [])

  const columns = [
    {
      field: 'id',
      headerName: 'Month',
      type: 'date',
      width: 150
    },
    {
      field: 'totalDonations',
      headerName: 'Donations',
      type: 'currency',
      width: 150,
      renderCell: params => <span>{currency.format(params.value)}</span>
    },
    {
      field: 'outstandingBalance',
      headerName: 'Balance',
      type: 'currency',
      width: 150,
      renderCell: params => <span>{currency.format(params.value)}</span>
    },
    {
      field: 'totalBibles',
      headerName: 'Bibles',
      type: 'number',
      width: 150,
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
      )
    }
  ]

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Grid>
            <h3>Monthly Totals</h3>
          </Grid>
          <div style={{ display: 'flex', minHeight: 780 }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                rows={invoices}
                columns={columns}
                pageSize={12}
                pagination
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
                    <ListItemAvatar>{bible[1]}</ListItemAvatar>
                    <ListItemText>{bible[0]}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        </Fade>
      </Modal>
    </Container>
  )
}

export default connect(state => state)(Page)
