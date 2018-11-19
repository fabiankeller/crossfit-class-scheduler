import React, { Component } from 'react';
import firebase from 'firebase';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';

class SubscribeForm extends Component {

    state = {
        email: {
            value: '',
            valid: false,
            initial: true,
        },
        fullName: {
            value: '',
            valid: false,
            initial: true,
        },
        password: {
            value: '',
            valid: false,
            initial: true,
        },
        repeatPassword: {
            value: '',
            valid: false,
            initial: true,
        },
        formState: {
            valid: false,
            message: '',
        },
        subscriptionSuccessful: false,
    }

    resetState = () => {
        const emptyStateObject = {
            value: '',
            valid: false,
            initial: true,
        }
        this.setState({
            email: emptyStateObject,
            fullName: emptyStateObject,
            password: emptyStateObject,
            repeatPassword: emptyStateObject,
            formState: {
                valid: false,
                message: '',
            }
        });
    }

    handleSubscribtion = () => {
        if (!this.state.email.valid) {
            this.setState({ formState: { valid: false, message: 'Please provide an email address.' }});
            return;
        } else if (!this.state.fullName.valid) {
            this.setState({ formState: { valid: false, message: 'Please provide a full name.' }});
            return;
        }  else if ((!this.state.password.valid && !this.state.repeatPassword.valid) 
                    || this.state.password.value !== this.state.repeatPassword.value) {
            this.setState({ formState: { valid: false, message: 'Passwords do not match. Please check again.' }});
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(this.state.email.value, this.state.password.value)
            .then(() => {
                const currentUser = firebase.auth().currentUser;
                
                // Workaround with logout and login because we need the displayName in the header and only get notified when login.
                currentUser.updateProfile({
                    displayName: this.state.fullName.value,
                })
                .then(() => {
                    firebase.auth().signOut().then(() => {
                        firebase.auth().signInWithEmailAndPassword(this.state.email.value, this.state.password.value)
                            .then(() => {
                                this.closeForm();
                            })
                            .catch((error) => {
                                this.setState({ formState: { valid: false, message: error.message }});
                                this.setState({ subscriptionSuccessful: true });
                                this.resetState();
                                this.props.closeForm();
                            });
                      })
                })
                .catch(error => {
                    throw error;
                });
            })
            .catch((error) => {
                this.setState({ formState: { valid: false, message: error.message }});
            });
    }

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

    changeFullName = (event) => {
        const fullName = event.target.value;
        this.setState({
            fullName: {
                value: fullName,
                valid: !!fullName,
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
    }

    changeRepeatPassword = (event) => {
        const repeatPassword = event.target.value;
        this.setState({
            repeatPassword: {
                value: repeatPassword,
                valid: !!repeatPassword,
                initial: false,
            }
        });
    }

    closeSnackbar = () => {
        this.setState({ subscriptionSuccessful: false });
    }

    closeForm = () => {
        this.resetState();
        this.props.closeForm();
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.closeForm}
                    aria-labelledby='form-dialog-title'>
                    <DialogTitle id='form-dialog-title'>Subscribe</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
                            error={!this.state.email.initial && !this.state.email.valid}
                            margin='dense'
                            id='email'
                            label='Email Address'
                            type='email'
                            fullWidth
                            value={this.state.email.value} 
                            onChange={this.changeEmail}
                        />
                        <TextField
                            required
                            error={!this.state.fullName.initial && !this.state.fullName.valid}
                            margin='dense'
                            id='fullname'
                            label='Full name'
                            type='text'
                            fullWidth
                            value={this.state.fullName.value} 
                            onChange={this.changeFullName}
                        />
                        <TextField
                            required
                            error={!this.state.password.initial && !this.state.password.valid}
                            margin='dense'
                            id='password'
                            label='Passwort'
                            type='password'
                            fullWidth
                            value={this.state.password.value} 
                            onChange={this.changePassword}
                        />
                        <TextField
                            required
                            error={!this.state.repeatPassword.initial && !this.state.repeatPassword.valid}
                            margin='dense'
                            id='repeat-password'
                            label='Confirm Passwort'
                            type='password'
                            fullWidth
                            value={this.state.repeatPassword.value} 
                            onChange={this.changeRepeatPassword}
                        />
                        {this.state.formState.valid || (
                            <Typography color='error' className={classes.errorMessage}>
                                { this.state.formState.message }
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeForm} color='primary'>
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubscribtion} color='primary'>
                            Subscribe
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    ContentProps={{
                        classes: {
                            root: classes.successMessage
                        }
                    }}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={this.state.subscriptionSuccessful}
                    onClose={this.closeSnackbar}
                    TransitionComponent={Fade}
                    message={<span id='successMessageId'>Subscription successful. You can now login with your Email and Password.</span>}
                />
            </div>
        );
    }
}

const styles = theme => ({
    errorMessage: {
      marginTop: theme.spacing.unit * 2
    },
    successMessage: {
        background: green[600]
    }
  });

export default withStyles(styles)(SubscribeForm);