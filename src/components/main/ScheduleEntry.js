import React, { Component } from 'react';
import moment from 'moment';
import firebase from 'firebase';
import uuidv1 from 'uuid/v1'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';

class ScheduleEntry extends Component {

  constructor(props) {
    super(props);

    this.registerForClass = this.registerForClass.bind(this);
    this.loadRegistrations = this.loadRegistrations.bind(this);
    firebase.auth().onAuthStateChanged((user) => {
      if (user && user.displayName) {
          this.setState({
            currentUserUid: user.uid,
            registrationAllowed: this.state.registrations ? !this.checkIfUserAlreadyRegisteredForThisClass(this.state.registrations, user.uid) : false,
          });
      } else {
          this.setState({
            currentUserUid: undefined,
            registrationAllowed: false,
          });
      }
  });
  }

  state = {
    class: this.props.entry,
    registrations: undefined,
    currentUserUid: undefined,
    registrationAllowed: false,
    isLoading: false,
    isDeletionPromptOpen: false,
  }

  registerForClass = () => {
    const currentUser = firebase.auth().currentUser;
    const newRegistration = {
      id: uuidv1(),
      user: {
        uid: currentUser.uid,
        name: currentUser.displayName
      },
      timestamp: moment().format('DD.MM.YYYY HH:mm:ss')
    }
    const newRegistrations = [...this.state.registrations, newRegistration];
    firebase.database().ref('registrations/' + this.state.class.id).set(newRegistrations);
  }

  unregisterForClass = (id) => {
    const updatedRegistrations = this.state.registrations.filter(r => r.id !== id);
    firebase.database().ref('registrations/' + this.state.class.id).set(updatedRegistrations);
  }

  loadRegistrations = () => {
    this.setState({isLoading: true});
    firebase.database().ref('registrations/' + this.state.class.id)
      .on('value', snapshot => {
        const registrationEntries = snapshot.val();
        if (registrationEntries) {
            this.setState({ 
              registrations: registrationEntries,
              registrationAllowed: this.state.currentUserUid ? !this.checkIfUserAlreadyRegisteredForThisClass(registrationEntries, this.state.currentUserUid) : false,
              isLoading: false,
            });
        } else {
          this.setState({
            registrations: [],
            registrationAllowed: this.state.currentUserUid ? true : false,
            isLoading: false,
          });
        }
      });
  }

  checkIfUserAlreadyRegisteredForThisClass = (registrationEntries, userUid) => {
    return registrationEntries.some(reg => reg.user.uid === userUid);
  }

  getRegisterTooltip = () => {
    if (this.state.registrations && this.state.registrations.length >= this.state.class.capacity) {
      return 'Die maximale Anzahl an Anmeldungen ist erreicht.';
    } else {
      return '';
    }
  }

  deleteClass = () => {
    firebase.database().ref('registrations/' + this.state.class.id).remove();
    firebase.database().ref('classes/' + this.state.class.id).remove();
  }

  openDeletionPrompt = () => {
    this.setState({ isDeletionPromptOpen: true });
  }

  closeDeletionPrompt = () => {
    this.setState({ isDeletionPromptOpen: false });
  }

