import React, { Component } from 'react';
import firebase from 'firebase';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

class LoginForm extends Component {

    state = {
        email: {
            value: '',
            valid: false,
            initial: true,
        },
        password: {
            value: '',
            valid: false,
            initial: true,
        },
        formState: {
            valid: false,
            message: '',
        }
    }

    resetState = () => {
        const emptyStateObject = {
            value: '',
            valid: false,
            initial: true,
        };
        this.setState({
            email: emptyStateObject,
            password: emptyStateObject,
            formState: {
                valid: false,
                message: '',
            }
        });
    }

    handleLogin = () => {
        if (!this.state.email.valid) {
            this.setState({ formState: { valid: false, message: 'Please provide an email address.' }});
            return;
        } else if(!this.state.password.valid) {
            this.setState({ formState: { valid: false, message: 'Please provide a password.' }});
            return;
        }
        firebase.auth().signInWithEmailAndPassword(this.state.email.value, this.state.password.value)
            .then(() => {
                console.log('login successful');
                this.closeForm();
            })
            .catch((error) => {
                this.setState({ formState: { valid: false, message: error.message }});
            });
    };

    changeEmail = (event) => {
        const email = event.target.value;
        this.setState({
            email: {
                value: email,
                valid: !!email,
                initial: false,
            }
        });
    }

    changePassword = (event) => {
        const password = event.target.value;
        this.setState({
            password: {
                value: password,
                valid: !!password,
                initial: false,
            }
        });
    };

    closeForm = () => {
        this.resetState();
        this.props.closeForm();
    }

    render() {
        const { classes } = this.props;
        return (
            <Dialog
                open={this.props.open}
                onClose={this.closeForm}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Login</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        error={!this.state.email.initial && !this.state.email.valid}
                        required
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={this.state.email.value} 
                        onChange={this.changeEmail}
                    />
                    <TextField
                        error={!this.state.password.initial && !this.state.password.valid}
                        required
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        value={this.state.password.value} 
                        onChange={this.changePassword}
                        onKeyPress={ev => {
                            if (ev.key === 'Enter') {
                                this.handleLogin(ev);
                            }
                        }}
                    />
                    {this.state.formState.valid || (
                        <Typography color='error' className={classes.errorMessage}>
                            { this.state.formState.message }
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeForm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleLogin} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const styles = theme => ({
    errorMessage: {
        marginTop: theme.spacing.unit * 2
    },
  });

export default withStyles(styles)(LoginForm);
