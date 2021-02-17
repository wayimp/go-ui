import React, { useState, useEffect } from 'react'
import ProductCard from '../../components/ProductCardSummary'
import { axiosClient } from '../../src/axiosClient'
import { useSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { flatten } from 'lodash'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../../src/Link'
import TabPanel from '../../components/TabPanel'
import numeral from 'numeral'
const priceFormat = '$0.00'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMM DD hh:mm a'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import TableContainer from '@material-ui/core/TableContainer'
import Tooltip from '@material-ui/core/Tooltip'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import Modal from '@material-ui/core/Modal'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import { green, yellow, orange } from '@material-ui/core/colors'
import CallIcon from '@material-ui/icons/Call'
import MailOutlineIcon from '@material-ui/icons/MailOutline'

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  formGroup: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fafafa',
    border: '1px solid #ccc'
  },
  formGroupTop: {
    margin: 20,
    padding: 20
  },
  center: {
    textAlign: 'center'
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexGrow: 1,
    paddingRight: theme.spacing(5)
  },
  root: {
    padding: 0,
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
      orderBottom: '1px solid #ccc'
    }
  },
  nolines: {
    orderBottom: '2px solid white'
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
    top: '50%',
    left: '50%'
  },
  modalButton: {
    position: 'absolute',
    top: 6,
    left: 6,
    display: 'block',
    width: 'auto',
    height: 'auto'
  },
  button: {
    margin: theme.spacing(1)
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
  },
  iconButton: {
    margin: -2,
    padding: -2
  },
  tabPanel: {
    border: 1,
    backgroundColor: theme.palette.background.paper
  },
  img: {
    border: 1,
    margin: 5
  },
  gridListRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    height: 550,
    flexWrap: 'nowrap',
    transform: 'translateZ(0)'
  },
  titleBar: {
    background:
      'linear-gradient(to right, rgba(0,0,0,0.7) 0%, ' + 'rgba(0,0,0,0) 20%)'
  },
  icon: {
    color: 'white'
  },
  yellow: {
    color: '#fff8b2'
  },
  green: {
    color: '#00de74'
  },
  orange: {
    color: '#ffd55b'
  },
  logo: { height: 80, margin: 20 }
}))

const Order = ({ propsOrder, dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [order, setOrder] = React.useState(propsOrder)
  const { enqueueSnackbar } = useSnackbar()
  let quantity = 0
  let cases = 0
  let items = 0
  Object.entries(order.cart).map(([k, v], i) => {
    if (v && v.quantity) {
      quantity += v.quantity
    }
  })
  cases = Math.floor(quantity / 24)
  items = quantity % 24

  useEffect(() => {
    document.title = order.customerName
  })

  return (
    <Box width={1}>
      <Grid container direction='row' alignItems='flex-start'>
        <Grid container direction='row' alignItems='center' item xs={12}>
          <Link href='/' className={classes.title}>
            <img
              src='https://files.lifereferencemanual.net/go/logo.png'
              alt='Go Therefore Ministries'
              className={classes.logo}
            />
          </Link>
          <Typography style={{ marginTop: 10 }}>
            <a target='_top' rel='noopener noreferrer' href='tel:615.773.1963'>
              <IconButton color='primary'>
                <CallIcon />
              </IconButton>
            </a>
            615.773.1963
          </Typography>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Typography>
            <MailOutlineIcon
              color='primary'
              style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: -8
              }}
            />
            P.O. Box 2135 Mount Juliet, TN 37121
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Name:
                  </TableCell>
                  <TableCell align='left'>
                    {order.customerName ? order.customerName : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Address:
                  </TableCell>
                  <TableCell align='left'>
                    {order.customerStreet ? order.customerStreet : ''}
                    <br />
                    {order.customerCity ? order.customerCity : ''},&nbsp;
                    {order.customerState ? order.customerState : ''}&nbsp;
                    {order.customerZip ? order.customerZip : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Phone:
                  </TableCell>
                  <TableCell align='left'>
                    {order.customerPhone ? order.customerPhone : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Email:
                  </TableCell>
                  <TableCell align='left'>
                    {order.customerEmail ? order.customerEmail : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Donation:
                  </TableCell>
                  <TableCell align='left'>
                    {order.donation ? numeral(order.donation).format('$0') : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Total Bibles:
                  </TableCell>
                  <TableCell align='left'>{quantity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Total Cases:
                  </TableCell>
                  <TableCell align='left'>{cases}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Remainder:
                  </TableCell>
                  <TableCell align='left'>{items}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Order Note:
                  </TableCell>
                  <TableCell align='left'>
                    {order.instructions ? order.instructions : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' component='th' scope='row'>
                    Fulfillment Notes:
                  </TableCell>
                  <TableCell align='left'>
                    {order.notes ? order.notes : ''}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid
          item
          xs={4}
          container
          justify='flex-start'
          alignItems='flex-start'
          alignContent='flex-start'
        >
          {Object.entries(order.cart).map(([k, v], i) => {
            return <ProductCard key={k} product={v} />
          })}
        </Grid>
        <Grid item xs={4}>
          <Timeline>
            {order.timeline.map((workflow, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot />
                  {index < order.timeline.length - 1 ? (
                    <TimelineConnector />
                  ) : (
                    ''
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>{workflow.action}</Typography>
                  <Typography
                    className={
                      workflow.status === 1
                        ? classes.green
                        : workflow.status === 2
                        ? classes.orange
                        : ''
                    }
                  >
                    {workflow.status === 1
                      ? 'Completed'
                      : workflow.status === 2
                      ? 'Needs Attention'
                      : ''}
                  </Typography>
                </TimelineContent>
                <TimelineOppositeContent>
                  <Typography color='textSecondary'>
                    {moment(workflow.timestamp, dateFormat).format(dateDisplay)}
                  </Typography>
                </TimelineOppositeContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Grid>
      </Grid>
    </Box>
  )
}

export async function getServerSideProps (context) {
  const { id } = context.params

  const propsOrder = await axiosClient
    .get('/orders/' + id)
    .then(response => response.data)

  return {
    props: {
      propsOrder
    }
  }
}

export default connect(state => state)(Order)
