import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import CardContent from '@material-ui/core/CardContent'
import BlockVideo from './BlockVideo'
import BlockText from './BlockText'

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'visible'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  content: {
    display: 'flex'
  },
  mirror: {
    transform: [{ scaleX: -1 }]
  }
}))

const BlockDisplay = ({ blocks, category }) => {
  {
    const classes = useStyles()

    return (
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Box width={1}>
              <Grid>
                {blocks.map(block => {
                  if (block.category === category) {
                    if (block.type === 'video')
                      return <BlockVideo key={block._id} block={block} />
                    else return <BlockText key={block._id} block={block} />
                  } else return ''
                })}
              </Grid>
            </Box>
          </CardContent>
        </div>
      </Card>
    )
  }
}

export default BlockDisplay
