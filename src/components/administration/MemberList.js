import React, { Component } from 'react';
import firebase from 'firebase';
import moment from "moment";
import MemberEntry from "../administration/MemberEntry";
import SchedulesList from "../main/SchedulesList";
import ScheduleEntry from "../main/ScheduleEntry";

class MemberList extends Component {

    state = {
        memberlist: []
    }

    constructor(props) {
        super(props);

        firebase.database().ref('members/')
            .on('value', snapshot => {
                const members = snapshot.val();
                if (members) {
                    const entries = Object.keys(members).map(key => members[key]);
                    this.setState({ memberlist: entries })
                }
            });
    }

    render = () => {
        return (
            <div>
                {this.state.memberlist.map(member => {
                    return <MemberEntry entry={member}/>
                })}
            </div>
        );
    }

}

export default MemberList;