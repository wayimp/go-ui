import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import YouTube from 'react-youtube'
import Typography from '@material-ui/core/Typography'

const BlockDisplay = ({ block }) => {
  const opts = {
    width: '400',
    height: '225'
  }

  const onReady = event => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }

  return <div style={{textAlign: 'center'}}>
    <Typography variant="h6" component="h6" color="secondary" style={{ fontFamily: 'Georgia' }}>
        {block.description}          
    </Typography>
    <YouTube videoId={block.html} opts={opts} onReady={onReady} />
  </div>
}

export default BlockDisplay
