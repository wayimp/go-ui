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
        <div style={{
            backgroundImage: 'url(/Capitol.png)',
            backgroundColor: '#345e9a',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh'
        }}
        >
            <div style={{ textAlign: 'center', paddingTop: '2%' }}>
                <img src="/Influencer.png" style={{ width: '50%' }}
                />
            </div>

            <div style={{ textAlign: 'center', marginTop: '2%' }}>
                <img src="/Beacon.png" style={{ width: '50%' }}
                />
            </div>

            <img src="/Anniversary.png" style={{ float: 'left', marginLeft: '10%', width: '20%', cursor: 'pointer' }}
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/?t=1';
                }} />

            <img src="/Cover.png" style={{ float: 'right', marginRight: '10%', width: '20%', cursor: 'pointer' }}
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/?t=1';
                }}
            />

            <img src="/Logo.png" style={{ float: 'center', width: '40%', cursor: 'pointer', marginTop: 50 }}
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/?t=1';
                }}
            />

        </div>
    )
}

export default connect(state => state)(Promo)
