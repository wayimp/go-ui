import React, { useEffect } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Link from '../src/Link'
import cookie from 'js-cookie'
import MenuIcon from '@material-ui/icons/Menu'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  logo: {
    width: 'auto',
    height: 'auto',
    margin: 20,
    maxWidth: 200
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    },
    color: 'white'
  }
}))

export default function SearchAppBar () {
  const classes = useStyles()
  const router = useRouter()
  let roles

  useEffect(() => {
    roles = cookie.get('roles')
  }, [])

  const reset = () => {
    cookie.remove('token')
    router.push('/')
  }

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Box width={1}>
            <Grid container direction='row' alignItems='center'>
              <Grid item xs={4}>
                <img
                  src='https://files.lifereferencemanual.net/go/logo.png'
                  alt='Go Therefore Ministries'
                  className={classes.logo}
                  onClick={reset}
                />
              </Grid>
              <Grid item xs={1}>
                <Typography variant='h6' noWrap>
                  <Link href='/orders' className={classes.title}>
                    Orders
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='h6' noWrap>
                  <Link href='/products' className={classes.title}>
                    Products
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='h6' noWrap>
                  <Link href='/blocks' className={classes.title}>
                    Blocks
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='h6' noWrap>
                  <Link href='/clients' className={classes.title}>
                    Clients
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='h6' noWrap>
                  <Link href='/monthly' className={classes.title}>
                    Monthly
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='h6' noWrap>
                  <Link href='/users' className={classes.title}>
                    Users
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='h6' noWrap>
                  <Link href='/workflows' className={classes.title}>
                    Workflow
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='h6' noWrap>
                  <Link href='/settings' className={classes.title}>
                    Settings
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}
