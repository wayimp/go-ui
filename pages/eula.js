import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
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
  }
}))

const Page = () => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Container className={classes.root}>
      <AppBar position='sticky' color='default'>
        <Grid>
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => {
              setSelectedTab(newValue)
            }}
            indicatorColor='primary'
            variant='scrollable'
            scrollButtons='auto'
          >
            <img
              src='https://files.lifereferencemanual.net/go/logo.png'
              style={{ maxHeight: 60, margin: 10 }}
            />
            <Tab label='About' value={2} />
            <Tab label='Catalog' value={0} />
            <Tab label='Order' value={1} />
            <Tab label='Stories' value={3} />
            <Grid>
              <Typography style={{ margin: 10 }}>
                <CallIcon
                  color='primary'
                  style={{
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: -8
                  }}
                />
                {settings.business_phone}
                <br />
                <MailOutlineIcon
                  color='primary'
                  style={{
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: -8
                  }}
                />
                {settings.business_address}
              </Typography>
            </Grid>
          </Tabs>
        </Grid>
        <Grid className={classes.chips} onClick={() => setSelectedTab(1)}>
          {cartDisplay}
        </Grid>
      </AppBar>
    </Container>
  )
}

export default connect(state => state)(Page)
