import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import parse from 'html-react-parser'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}))

const BlockDisplay = ({ block }) => {
  {
    const classes = useStyles()

    return (
      <div className='se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable'>
        {parse(block.html)}
      </div>
    )
  }
}

export default BlockDisplay
