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
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Input from '@material-ui/core/Input'

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
  },
  textField: {
    margin: theme.spacing(1),
    padding: 2
  }
}))

const tiers = [
  {
    title: 'One-Time Donation',
    price: '15',
    description: ['5 Bibles ($3 each)'],
    buttonText: 'Donate',
    buttonVariant: 'outlined'
  },
  {
    title: 'One-Time Donation',
    price: '60',
    description: ['20 Bibles ($3 each)'],
    buttonText: 'Donate',
    buttonVariant: 'outlined'
  },
  {
    title: 'One-Time Donation',
    price: '300',
    description: ['100 Bibles ($3 each)'],
    buttonText: 'Donate',
    buttonVariant: 'outlined'
  }
]

export default function Pricing () {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const stripe = useStripe()
  const [amount, setAmount] = React.useState(10)

  const createDonation = async price => {
    await axiosClient({
      method: 'post',
      url: '/donation',
      data: { amount: price }
    })
      .then(response => {
        stripe.redirectToCheckout({
          sessionId: response.data.sessionId
        })
      })
      .catch(error => {
        enqueueSnackbar('Error with Donation ' + error, {
          variant: 'error'
        })
        console.log(error)
      })
  }

  return (
    <React.Fragment>
      <Container maxWidth='md' component='main'>
        <Grid container spacing={5} alignItems='flex-end'>
          {tiers.map((tier, ti) => (
            <Grid item key={ti} xs={12} sm={6} md={3}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography component='h2' variant='h3' color='textPrimary'>
                      ${tier.price}
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
                    onClick={() => createDonation(tier.price)}
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardHeader
                title='One-Time Donation'
                subheader='Enter Amount'
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <FormControl>
                    <InputLabel htmlFor='donation'>Donation Amount</InputLabel>
                    <Input
                      id='donation'
                      className={classes.textField}
                      variant='outlined'
                      name='donation'
                      label='Donation Amount'
                      defaultValue={amount}
                      onChange={event => setAmount(event.target.value)}
                      type='number'
                      startAdornment={
                        <InputAdornment position='start'>$</InputAdornment>
                      }
                    />
                  </FormControl>
                </div>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant='outlined'
                  color='primary'
                  onClick={() => createDonation(amount)}
                >
                  Donate
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}
