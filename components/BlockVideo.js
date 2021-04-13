import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import YouTube from 'react-youtube'

const BlockDisplay = ({ block }) => {
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  }

  const onReady = event => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }

  return <YouTube videoId={block.html} onReady={onReady} />
}

export default BlockDisplay
