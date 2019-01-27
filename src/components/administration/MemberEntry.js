import React, { Component } from 'react';
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Icon from "@material-ui/core/Icon/Icon";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Divider from "@material-ui/core/Divider/Divider";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import firebase from "firebase";
import {withStyles} from "@material-ui/core";
import pb_default from "../../res/img/pb_default.png"

class MemberEntry extends Component {

    constructor(props) {
        super(props);
        this.loadMembers()
    }

    state = {
        member: this.props.entry,
        members: undefined,
        currentUserUid: undefined,
        registrationAllowed: false,
        isLoading: false,
        isDeletionPromptOpen: false,
    }

    loadMembers = () => {
        this.setState({isLoading: true});
        firebase.database().ref('members/')
            .on('value', snapshot => {
                const memberEntries = snapshot.val();
                if (memberEntries) {
                    this.setState({
                        members: memberEntries,
                        isLoading: false,
                    });
                } else {
                    this.setState({
                        members: [],
                        isLoading: false,
                    });
                }
            });
    }



    render() {
        const { classes, entry } = this.props;
        console.log(entry);
        return(
            <div>
                <ExpansionPanel className={classes.root} onChange={this.loadMembers}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Grid container spacing={24} alignContent='center'>
                            <Grid item xs={3} sm={3} md={2}>
                                <img src={pb_default} className={classes.profile}></img>
                            </Grid>
                            <Grid item xs={5} sm={5} md={4}>
                                <Typography variant='headline' component='h3'>
                                    {entry.firstName} {entry.lastName}
                                </Typography>
                                <Typography component='p'>
                                    {entry.dateOfBirth}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={4} md={3}>
                                <Typography variant='headline' component='h3'>
                                    Monatsabo
                                </Typography>
                                <Typography component='p'>
                                    31.01.2019
                                </Typography>
                            </Grid>
                        </Grid>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                        <Grid container spacing={24} alignContent='center'>
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='headline' component='p'>
                                    Adresse
                                </Typography>
                                <Typography component='p'>
                                    {entry.street}
                                </Typography>
                                <Typography component='p'>
                                    {entry.plz}, {entry.place}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={5}>
                                <Typography variant='headline' component='p'>
                                    Abo-Historie
                                </Typography>
                                <Typography component='p'>
                                    01.01.2019 - 31.01.2019: Monatsabo
                                </Typography>
                                <Typography component='p'>
                                    15.10.2018 - 14.04.2019: Halbjahresabo (10/10)
                                </Typography>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
    }
}


const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 24,
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
    },

    profile:{
        height: '100px',
        borderRadius: '20%',
        border: '1px solid black'
    }
});

export default withStyles(styles)(MemberEntry);