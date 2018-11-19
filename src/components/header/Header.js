import React, { Component } from 'react';
import firebase from 'firebase';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import LoginForm from '../login/Login';
import SubscribeForm from '../login/Subscribe';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

class Header extends Component {

    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user) => {
            if (user && user.displayName) {
                this.setState({
                    loggedInUser: {
                        uid: user.uid,
                        displayName: user.displayName,
                    },
                });
            } else {
                this.setState({
                    loggedInUser: {
                        uid: '',
                        displayName: '',
                    },
                });
            }
        });
    }

    state = {
        loggedInUser: {
            uid: undefined,
            displayName: undefined,
        },
        loginFormOpen: false,
        subscribeFormOpen: false,
        logoutMenu: {
            open: false,
            anchorEl: undefined,
        }
    };

    openLoginForm = () => {
        this.setState({
            loginFormOpen: true
        });
    };

    closeLoginForm = () => {
        this.setState({
            loginFormOpen: false
        });
    }

    openSubscribeForm = () => {
        this.setState({
            subscribeFormOpen: true
        });
    }

    closeSubscribeForm = () => {
        this.setState({
            subscribeFormOpen: false
        });
    }

    openLogoutMenu = (event) => {
        this.setState({
            logoutMenu: {
                open: true,
                anchorEl: event.currentTarget,
            },
        });
    }

    closeLogoutMenu = () => {
        this.setState({
            logoutMenu: {
                open: false,
                anchorEl: undefined,
            },
        });
    }

    handleLogout = () => {
        firebase.auth().signOut().then(() => {
            this.closeLogoutMenu();
          }).catch(function(error) {
            console.log('error during logout happened');
            console.log(error);
          });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <AppBar position="static" className={classes.root}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <Link to="/" style={{ textDecoration: 'none', color:'white' }}>
                                PatriaFit Class Scheduler
                            </Link>
                        </Typography>
                        <div>
                            {this.state.loggedInUser.uid !== '' || (
                                <div>
                                    <Button onClick={this.openLoginForm} color="inherit">Login</Button>
                                    <Button onClick={this.openSubscribeForm} color="inherit">Subscribe</Button>
                                </div>
                            )}
                            {this.state.loggedInUser.uid === '' || (
                                <div>
                                    <Typography variant="title" color='inherit' className={classes.flex}>
                                        <Icon className={classes.userIcon}>perm_identity</Icon>
                                        <span className={classes.userName}>{this.state.loggedInUser.displayName}</span>
                                        <IconButton
                                            aria-label="Logout Menu"
                                            aria-haspopup="true"
                                            onClick={this.openLogoutMenu}
                                            color="inherit"
                                            className={classes.logoutMenuIcon}
                                            >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Popper 
                                            open={this.state.logoutMenu.open} 
                                            anchorEl={this.state.logoutMenu.anchorEl} 
                                            transition 
                                            disablePortal
                                            placement="bottom-end"
                                            >
                                            {({ TransitionProps }) => (
                                            <Grow
                                                {...TransitionProps}
                                                id="menu-list-grow"
                                                style={{ transformOrigin: 'bottom end' }}
                                            >
                                                <Paper>
                                                    <ClickAwayListener onClickAway={this.closeLogoutMenu}>
                                                        <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                                                    </ClickAwayListener>
                                                </Paper>
                                            </Grow>
                                            )}
                                        </Popper>
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </Toolbar>
                </AppBar>
                <LoginForm open={this.state.loginFormOpen} closeForm={this.closeLoginForm}/>
                <SubscribeForm open={this.state.subscribeFormOpen} closeForm={this.closeSubscribeForm}/>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing.unit * 3
    },
    flex: {
        flex: 1,
        display: 'flex',
    },
    userIcon: {
        marginRight: theme.spacing.unit * 2,
        fontSize: '30px',
    },
    userName: {
        marginTop: '4px',
    },
    logoutMenuIcon: {
        width: '35px',
        height: '35px',
        paddingTop: '6px',
    }
});

export default withStyles(styles)(Header);
