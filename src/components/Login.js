import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN } from '../constants';

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  };

  _confirm = async () => {
    const {
      name, email, password, login,
    } = this.state;
    if (login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      });
      const { token } = result.data.login;
      this._saveUserData(token);
    } else {
      const result = await this.props.signupMutation({
        variables: {
          name,
          email,
          password,
        },
      });
      const { token } = result.data.signup;
      this._saveUserData(token);
    }
    this.props.history.push('/');
  };

  _saveUserData = (token) => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  _onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  _toggleLogin = () => {
    this.setState({ login: !this.state.login });
  };

  render() {
    return (
      <div>
        <h4 className="mv3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
        <div className="flex flex-column">
          {!this.state.login && (
            <input
              value={this.state.name}
              name="name"
              onChange={this._onChange}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            name="email"
            value={this.state.email}
            onChange={this._onChange}
            type="text"
            placeholder="Your email address"
          />
          <input
            name="password"
            value={this.state.password}
            onChange={this._onChange}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <div className="pointer mr2 button" onClick={this._confirm}>
            {this.state.login ? 'login' : 'create account'}
          </div>
          <div className="pointer button" onClick={this._toggleLogin}>
            {this.state.login ? 'need to create an account?' : 'already have an account?'}
          </div>
        </div>
      </div>
    );
  }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login);
