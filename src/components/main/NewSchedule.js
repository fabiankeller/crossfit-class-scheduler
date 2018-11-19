import React, { Component } from 'react';
import moment from 'moment';
import firebase from 'firebase';
import uuidv1 from 'uuid/v1'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DatePicker, TimePicker } from 'material-ui-pickers';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class NewSchedule extends Component {

  constructor(props) {
    super(props);

    firebase.database().ref('coaches/')
      .on('value', snapshot => {
        const coachEntries = snapshot.val();
        this.setState({ 
          coaches: coachEntries,
         })
      });
  }

  state = {
    open: false,
    newSchedule: {
      title: '',
      description: '',
      from: moment('19:30', 'HH:mm'),
      to: moment('21:00', 'HH:mm'),
      capacity: 30,
      coach: {
        name: '',
        uid: '',
      },
    },
    occurenceConfig: {
      repeating: false,
      weekday: '1',
      startDate: moment(),
      endDate: moment(),
    },
    coaches: []
  };

  saveNewSchedule = () => {
    let newClasses = [];
    if (this.state.occurenceConfig.repeating) {
      newClasses = newClasses.concat(this.prepareRepeatingSchedulesForDB());
    } else {
      newClasses.push(this.prepareScheduleForDB(this.state.occurenceConfig.startDate));
    }
    newClasses.forEach(newClass => {
      firebase.database().ref('classes/' + newClass.id).set(newClass);
    });
    this.setState({ open: false , newSchedule: this.getEmptyScheduleEntry(), occurenceConfig: this.getEmptyOccurenceConfig()});
  }

  prepareScheduleForDB = (date) => {
    return {
      ...this.state.newSchedule,
      id: uuidv1(),
      date: date.format(),
      from: this.state.newSchedule.from.format('HH:mm'),
      to: this.state.newSchedule.to.format('HH:mm')
    }
  }
  prepareRepeatingSchedulesForDB = () => {
    const schedules = [];
    const startDate = this.state.occurenceConfig.startDate;
    const endDate = this.state.occurenceConfig.endDate;

    let weekday = startDate.clone().day(this.state.occurenceConfig.weekday);

    if (weekday.isBefore(startDate, 'd')) {
      weekday.add(7, 'd');
    }

    while(weekday.isBefore(endDate, 'd')) {
      schedules.push(this.prepareScheduleForDB(weekday));
      weekday.add(7, 'd');
    }
    return schedules;
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleTitleChange = (event) => {
    this.setState({ newSchedule: { ...this.state.newSchedule, title: event.target.value} });
  }

  handleDescriptionChange = (event) => {
    this.setState({ newSchedule: { ...this.state.newSchedule, description: event.target.value} });
  }

  handleCoachChange = (event) => {
    const coach = this.state.coaches.find(c => c.name === event.target.value);
    this.setState({ 
      newSchedule: { 
        ...this.state.newSchedule, 
        coach: coach
      } });
  }

  handleStartDateChange = (date) => {
    this.setState({ occurenceConfig: { ...this.state.occurenceConfig, startDate: date} });
  }

  handleEndDateChange = (date) => {
    this.setState({ occurenceConfig: { ...this.state.occurenceConfig, endDate: date} });
  }

  handleFromTimeChange = (date) => {
    this.setState({ newSchedule: { ...this.state.newSchedule, from: date}});
  }

  handleToTimeChange = (date) => {
    this.setState({ newSchedule: { ...this.state.newSchedule, to: date}});
  }

  handleCapacityChange = (event) => {
    this.setState({ newSchedule: { ...this.state.newSchedule, capacity: event.target.value }});
  }

  getEmptyScheduleEntry = () => {
    return {
      title: '',
      description: '',
      from: moment('19:30', 'HH:mm'),
      to: moment('21:00', 'HH:mm'),
      capacity: 30,
      coach: {
        name: '',
        uid: '',
      },
    };
  }

  getEmptyOccurenceConfig = () => {
    return {
      repeating: false,
      weekday: '1',
      startDate: moment(),
      endDate: moment(),
    };
  }

  render = () => {
    const { classes } = this.props;
    return (
      <div >
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Neues Training hinzufügen</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="title"
              label="Titel"
              value={this.state.newSchedule.title}
              onChange={this.handleTitleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              id="description"
              label="Beschreibung"
              multiline
              rowsMax="4"
              value={this.state.newSchedule.description}
              onChange={this.handleDescriptionChange}
              fullWidth
            />
            <TextField
              id="coach"
              select
              label="Coach"
              value={this.state.newSchedule.coach.name}
              onChange={this.handleCoachChange}
              margin="dense"
              className={classes.smallInputFields}>
              {this.state.coaches.map(coach => {
                return <MenuItem key={coach.uid} value={coach.name}>
                  {coach.name}
                </MenuItem>
              })}
            </TextField>
            <TextField
              margin="dense"
              id="capacity"
              label="Max. Anzahl Teilnehmer"
              type='number'
              value={this.state.newSchedule.capacity}
              onChange={this.handleCapacityChange}
              className={classes.smallInputFields}
            />
            <div className={classes.root}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.occurenceConfig.repeating}
                    onChange={(ev) => this.setState({ 
                                        occurenceConfig: {
                                          ...this.state.occurenceConfig,
                                          repeating: ev.target.checked 
                                        }
                                      })}
                    color="primary"
                  />
                }
                label="Wiederkehrend"
              />
              {this.state.occurenceConfig.repeating || (
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <DatePicker
                      label="Datum"
                      value={this.state.occurenceConfig.startDate}
                      onChange={this.handleStartDateChange}
                      animateYearScrolling={false}
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TimePicker
                      ampm={false}
                      label="Von"
                      value={this.state.newSchedule.from}
                      onChange={this.handleFromTimeChange}
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TimePicker
                      ampm={false}
                      label="Bis"
                      value={this.state.newSchedule.to}
                      onChange={this.handleToTimeChange}
                      margin="dense"
                    />
                  </Grid>
                </Grid>
              )}
              {!this.state.occurenceConfig.repeating || (
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <TextField
                      id="weekday"
                      select
                      label="Wochentag"
                      value={this.state.occurenceConfig.weekday}
                      onChange={(ev) => this.setState({
                        occurenceConfig: {
                          ...this.state.occurenceConfig,
                          weekday: ev.target.value,
                        }
                      })}
                      margin="dense">
                        <MenuItem value="1">Montag</MenuItem>
                        <MenuItem value="2">Dienstag</MenuItem>
                        <MenuItem value="3">Mittwoch</MenuItem>
                        <MenuItem value="4">Donnerstag</MenuItem>
                        <MenuItem value="5">Freitag</MenuItem>
                        <MenuItem value="6">Samstag</MenuItem>
                        <MenuItem value="0">Sonntag</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TimePicker
                      ampm={false}
                      label="Von"
                      value={this.state.newSchedule.from}
                      onChange={this.handleFromTimeChange}
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TimePicker
                      ampm={false}
                      label="Bis"
                      value={this.state.newSchedule.to}
                      onChange={this.handleToTimeChange}
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <DatePicker
                      label="Start Datum"
                      value={this.state.occurenceConfig.startDate}
                      onChange={this.handleStartDateChange}
                      animateYearScrolling={false}
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <DatePicker
                      label="End Datum"
                      value={this.state.occurenceConfig.endDate}
                      onChange={this.handleEndDateChange}
                      animateYearScrolling={false}
                      margin="dense"
                    />
                  </Grid>
                </Grid>
              )}
              </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Abbrechen
            </Button>
            <Button onClick={this.saveNewSchedule} color="primary">
              Hinzufügen
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container justify="flex-end">
          <Button variant="fab" aria-label="add" color="primary"
            className={classes.button} onClick={this.handleClickOpen}>
            <AddIcon />
          </Button>
        </Grid>
      </div>
    );
  }
}

const styles = theme => {
  return {
    button: {
      marginRight: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      margin: 0,
      top: 'auto',
      right: 10,
      bottom: 10,
      left: 'auto',
      position: 'fixed',
    },
    root: {
      flexGrow: 1,
    },
    smallInputFields: {
      width: 200,
      marginRight: '10px',
    }
  }
};

export default withStyles(styles)(NewSchedule);
