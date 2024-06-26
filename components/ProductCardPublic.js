import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import numeral from 'numeral'
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
    minWidth: 300,
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
    objectFit: 'cover'
  },
  limitedIcon: {
    position: 'absolute',
    top: 6,
    left: 0,
    display: 'block',
    width: 'auto',
    height: 'auto'
  },
  newIcon: {
    position: 'absolute',
    top: 6,
    left: 6,
    display: 'block',
    width: 'auto',
    height: 'auto'
  },
  saleIcon: {
    position: 'absolute',
    top: 0,
    right: 10,
    display: 'block',
    width: 'auto',
    height: 'auto'
  },
  constitutionIcon: {
    position: 'absolute',
    top: 250,
    left: 0,
    display: 'block',
    width: '100%',
    height: 'auto'
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

const ProductDisplay = ({ product, addToCart, inCart, small }) => {
  {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    let caseDisplay = []
    let quantity = 0
    let cases = 0
    let items = 0
    let modulo = 0
    let keyIndex = 0
    let caseDivisor = product.title.includes('Vida') ? 20 : 24

    if (inCart) {
      quantity = inCart.quantity
      modulo = quantity % caseDivisor
      cases = Math.floor(quantity / caseDivisor)
      items = quantity % caseDivisor
    }
    for (let c = 0; c < cases; c++) {
      caseDisplay.push(
        <Chip
          key={keyIndex++}
          variant='outlined'
          label={caseDivisor}
          onDelete={() => addToCart(product, -caseDivisor)}
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
          onDelete={() => addToCart(product, -items)}
          color='primary'
        />
      )
    }

    return (
      <Card className={classes.card} key={product._id}>
        <CardMedia
          className={classes.media}
          image={product.image || ''}
          title={product.title || ''}
          style={{ height: small ? 100 : 300, width: small ? 100 : 300}}
        />
        {product.limited ? (
          <img
            src={'https://files.lifereferencemanual.net/go/LimitedStock.png'}
            className={classes.limitedIcon}
          />
        ) : (
          ''
        )}
         {product.title.includes("America") ? (
          <img
            src={'./sale.png'}
            className={classes.saleIcon}
          />
        ) : (
          ''
        )}
        {product.new ? (
          <img
            src={'https://files.lifereferencemanual.net/go/new.png'}
            className={classes.newIcon}
          />
        ) : (
          ''
        )}
        {product.constitution ? (
          <img
            src={'https://files.lifereferencemanual.net/go/constitution.png'}
            className={classes.constitutionIcon}
          />
        ) : (
          ''
        )}
        <CardContent>
          <Typography variant='h6' component='span'>
            {product.title}
          </Typography>
          <div className={classes.chips}>{caseDisplay}</div>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Tooltip
            title={
              quantity >= (caseDivisor * 2)
                ? `Please order an even number of cases (multiples of ${caseDivisor * 2})`
                : ''
            }
          >
            <span>
              <Button
                size='large'
                variant='outlined'
                color='primary'
                onClick={e => {
                  e.preventDefault
                  addToCart(product, 1)
                }}
                disabled={quantity >= (caseDivisor * 2) ? true : false}
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
              addToCart(product, caseDivisor - modulo)
            }}
          >
            {`Add Case of ${caseDivisor}`}
          </Button>
        </CardActions>
      </Card>
    )
  }
}

export default ProductDisplay
