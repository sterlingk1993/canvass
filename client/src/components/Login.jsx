import React, { Component } from 'react';

import { Route, Redirect } from 'react-router';
import { HashRouter as Router } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import {notify_error} from '../common.js';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Login extends Component {

  constructor(props) {
    super(props);

    let token;

    try {
      token = this.props.location.pathname.split('/').pop();
      jwt.decode(token);
      this.props.refer._loadData(token);
    } catch (e) {
      notify_error(e, 'Unable to extract jwt from URI');
      token = 'error';
    }

    this.state = {
      dev: (process.env.NODE_ENV === 'development'), // default to true if development
      classes: props.classes,
      token: token,
    };

  }

  render() {
    const { classes, token } = this.state;

    if (token && token !== "error")
      return (
        <Router>
          <Route render={() => (
            <Redirect to="/" />
          )} />
        </Router>
      );

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in to HelloVoterHQ
          </Typography>
          <form className={classes.form} onSubmit={(e) => { e.preventDefault(); this.props.refer.doSave(e, this.state.target); }} >
            {(process.env.NODE_ENV === 'development')?
              <FormControlLabel
                control={<Checkbox id="dev" name="dev" value="dev" color="primary" checked={this.state.dev} onChange={(e, c) => this.setState({dev: c})} />}
                label="DEVELOPMENT MODE"
              />
              :''}
              <div>
                {this.state.dev?
                ''
                :
                <div>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="domain">Server Address</InputLabel>
                    <Input id="server" name="server" autoComplete="server" autoFocus defaultValue={this.state.qserver} />
                  </FormControl>
                  <FormControlLabel
                    control={<Checkbox value="ack" color="primary" required />}
                    label="By checking this box you acknowledge that the server to which you are connecting is not affiliated with Our Voice USA and the data you send and receive is governed by that server's terms of use."
                  />
                </div>
                }
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => this.setState({target: 'google'})}
                >
                  Google Sign In
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => this.setState({target: 'facebook'})}
                  className={classes.submit}
                >
                  Facebook Sign In
                </Button>
              </div>
          </form>
        </Paper>
        <br />
        <center>Built with <span role="img" aria-label="Love">❤️</span> by Our Voice USA</center>
      </main>
    );
  }
}

export default withStyles(styles)(Login);
