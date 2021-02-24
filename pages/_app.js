import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
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
    const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh')

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
      'pk_test_51IJhVOAjeiXrtrS76TNXsMZKbYsXIjlZ12vR6Eyb4T9kWmmCwRFsK31O1dZ6Qjr7wmirHBKyIND7o0DTmPqlGbsO00PlrZZ8ai'
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
