import React, { Component } from 'react';
import MemberList from './MemberList';
import { withStyles } from '@material-ui/core/styles';

class Administration extends Component {

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <MemberList/>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        margin: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(Administration);