  render() {
    const { classes, entry } = this.props;
    return (
      <div>
        <ExpansionPanel className={classes.root} onChange={this.loadRegistrations}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container spacing={24} alignContent='center'>
            <Grid item xs={4} sm={4} md={3}>
              <Typography variant='headline' component='h3'>
                {entry.date.format('DD. MMM')}
              </Typography>
              <Typography component='p'>
                {entry.date.format('dddd')}
              </Typography>
              <Typography component='p'>
                {entry.from.format('HH:mm') + ' - ' + entry.to.format('HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={8} sm={8} md={9}>
              <Typography variant='headline' component='h3'>
                {entry.title}
              </Typography>
            </Grid>
          </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <Grid container spacing={24}>
              <Grid item xs={4} sm={4} md={3}>
                <Typography component='p'>
                  Coach: {entry.coach.name}
                </Typography>
                {!(this.state.currentUserUid && this.state.currentUserUid === entry.coach.uid) || (
                  <div>
                    <Tooltip title='Training bearbeiten' placement='top'>
                      <span>
                        <IconButton
                          aria-label='edit class'
                          onClick={() => {}}
                          color='inherit'
                          className={classes.icon}
                          disabled='true'
                          >
                          <Icon>edit_icon</Icon>
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title='Training löschen' placement='top'>
                      <IconButton
                        aria-label='remove class'
                        onClick={this.openDeletionPrompt}
                        color='inherit'
                        className={classes.icon}
                        >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
              </Grid>
              <Grid item xs={8} sm={8} md={9}>
                <Typography component='p'>
                  {entry.description}
                </Typography>
              </Grid>
              {!this.state.currentUserUid || (
                <Grid item xs={4} sm={4} md={3}>
                  <Typography component='p'>
                    Anmeldungen:
                  </Typography>
                  <Typography component='p'>
                    ({this.state.registrations ? this.state.registrations.length : '0'} / {entry.capacity})
                  </Typography>
                </Grid>
              )}
              {!this.state.currentUserUid || (
                <Grid item xs={8} sm={8} md={9}>
                  <span>
                    {!this.state.isLoading || (
                      <CircularProgress className={classes.progress} />
                    )}
                    {!((this.state.registrations && this.state.registrations.length === 0) || this.state.currentUserUid) &&
                      <Typography component='p'>
                        -
                      </Typography>
                    }
                    {!(this.state.registrations && this.state.currentUserUid) || this.state.registrations.map(reg => {
                      return <Grid container spacing={24} key={reg.id}>
                        <Grid item xs={4} sm={4} md={3}>
                          <Typography component='p'>
                            {reg.user.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={5} md={4}>
                          <Typography component='p'>
                            {reg.timestamp}
                          </Typography>
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} className={classes.icon}>
                          <div>
                            {!(this.state.currentUserUid === reg.user.uid 
                              || this.state.currentUserUid === entry.coach.uid) || (
                              <Tooltip title='Abmelden' placement='top'>
                                <IconButton
                                  aria-label='Unregister class'
                                  onClick={() => this.unregisterForClass(reg.id)}
                                  color='inherit'
                                  className={classes.icon}
                                  >
                                  <DeleteOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    })}
                  </span>
                </Grid>
              )}
            </Grid>
          </ExpansionPanelDetails>
          <div>
            {!this.state.registrationAllowed || (
              <div>
                <Divider />
                <ExpansionPanelActions>
                  <Tooltip title={this.getRegisterTooltip()} placement='top'>
                    <div>
                      <Button 
                        color='primary' 
                        variant='contained' 
                        size='small'
                        disabled={this.state.registrations && this.state.registrations.length >= this.state.class.capacity}
                        onClick={this.registerForClass}>
                        Anmelden
                      </Button>
                    </div>
                  </Tooltip>
                </ExpansionPanelActions>
              </div>
            )}
            <Dialog
                open={this.state.isDeletionPromptOpen}
                onClose={this.closeDeletionPrompt}
                aria-labelledby='delete-dialog-title'
                aria-describedby='delete-dialog-description'
              >
                <DialogTitle id='delete-dialog-title'>Löschen bestätigen</DialogTitle>
                <DialogContent>
                  <DialogContentText id='delete-dialog-description'>
                    Möchtest Du das Training '{entry.title}' am {entry.date.format('DD. MMM')} wirklich löschen?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.closeDeletionPrompt}>
                    Abbrechen
                  </Button>
                  <Button onClick={this.deleteClass} color='primary' autoFocus>
                    Löschen
                  </Button>
                </DialogActions>
              </Dialog>
          </div>
        </ExpansionPanel>
      </div>
    );
  }
}

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing.unit * 3,
    maxWidth: '960px',
    marginLeft: 'auto',
    marginRight: 'auto',
    verticalAlign: 'middle',
  }),
  details: {
    alignItems: 'center',
  },
  icon: {
    padding: '4px !important',
  }
});

export default withStyles(styles)(ScheduleEntry);
