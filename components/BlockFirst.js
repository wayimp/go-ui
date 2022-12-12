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

        const filtered = blocks.filter(b => b.category === category)

        let block = null;

        if (filtered) {
            block = filtered[0];
        }

        return (
            <Box width={1} className={classes.root}>
                    {(block)
                        ?
                        (block.type === 'video') ? <BlockVideo key={block._id} block={block} /> : <BlockText key={block._id} block={block} />
                        : ''
                    }
            </Box>
        )
    }
}

export default BlockDisplay
