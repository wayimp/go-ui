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
import Select from 'react-select'

const selectStyles = {
  menu: base => ({
    ...base,
    zIndex: 100
  }),
  menuList: base => ({
    ...base,
    position: 'fixed !important',
    backgroundColor: 'white',
    border: '1px solid lightgray',
    width: '20rem'
  })
}

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
    marginBottom: theme.spacing(2),
    overflow: 'visible'
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

const tierOptions = [
  {
    label: '$10/month',
    value: 'price_1IRJyFAjeiXrtrS7jGmpYfyR'
  },
  {
    label: '$25/month',
    value: 'price_1ISpurAjeiXrtrS7CDXC4F8i'
  },
  {
    label: '$50/month',
    value: 'price_1ISpv4AjeiXrtrS798gkTdWx'
  },
  {
    label: '$100/month',
    value: 'price_1IPBgDAjeiXrtrS7OnoVrIIx'
  },
  {
    label: '$150/month',
    value: 'price_1ISpvOAjeiXrtrS7y7HITrCx'
  },
  {
    label: '$200/month',
    value: 'price_1ISpw1AjeiXrtrS7UPCoAOhe'
  },
  {
    label: '$250/month',
    value: 'price_1ISpwNAjeiXrtrS7hp96xUK2'
  },
  {
    label: '$300/month',
    value: 'price_1ISpwcAjeiXrtrS7aV1bYujB'
  },
  {
    label: '$400/month',
    value: 'price_1ISpwrAjeiXrtrS7PZO5apmZ'
  },
  {
    label: '$500/month',
    value: 'price_1ISpx8AjeiXrtrS7eaPqGoNL'
  },
  {
    label: '$750/month',
    value: 'price_1ISpxQAjeiXrtrS7xV0YURfU'
  },
  {
    label: '$1000/month',
    value: 'price_1ISpxdAjeiXrtrS7BTWHLAOm'
  }
]

export default function Pricing () {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const stripe = useStripe()
  const [tier, setTier] = React.useState('')

  const handleTierChange = option => {
    setTier(option.value)
  }

  const createSubscription = async tier => {
    await axiosClient({
      method: 'post',
      url: '/subscriptions',
      data: { priceId: tier }
    })
      .then(response => {
        stripe.redirectToCheckout({
          sessionId: response.data.sessionId
        })
      })
      .catch(error => {
        enqueueSnackbar('Error Creating Subscription ' + error, {
          variant: 'error'
        })
        console.log(error)
      })
  }

  return (
    <Container maxWidth='md' component='main'>
      <Grid container spacing={5} justify='center'>
        <Grid item key={tier.title} xs={12} sm={6} md={4}>
          <Card>
            <CardHeader
              title='Recurring Donation'
              titleTypographyProps={{ align: 'center' }}
              subheaderTypographyProps={{ align: 'center' }}
              className={classes.cardHeader}
            />
            <CardContent>
              <div className={classes.cardPricing}>
                <Typography component='h2' variant='h3' color='textPrimary'>
                  Monthly Supporter
                </Typography>
              </div>
              <Select
                id='tier'
                name='tier'
                onChange={handleTierChange}
                options={tierOptions}
                styles={selectStyles}
              />
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant='outlined'
                color='primary'
                onClick={() => createSubscription(tier)}
              >
                Subscribe
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
