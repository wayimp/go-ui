import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import numeral from 'numeral'
import { LabelDivider } from 'mui-label-divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import RemoveIcon from '@material-ui/icons/Remove'
import MinimizeIcon from '@material-ui/icons/Minimize'

import { useSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
  root: {
    margin: 40,
    overflow: 'visible'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  content: {
    display: 'flex',
    margin: 40
  },
  mirror: {
    transform: [{ scaleX: -1 }]
  }
}))

const QuoteDisplay = ({ quote }) => {
  {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()

    return (
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Grid
              container
              direction='column'
              justify='center'
              alignItems='center'
            >
              <Typography component='h5'
                variant='h5' >
                <FormatQuoteIcon className={classes.mirror} />
                {quote.text}
                <FormatQuoteIcon />
              </Typography>
              <Typography
                component='h5'
                variant='h5'
                style={{ marginLeft: 200 }}
              >
                <i><RemoveIcon /> {quote.author}<br/>{quote.location}</i>
              </Typography>
            </Grid>
          </CardContent>
        </div>
      </Card>
    )
  }
}

export default QuoteDisplay
