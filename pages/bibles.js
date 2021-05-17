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
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

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
  const [productOptions, setProductOptions] = useState([])
  const [productSelected, setProductSelected] = useState('')

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

  const getData = () => {
    let url = '/bibles'

    if (productSelected && productSelected.length > 0) {
      url += `?code=${productSelected}`
    }

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
      getProducts()
    } else {
      Router.push('/admin')
    }
  }, [])

  const selectProduct = product => {
    if (product) {
      setProductSelected(product.value)
    } else {
      setProductSelected('')
    }
  }

  const search = () => {
    getData()
  }

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Grid container spacing={1} justify='space-between'>
            <Grid>
              <h3>Total Bibles by Month</h3>
            </Grid>
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

            <Grid>
              <Button variant='outlined' color='primary' onClick={search}>
                Filter
              </Button>
            </Grid>
          </Grid>
          <BarChart width={1100} height={700} data={invoices}>
            <XAxis dataKey='month' stroke='#8884d8' />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
            <Bar dataKey='total' fill='#8884d8' />
          </BarChart>
        </div>
      </main>
    </Container>
  )
}

export default connect(state => state)(Page)
