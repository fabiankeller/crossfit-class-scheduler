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
import uuidv1 from "uuid/v1";
import moment from "moment";
import * as ROLES from '../../constantes/roles'

class SubscribeForm extends Component {

    state = {
        email: {
            value: '',
            valid: false,
            initial: true,
        },
        firstName: {
            value: '',
            valid: false,
            initial: true,
        },
        lastName: {
            value: '',
            valid: false,
            initial: true,
        },
        street:{
            value: '',
            valid: false,
            initial: true,
        },
        houseNumber:{
            value: '',
            valid: false,
            initial: true,
        },
        plz:{
            value: '',
            valid: false,
            initial: true,
        },
        place:{
            value: '',
            valid: false,
            initial: true,
        },
        dateOfBirth:{
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
            firstName: emptyStateObject,
            lastName: emptyStateObject,
            stree: emptyStateObject,
            houseNumber: emptyStateObject,
            plz: emptyStateObject,
            place: emptyStateObject,
            dateOfBirth: emptyStateObject,
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
        } else if (!this.state.firstName.valid || !this.state.lastName.valid) {
            this.setState({ formState: { valid: false, message: 'Please provide a full name.' }});
            return;
        } else if ((!this.state.password.valid && !this.state.repeatPassword.valid)
                    || this.state.password.value !== this.state.repeatPassword.value) {
            this.setState({ formState: { valid: false, message: 'Passwords do not match. Please check again.' }});
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(this.state.email.value, this.state.password.value)
            .then(() => {
                this.saveMemberDetails();
                const currentUser = firebase.auth().currentUser;
                
                // Workaround with logout and login because we need the displayName in the header and only get notified when login.
                currentUser.updateProfile({
                    displayName: this.state.firstName.value,
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

    saveMemberDetails = () => {
        const currentUser = firebase.auth().currentUser;
        const roles = [ROLES.EINSTEIGER];
        const newMember = {
            id: currentUser.uid,
            firstName: this.state.firstName.value,
            lastName: this.state.lastName.value,
            email: this.state.email.value,
            street: this.state.street.value,
            plz: this.state.plz.value,
            place: this.state.place.value,
            dateOfBirth: this.state.dateOfBirth.value,
            registrationDate: moment().format('DD.MM.YYYY HH:mm:ss'),
            roles: roles
        }
        firebase.database().ref('members/' + currentUser.uid).set(newMember);
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

    changeFirstName = (event) => {
        const firstName = event.target.value;
        this.setState({
            firstName: {
                value: firstName,
                valid: !!firstName,
                initial: false,
            }
        });
    }

    changeLastName = (event) => {
        const lastName = event.target.value;
        this.setState({
            lastName: {
                value: lastName,
                valid: !!lastName,
                initial: false,
            }
        });
    }

    changeStreet = (event) => {
        const street = event.target.value;
        this.setState({
            street: {
                value: street,
                valid: !!street,
                initial: false,
            }
        });
    }

    changeHouseNumber = (event) => {
        const houseNumber = event.target.value;
        this.setState({
            houseNumber: {
                value: houseNumber,
                valid: !!houseNumber,
                initial: false,
            }
        });
    }

    changePlz = (event) => {
        const plz = event.target.value;
        this.setState({
            plz: {
                value: plz,
                valid: !!plz,
                initial: false,
            }
        });
    }

    changePlace = (event) => {
        const place = event.target.value;
        this.setState({
            place: {
                value: place,
                valid: !!place,
                initial: false,
            }
        });
    }

    changeDateOfBirth = (event) => {
        const dateOfBirth = event.target.value;
        this.setState({
            dateOfBirth: {
                value: dateOfBirth,
                valid: !!dateOfBirth,
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
                            error={!this.state.firstName.initial && !this.state.firstName.valid}
                            margin='dense'
                            id='firstname'
                            label='Firstname'
                            type='text'
                            fullWidth
                            value={this.state.firstName.value}
                            onChange={this.changeFirstName}
                        />
                        <TextField
                            required
                            error={!this.state.lastName.initial && !this.state.lastName.valid}
                            margin='dense'
                            id='lastname'
                            label='Lastname'
                            type='text'
                            fullWidth
                            value={this.state.lastName.value}
                            onChange={this.changeLastName}
                        />
                        <TextField
                            required
                            error={!this.state.street.initial && !this.state.street.valid}
                            margin='dense'
                            id='street'
                            label='Street'
                            type='text'
                            fullWidth
                            value={this.state.street.value}
                            onChange={this.changeStreet}
                        />
                        <TextField
                            required
                            error={!this.state.plz.initial && !this.state.plz.valid}
                            margin='dense'
                            id='plz'
                            label='PLZ'
                            type='number'
                            fullWidth
                            value={this.state.plz.value}
                            onChange={this.changePlz}
                        />
                        <TextField
                            required
                            error={!this.state.place.initial && !this.state.place.valid}
                            margin='dense'
                            id='place'
                            label='Place'
                            type='text'
                            fullWidth
                            value={this.state.place.value}
                            onChange={this.changePlace}
                        />
                        <TextField
                            required
                            error={!this.state.dateOfBirth.initial && !this.state.dateOfBirth.valid}
                            margin='dense'
                            id='dateofbirth'
                            label='Date of birth'
                            type='date'
                            fullWidth
                            value={this.state.dateOfBirth.value}
                            onChange={this.changeDateOfBirth}
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