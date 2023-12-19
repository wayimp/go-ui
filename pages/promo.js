import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { axiosClient } from '../src/axiosClient'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import parse from 'html-react-parser'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(() => ({
    frontPanel: {
        margin: 0,
        flexGrow: 1,
        background: "url('https://files.lifereferencemanual.net/go/gobanner.jpg')"
    }
}))

const Promo = () => {
    const classes = useStyles()

    return (
        <Container >
            <div style={{
                backgroundImage: 'url(/promo.png)',
                backgroundColor: '#325e9a',
                backgroundPosition: 'center',
                backgroundSize: 'auto 98%',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh',
                cursor: 'pointer'
            }} 
            onClick={(e) => {
                e.preventDefault();
                window.location.href='/?t=1';
                }}
            />
        </Container>
    )
}

export default connect(state => state)(Promo)
