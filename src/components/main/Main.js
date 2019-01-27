import React, { Component } from 'react';
import SchedulesList from './SchedulesList';
import NewSchedule from './NewSchedule';
import { withStyles } from '@material-ui/core/styles';


class Main extends Component {


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <SchedulesList/>
        <NewSchedule/>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Main);
