import React from 'react'
import { connect } from 'react-redux'
import { axiosClient } from '../src/axiosClient'
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import clsx from 'clsx'
import { red } from '@material-ui/core/colors'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import LaunchIcon from '@material-ui/icons/Launch'
import CallIcon from '@material-ui/icons/Call'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd h:mm a'
import numeral from 'numeral'
const priceFormat = '$0.00'
import BookCard from '../components/BookCardSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'

Array.prototype.sum = function (prop) {
  let total = Number(0)
  for (let i = 0, _len = this.length; i < _len; i++) {
    total += Number(this && this[i] && this[i][prop] ? this[i][prop] : 0)
  }
  return total
}

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    margin: 6
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
  }
}))

const OrderCard = ({ propsOrder, workflows }) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [order, setOrder] = React.useState(propsOrder)
  const [expanded, setExpanded] = React.useState(false)

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
        enqueueSnackbar('Timeline updated', {
          variant: 'success'
        })
      })
      .catch(err => {
        enqueueSnackbar('There was a problem updating the timeline' + err, {
          variant: 'error'
        })
      })
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton>
            <Link href={`/order/${order._id}`} target={order._id}>
              <LaunchIcon />
            </Link>
          </IconButton>
        }
        title={order.customerName}
        subheader={
          <>
            <FormControlLabel
              control={<MonetizationOnIcon />}
              label={numeral(order.donation).format('0')}
              labelPlacement='end'
            />
            {moment(
              order.timeline ? order.timeline[0].timestamp : order.created
            )
              .tz('America/Chicago')
              .format(dateDisplay)}
          </>
        }
      />
      <CardContent>
        <Grid>
          <FormControlLabel
            control={
              <a
                target='_top'
                rel='noopener noreferrer'
                href={`tel:${order.customerPhone}`}
              >
                <IconButton color='primary'>
                  <CallIcon />
                </IconButton>
              </a>
            }
            label={order.customerPhone}
            labelPlacement='end'
          />
        </Grid>
        <Grid>
          <FormControlLabel
            control={
              <a
                target='_top'
                rel='noopener noreferrer'
                href={`mailto:${order.customerEmail}`}
              >
                <IconButton color='primary'>
                  <MailOutlineIcon />
                </IconButton>
              </a>
            }
            label={order.customerEmail}
            labelPlacement='end'
          />
        </Grid>
        {workflows.map(workflow => {
          if (
            order.timeline.map(step => step.action).includes(workflow.action)
          ) {
            return (
              <IconButton onClick={() => removeAction(workflow.action)}>
                <CheckCircleOutlineIcon />
                {workflow.action}
              </IconButton>
            )
          } else {
            return (
              <IconButton onClick={() => addAction(workflow.action)}>
                <RadioButtonUncheckedIcon />
                {workflow.action}
              </IconButton>
            )
          }
        })}
      </CardContent>

      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          {Object.values(order.cart).map(book => (
            <BookCard key={book.title} book={book} />
          ))}
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default connect(state => state)(OrderCard)
