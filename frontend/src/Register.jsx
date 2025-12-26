import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { Button, TextField, Link } from '@mui/material';
import { withRouter } from './utils';
import axios from 'axios';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: '',
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = () => {
    const { username, password, confirm_password } = this.state;

    if (password !== confirm_password) {
      Swal.fire({ title: 'Passwords do not match', icon: 'error' });
      return;
    }

    axios
      .post('http://localhost:2000/register', { username, password })
      .then((res) => {
        Swal.fire({
          title: res.data.title,
          icon: 'success',
        });
        this.props.navigate('/');
      })
      .catch((err) => {
        Swal.fire({
          title: err.response?.data?.errorMessage || 'Registration failed',
          icon: 'error',
        });
      });
  };

  render() {
    const { username, password, confirm_password } = this.state;

    return (
      <div style={{ marginTop: '200px' }}>
        <h2>Register</h2>

        <TextField
          type="text"
          autoComplete="off"
          name="username"
          value={username}
          onChange={this.onChange}
          placeholder="User Name"
          required
          variant="outlined"
          margin="normal"
        />
        <br />

        <TextField
          type="password"
          autoComplete="off"
          name="password"
          value={password}
          onChange={this.onChange}
          placeholder="Password"
          required
          variant="outlined"
          margin="normal"
        />
        <br />

        <TextField
          type="password"
          autoComplete="off"
          name="confirm_password"
          value={confirm_password}
          onChange={this.onChange}
          placeholder="Confirm Password"
          required
          variant="outlined"
          margin="normal"
        />
        <br />

        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={!username || !password}
          onClick={this.register}
          sx={{ mt: 2, mr: 2 }}
        >
          Register
        </Button>

        <Link
          component="button"
          underline="none"
          sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}
          onClick={() => this.props.navigate('/')}
        >
          Login
        </Link>
      </div>
    );
  }
}

export default withRouter(Register);
