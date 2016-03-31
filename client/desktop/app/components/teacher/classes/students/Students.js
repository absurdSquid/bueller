import React from 'react'
import StudentData from './StudentData'

class Students extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      displayListener: this.props.displayListener,
      className : this.props.className,
    };
  }

  render(){
    if(this.props.display[0] === 'class') {
      return (
        <div>
          {}
          <StudentData display={this.props.display} displayListener={this.state.displayListener.bind(this)} className={this.props.className}/>
          
        </div>
      )
    } else {
      return (
        <div>
        </div>
      )
    }
  }
}

module.exports = Students;