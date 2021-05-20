import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { axiosClient, baseURL } from '../src/axiosClient'
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
import Select from 'react-select'
import Tooltip from '@material-ui/core/Tooltip'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'

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
  const [year, setYear] = useState(moment().year())
  const [bookValue, setBookValue] = useState(1)
  const [yearOptions, setYearOptions] = useState([])

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
      field: 'totalDonations',
      headerName: 'Donations',
      type: 'number',
      width: 120,
      renderCell: params => numeral(params.value).format('$0')
    },
    {
      field: 'totalBibles',
      headerName: 'Bibles',
      type: 'number',
      width: 120,
      renderCell: params => numeral(params.value).format('0')
    },
    {
      field: 'bookValue',
      headerName: 'Value',
      type: 'number',
      width: 120,
      renderCell: params =>
        numeral(params.row.totalBibles * bookValue).format('$0')
    },
    {
      field: 'pdf',
      headerName: 'PDF',
      width: 50,
      sortable: false,
      renderCell: params => (
        <span>
          <Tooltip title='Generate PDF'>
            <IconButton color='primary'>
              <Link
                href={`${baseURL}/pdf/${params.row.customerId}/${year}/${
                  params.row.totalDonations
                }/${params.row.totalBibles * bookValue}`}
                target='_blank'
              >
                <PictureAsPdfIcon />
              </Link>
            </IconButton>
          </Tooltip>
          {params.value}
        </span>
      )
    }
  ]

  const getData = () => {
    let url = `/yearly/${year}/${bookValue}`

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
      const thisYear = moment().year()
      const years = []
      for (let year = thisYear; year > thisYear - 10; year--) {
        years.push({ value: year, label: year })
      }
      setYearOptions(years)
    } else {
      Router.push('/admin')
    }
  }, [])

  const changeField = event => {
    setBookValue(Number(event.target.value))
  }

  const selectYear = year => {
    if (year) {
      setYear(year.value)
    } else {
      setYear(moment().year())
    }
  }

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
                id='years'
                className='itemsSelect'
                classNamePrefix='select'
                onChange={selectYear}
                name='years'
                options={yearOptions}
                isSearchable={true}
                defaultValue={yearOptions[0]}
              />
            </Grid>
            <Grid item>
              <Input
                className={classes.textField}
                type='number'
                variant='outlined'
                name='bookValue'
                label='Book Value'
                defaultValue={bookValue}
                onChange={changeField}
              />
            </Grid>
            <Grid>
              <Button variant='outlined' color='primary' onClick={getData}>
                Go
              </Button>
            </Grid>
          </Grid>
          <div style={{ display: 'flex', minHeight: 780 }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                rows={invoices}
                columns={columns}
                pagination
                pageSize={100}
              />
            </div>
          </div>
        </div>
      </main>
    </Container>
  )
}

export default connect(state => state)(Page)
