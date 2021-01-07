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
import BookIcon from '@material-ui/icons/Book'
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
  segmentSelect: {
    minWidth: 200
  },
  smallField: {
    maxWidth: 140,
    padding: theme.spacing(1)
  },
  root: {
    maxWidth: 400,
    margin: 10,
    overflow: 'visible'
  },
  media: {
    height: 300
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
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
    padding: theme.spacing(2)
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
    flexDirection: 'column'
  },
  cardActions: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  }
}))

const BookDisplay = ({ book, addToCart, inCart }) => {
  {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    let caseDisplay = []
    let quantity = 0
    let cases = 0
    let items = 0
    let modulo = 0
    let keyIndex = 0
    if (inCart) {
      quantity = inCart.quantity
      modulo = quantity % 24
      cases = Math.floor(quantity / 24)
      items = quantity % 24
    }
    for (let c = 0; c < cases; c++) {
      caseDisplay.push(
        <Chip
          key={keyIndex++}
          variant='outlined'
          label='24'
          onDelete={() => addToCart(book, -24)}
          color='primary'
        />
      )
    }
    if (items > 0) {
      caseDisplay.push(
        <Chip
          key={keyIndex++}
          variant='outlined'
          label={items}
          onDelete={() => addToCart(book, -items)}
          color='primary'
        />
      )
    }

    return (
      <Grid item lg={3} md={4} sm={5} xs={12} key={book._id}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={book.image || ''}
            title={book.title || ''}
          />
          <CardContent>
            <Typography variant='h6' component='span'>
              {book.title}
            </Typography>
            <div className={classes.chips}>{caseDisplay}</div>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Tooltip title={quantity >= 24 ? 'Add even case lots' : ''}>
              <span>
                <Button
                  size='large'
                  variant='outlined'
                  color='primary'
                  onClick={e => {
                    e.preventDefault
                    addToCart(book, 1)
                  }}
                  disabled={quantity >= 24 ? true : false}
                >
                  Add One
                </Button>
              </span>
            </Tooltip>
            <Button
              size='large'
              variant='outlined'
              color='primary'
              onClick={e => {
                e.preventDefault
                addToCart(book, 24 - modulo)
              }}
            >
              Add Case of 24
            </Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }
}

export default BookDisplay
