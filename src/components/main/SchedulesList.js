import React, { Component } from 'react';
import moment from 'moment';
import firebase from 'firebase';
import ScheduleEntry from './ScheduleEntry';

class SchedulesList extends Component {

  state = {
    schedules: []
  }

  constructor(props) {
    super(props);

    firebase.database().ref('classes/')
      .on('value', snapshot => {
        const classes = snapshot.val();
        let entries = [];
        if (classes) {
          entries = Object.keys(classes).map(key => this.getScheduleEntry(classes[key]));
          entries.sort((a, b) => {
            const compareDates = b.date - a.date;
            return compareDates ? compareDates : (b.from - a.from);
          })
        }
        this.setState({ schedules: entries })
      });
  }

  getScheduleEntry = (dbEntry) => {
    const result = {
      ...dbEntry,
      date: moment(dbEntry.date),
      from: moment(dbEntry.from, 'HH:mm'),
      to: moment(dbEntry.to, 'HH:mm')
    }
    return result;
  }

  render = () => {
    return (
      <div>
        {this.state.schedules.map(schedule => {
          return <ScheduleEntry key={schedule.id} entry={schedule}/>
        })}
      </div>
    );
  }
}

export default SchedulesList;
