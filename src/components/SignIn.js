import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import ErrorMessage from './Error'
import Utils from '../Utils'
import '../css/Session.scss'

export default class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      isSignIn: false,
      errors: [],
    }
  }

  handleSignIn = () => {
    const { email, password } = this.state
    const url = Utils.buildRequestUrl('/sessions')
    const params = {
      email,
      password,
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { result, token, errors } = res
        if (result) {
          localStorage.setItem('token', token)
          this.setState({ isSignIn: true })
        } else {
          this.setState({ errors })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  emailOnChange = (event) => {
    const email = event.target.value
    this.setState({ email })
  }

  passwordOnChange = (event) => {
    const password = event.target.value
    this.setState({ password })
  }

  render() {
    const {
      email,
      password,
      isSignIn,
      errors,
    } = this.state

    return (
      isSignIn ? <Redirect to="/reach" /> : (
        <div className="background">
          <div className="session">
            <div className="session__title">Sign in to Reach</div>
            {errors.length !== 0 && <ErrorMessage action="Authentication" errors={errors} />}
            <input
              type="text"
              className="session__email"
              placeholder="Email"
              value={email}
              onChange={this.emailOnChange}
            />
            <input
              type="password"
              className="session__password"
              placeholder="Password"
              value={password}
              onChange={this.passwordOnChange}
            />
            <button type="button" onClick={this.handleSignIn} className="session__submit">
              Sign In
            </button>
            <Link to="/reach/signup" className="session__switch">Create account</Link>
          </div>
        </div>
      )
    )
  }
}