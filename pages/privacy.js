import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { axiosClient } from '../src/axiosClient'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import parse from 'html-react-parser'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

const Form = ({ settings }) => {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <div className={classes.paper}>{parse(settings.privacy_policy)}</div>
    </Container>
  )
}

export async function getServerSideProps (context) {
  const settings = {}
  const settingsArray = await axiosClient
    .get('/settingsPublic')
    .then(response => response.data)
  settingsArray.map(setting => {
    settings[setting.name] = setting.value
  })

  return {
    props: {
      settings
    }
  }
}

export default connect(state => state)(Form)
