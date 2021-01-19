import React, { useEffect } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Link from '../src/Link'
import cookie from 'js-cookie'
import MenuIcon from '@material-ui/icons/Menu'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  Box,
  Tooltip
} from '@material-ui/core'

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
                  src='/images/logo.png'
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
                  <Link href='/books' className={classes.title}>
                    Books
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
              <Grid item xs={1}>
                <Typography variant='h6' noWrap>
                  <Link href='/quotes' className={classes.title}>
                    Quotes
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
