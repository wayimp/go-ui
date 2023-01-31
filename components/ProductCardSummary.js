import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import numeral from 'numeral'
import { LabelDivider } from 'mui-label-divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import Chip from '@material-ui/core/Chip'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ViewComfyIcon from '@material-ui/icons/ViewComfy'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DeleteIcon from '@material-ui/icons/Delete'
import ListAltIcon from '@material-ui/icons/ListAlt'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 100,
    margin: 10,
    overflow: 'visible'
  },
  media: {
    height: 150
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  field: {
    padding: theme.spacing(1)
  },
  thumb: {
    maxWidth: 200,
    maxHeight: 200,
    margin: 20
  },
  card: {
    maxWidth: 400,
    margin: 10,
    overflow: 'visible',
    height: '98%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  cardActions: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  media: {
    height: 300,
    position: 'relative'
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  root: {
    display: 'flex',
    margin: 10
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: 151,
    padding: '6rem'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  }
}))

const ProductDisplay = ({ product }) => {
  {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    let caseDisplay = []
    let { quantity } = product
    let cases = Math.floor(quantity / 24)
    let items = quantity % 24
    let modulo = quantity % 24
    let keyIndex = 0
    for (let c = 0; c < cases; c++) {
      caseDisplay.push(
        <Chip key={keyIndex++} variant='outlined' label='24' color='primary' />
      )
    }
    if (items > 0) {
      caseDisplay.push(
        <Chip
          key={keyIndex++}
          variant='outlined'
          label={items}
          color='primary'
        />
      )
    }

    return (
      <Card className={classes.root} style={{ maxWidth: 400 }}>
        <CardMedia
          className={classes.cover}
          image={product.image || ''}
          title={product.title || ''}
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <div className={classes.chips}>{caseDisplay}</div>
            <Typography component='h3' variant='h3'>
              {product.title}
            </Typography>
          </CardContent>
        </div>
      </Card>
    )
  }
}

export default ProductDisplay
