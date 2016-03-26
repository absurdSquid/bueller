import React from 'react'
import {Route, RouteHandler, Link} from 'react-router'

class StudentData extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      firstName: this.props.location.state.firstName,
      lastName: this.props.location.state.lastName,
      studentData: ['Students list goes here from the DB'],
      studentId: 1,
    };
  }

  render(){
    return (
      <div>
        <h3 style={{color: '#03A9F4'}}> {this.state.firstName + ' ' + this.state.lastName} </h3>
        {this.state.studentData}
      </div>
    )
  }

  componentWillMount(){
    //pull specific student data from the DB based on the studentId given in the URL param
  }
}

module.exports = StudentData;