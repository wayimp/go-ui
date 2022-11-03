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
    backgroundColor: 'transparent'
  }
}))

const BlockDisplay = ({ blocks, category }) => {
  {
    const classes = useStyles()

    return (
      <Box width={1} className={classes.root}>
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
    )
  }
}

export default BlockDisplay
