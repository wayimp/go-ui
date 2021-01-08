import React, { useState, useEffect } from 'react'
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
const dateDisplay = 'dddd MMMM DD'
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
    justifyContent: 'center'
  },
  section: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    margin: '5px',
    padding: '8px'
  }
}))

const Page = ({ dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [orders, setOrders] = React.useState([])
  const { enqueueSnackbar } = useSnackbar()

  const getData = () => {
    axiosClient({
      method: 'get',
      url: '/orders',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      setOrders(Array.isArray(response.data) ? response.data : [])
    })
  }

  const onFocus = () => {
    getData()
  }

  useEffect(() => {
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  })

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

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          {days.map(day => (
            <Card key={day} className={classes.section}>
              <h3>{day}</h3>
              <Grid
                container
                spacing={2}
                direction='row'
                justify='flex-start'
                alignItems='flex-start'
              >
                {ordersSorted
                  .filter(order => order.daySubmitted === day)
                  .map(order => (
                    <OrderCard key={order._id} order={order} />
                  ))}
              </Grid>
            </Card>
          ))}
        </div>
      </main>
    </Container>
  )
}

export default connect(state => state)(Page)
