import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ReactPlayer from 'react-player'

const useStyles = makeStyles(theme => ({
  playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%' /* Player ratio: 100 / (1280 / 720) */,
    minWidth: 720
  },
  reactPlayer: {
    position: 'relative',
    left: 0,
    top: 0,
    transform: 'none'
  }
}))

const BlockDisplay = ({ block }) => {
  {
    const classes = useStyles()

    if (block.html.endsWith('mp4'))
      return (
        <ReactPlayer
          url={block.html}
          width='100%'
          height='100%'
          controls={true}
        />
      )
    else return <ReactPlayer url={block.html}  />
  }
}

export default BlockDisplay
