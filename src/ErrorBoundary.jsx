import React from 'react'
import { Nav, Footer } from './ui.jsx'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    if (this.props.onError) this.props.onError(error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <main className="home">
          <Nav />
          <section className="notfound">
            <img src="/bazram-logo.webp" alt="Bazram Merdeka" />
            <h1>Something went wrong here.</h1>
            <p style={{ color: 'var(--muted)', marginBottom: 24, maxWidth: 480 }}>
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            <a className="button primary" href="/">Back home</a>
          </section>
          <Footer />
        </main>
      )
    }
    return this.props.children
  }
}
