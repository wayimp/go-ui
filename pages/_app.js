import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../src/theme'
import App from 'next/app'
import { wrapper } from '../components/store'
import { SnackbarProvider } from 'notistack'
//import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
import './suneditor.css'
import './main.css'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

class goApp extends App {
  getInitialProps = async ({ Component, ctx }) => {

    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}),
        // Some custom thing for all pages
        pathname: ctx.pathname
      }
    }
  }

  render () {
    const { Component, pageProps } = this.props

    const stripePromise = loadStripe(
      'pk_live_51IJhVOAjeiXrtrS7LWuGpLxKsr8AvptV48hJs3ckgArxQHyrqlOSjEMuYoJrr3VeLJ0kHfoZ34cTOf8gWVG0PUIT00GwyFrQKF'
    )

    return (
      <>
        <Head>
          <title>Go Therefore Ministries</title>
          <meta
            name='viewport'
            content='minimum-scale=1, initial-scale=1, width=device-width'
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={9}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <Elements stripe={stripePromise}>
              <Component {...pageProps} />
            </Elements>
          </SnackbarProvider>
        </ThemeProvider>
      </>
    )
  }
}

export default wrapper.withRedux(goApp)
