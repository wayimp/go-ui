import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import StarIcon from '@material-ui/icons/StarBorder'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { axiosClient } from '../src/axiosClient'
import { useSnackbar } from 'notistack'
import { loadStripe } from '@stripe/stripe-js'
import { useStripe } from '@stripe/react-stripe-js'

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: 'wrap'
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6)
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[700]
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2)
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    }
  }
}))

const tiers = [
  {
    title: 'Subscriber',
    price: '0',
    priceId: 'price_1IOAdqAjeiXrtrS70x2HMNOK',
    description: ['Email Subscription', 'Prayer Support'],
    buttonText: 'Subscribe',
    buttonVariant: 'outlined'
  },
  {
    title: 'Supporter',
    price: '9',
    priceId: 'price_1IO7lmAjeiXrtrS7v1nBix52',
    description: [
      'Email Subscription',
      'Prayer Support',
      '3 Bibles per month ($3 each)'
    ],
    buttonText: 'Support',
    buttonVariant: 'contained'
  },
  {
    title: 'Partner',
    subheader: 'Provide More Bibles',
    price: '30',
    priceId: 'price_1IO7ngAjeiXrtrS7xmoCUt1I',
    description: [
      'Email Subscription',
      'Prayer Support',
      '10 Bibles per month ($3 each)'
    ],
    buttonText: 'Partner',
    buttonVariant: 'outlined'
  }
]

export default function Pricing () {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const stripe = useStripe()

  const createSubscription = async tier => {
    await axiosClient({
      method: 'post',
      url: '/subscriptions',
      data: { priceId: tier.priceId }
    })
      .then(response => {
        stripe
          .redirectToCheckout({
            sessionId: response.data.sessionId
          })
          .then(
            enqueueSnackbar('Subscription Created', {
              variant: 'success'
            })
          )
      })
      .catch(error => {
        enqueueSnackbar('Error Creating Subscription ' + error, {
          variant: 'error'
        })
        console.log(error)
      })
  }

  return (
    <React.Fragment>
      <Container maxWidth='sm' component='main' className={classes.heroContent}>
        <Typography
          component='h1'
          variant='h2'
          align='center'
          color='textPrimary'
          gutterBottom
        >
          Partner with Us
        </Typography>
        <Typography
          variant='h5'
          align='center'
          color='textSecondary'
          component='p'
        >
          Your donations help to place the Word of God with precious souls.
          Please consider partnering with us to further this meaningful work.
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth='md' component='main'>
        <Grid container spacing={5} alignItems='flex-end'>
          {tiers.map(tier => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  action={tier.title === 'Pro' ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography component='h2' variant='h3' color='textPrimary'>
                      ${tier.price}
                    </Typography>
                    <Typography variant='h6' color='textSecondary'>
                      /mo
                    </Typography>
                  </div>
                  <ul>
                    {tier.description.map(line => (
                      <Typography
                        component='li'
                        variant='subtitle1'
                        align='center'
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant}
                    color='primary'
                    onClick={() => createSubscription(tier)}
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  )
}
