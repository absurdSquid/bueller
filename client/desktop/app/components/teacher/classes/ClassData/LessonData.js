import React from 'react';
import api from '../../../../utils/api';
import moment from 'moment';

class LessonData extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lessonId: this.props.params.lessonId,
      lessonName: this.props.location.state.lessonName,
      className: this.props.location.state.className,
      classId: this.props.location.state.classId,
      lessonDate: this.props.location.state.lessonDate,
      data: [],
      addThumbs: false,
      addMultiChoice: false,
      thumbsTitle: "",
      thumbsQuestion: "",
      multiTitle: "",
      multiQuestion: "",
      multiAnswer: "",
      multiA: "",
      multiB: "",
      multiC: "",
      multiD: "",
      formError: ""
    };
  }

  render(){
    const self = this;
    const lessonDate = new Date(this.state.lessonDate);
    const currentDay = new Date();

    // wipe hours from dates, to compare days only.
    lessonDate.setHours(0,0,0,0);
    currentDay.setHours(0,0,0,0);
    const showButtons = lessonDate >= currentDay ? <div className='center-align'>
                          <button className='newPollButton' onClick={this.handleAddThumbs.bind(self)}>Add thumbs check</button>
                          <button className='newPollButton' onClick={this.handleAddMultiChoice.bind(self)}>Add multiple choice</button>
                        </div> : <div></div>;
    var lessonIsInFuture = lessonDate >= currentDay;
    var showMCTable = this.state.data.filter(function(poll) {
      return poll.type === 'multiChoice';
    }).length;
    var showThumbsTable = this.state.data.filter(function(poll){
      return poll.type === 'thumbs';
    }).length;

    console.log(showMCTable, showThumbsTable, lessonIsInFuture, 'should be true...');

    const userMessage = () => {
      if(!showMCTable && !showThumbsTable) {
        if(lessonIsInFuture) {
          return 'No feedback is set to be recorded for this lesson. Add some below!';
        } else {
          return 'No feedback has been recorded for this lesson.';
        }
      } 
    }


    return (<div>
      <h2 className='sectionHeading classList' onClick={this.handleClassClick.bind(this)}>
        <span className='pointer'>{this.state.className}</span>
      </h2>
      <h5 className='sectionHeading classList'>'{this.state.lessonName}'</h5>
      <div>
        <ThumbsTable data={this.state.data.filter(function(poll){
          return poll.type === 'thumbs';
        })} />
      </div>
      <div>
        <MCTable data={this.state.data.filter(function(poll) {
          return poll.type === 'multiChoice';
        })} />
      </div>

      <div>
        <p style={{fontWeight: 400, marginBottom: '10px'}}>
          {userMessage()}
        </p>
      </div>
      
      {showButtons}
      
      <ErrorMessage className='center-align' formError={this.state.formError} />
      <AddThumbsForm 
        onSubmit={this.handleThumbsFormSubmit.bind(this)} 
        lessonId={this.props.lessonId}
        addThumbs={this.state.addThumbs}
        thumbsTitle={this.state.thumbsTitle}
        thumbsQuestion={this.state.thumbsQuestion}
        handleThumbsTitleChange={this.handleThumbsTitleChange.bind(this)}
        handleThumbsQuestionChange={this.handleThumbsQuestionChange.bind(this)}
      />
      <AddMultiChoiceForm 
        onSubmit={this.handleMultiChoiceFormSubmit.bind(this)}
        lessonId={this.props.lessonId}
        addMultiChoice={this.state.addMultiChoice}
        multiTitle={this.state.multiTitle}
        multiQuestion={this.state.multiQuestion}
        multiAnswer={this.state.multiAnswer}
        multiA={this.state.multiA}
        multiB={this.state.multiB}
        multiC={this.state.multiC}
        multiD={this.state.multiD}
        handleMultiTitleChange={this.handleMultiTitleChange.bind(this)}
        handleMultiQuestionChange={this.handleMultiQuestionChange.bind(this)}
        handleMultiAnswerChange={this.handleMultiAnswerChange.bind(this)}
        handleMultiAChange={this.handleMultiAChange.bind(this)}
        handleMultiBChange={this.handleMultiBChange.bind(this)}
        handleMultiCChange={this.handleMultiCChange.bind(this)}
        handleMultiDChange={this.handleMultiDChange.bind(this)}
      />
    </div>)
  }

  componentWillMount(){
    api.getLessonPollsData(this.state.lessonId)
    .then((response) => {
      response.json().then((response) => {
        console.log('Individual lesson data from DB:', response);
        this.setState({
          data:response
        });
      }).catch((err) => {
        console.error(err);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleClassClick() {
    this.context.router.push({
      pathname: '/class/' + this.state.classId + '/lessons/',
    });
  }

  handleAddThumbs(e) {
    // Pop out Thumbs form
    e.preventDefault();
    this.setState({
      addThumbs: true,
      addMultiChoice: false
    });
  }

  handleAddMultiChoice(e) {
    // Pop out MultiChoice form
    e.preventDefault();
    this.setState({
      addThumbs: false,
      addMultiChoice: true
    });
  }

  handleThumbsTitleChange(e) {
    this.setState({ thumbsTitle: e.target.value });
  }

  handleThumbsQuestionChange(e) {
    this.setState({ thumbsQuestion: e.target.value });
  }
  
  handleMultiTitleChange(e) {
    this.setState({ multiTitle: e.target.value });
  }

  handleMultiQuestionChange(e) {
    this.setState({ multiQuestion: e.target.value });
  }

  handleMultiAnswerChange(e) {
    this.setState({ multiAnswer: e.target.value });
  }

  handleMultiAChange(e) {
    this.setState({ multiA: e.target.value });
  }

  handleMultiBChange(e) {
    this.setState({ multiB: e.target.value });
  }

  handleMultiCChange(e) {
    this.setState({ multiC: e.target.value });
  }

  handleMultiDChange(e) {
    this.setState({ multiD: e.target.value });
  }

  handleThumbsFormSubmit(e) {
    // Submit form data over API
    e.preventDefault();
    console.log("Submit thumbs was clicked!")
    var lessonId = this.state.lessonId;
    var self = this;

    if (this.state.thumbsTitle && this.state.thumbsQuestion) {
      api.addThumbPoll(lessonId, this.state.thumbsTitle, this.state.thumbsQuestion)
      .then(function(response){
        if (response) {
          console.log("POST RESPONSE: ", response);

          // Call API to grab new poll data
          api.getLessonPollsData(lessonId)
          .then((response) => {
            response.json().then((response) => {
              console.log('Individual lesson data from DB:', response);
              self.setState({
                data:response
              });
            }).catch((err) => {
              console.error(err);
            });
          })
          .catch((err) => {
            console.error(err);
          });

          // Wipe relevant states
          self.setState({
           thumbsTitle: "",
           thumbsQuestion: ""
          });
        } else {
          console.log("POST ERROR")
        }
      }).catch(function(err){
        console.log("ERROR POSTING: ", err);
      });
    } else {
        // Mandatory fields not entered
        self.setState({
          formError: "Please enter all required fields"
        });
        console.log(self.state.formError);
      }
  }

  handleMultiChoiceFormSubmit(e) {
    // Submit form data over API
    e.preventDefault();
    console.log("Submit thumbs was clicked!")
    var lessonId = this.state.lessonId;
    var self = this;


    if (this.state.multiTitle && this.state.multiQuestion && this.state.multiAnswer 
      && this.state.multiA && this.state.multiB) {
      api.addMultiChoicePoll(lessonId, this.state.multiTitle, this.state.multiQuestion, 
        this.state.multiAnswer, this.state.multiA, this.state.multiB, this.state.multiC, this.state.multiD)
      .then(function(response){
        if (response) {
          console.log("POST RESPONSE: ", response);

          // Call API to grab new poll data
          api.getLessonPollsData(lessonId)
          .then((response) => {
            response.json().then((response) => {
              console.log('Individual lesson data from DB:', response);
              self.setState({
                data:response
              });
            }).catch((err) => {
              console.error(err);
            });
          })
          .catch((err) => {
            console.error(err);
          });

          // add to state
          self.setState({
           // Wipe relevant states
           multiTitle: "",
           multiQuestion: "",
           multiAnswer: "",
           multiA: "",
           multiB: "",
           multiC: "",
           multiD: ""
          });
        } else {
          console.log("POST ERROR")
        }
      }).catch(function(err){
        console.log("ERROR POSTING: ", err);
      })

    } else {
      // Mandatory fields not entered
      self.setState({
        formError: "Please enter all required fields"
      });
      console.log("Please enter all required fields");

    }


  }
}

const MCTable = (props) => {
  if(props.data.length) {
    return (
      <div>
      <div className='tableContainer'>
      <table>
        <thead>
          <tr>
            <th> Multiple Choice Polls </th>
            <th> Response Count </th>
            <th> Accuracy Rate </th>
          </tr>
        </thead>
        <tbody>
        {props.data.map((poll) => {
        var correctRate = (poll.correct_response_count || 0) / poll.response_count * 100;
          return (
            <tr key={'P' + poll.poll_id} >
              <td> {poll.poll_name || 'N/A'} </td>
              <td> {poll.response_count || 0} </td>
              <td> {!isNaN(correctRate) ? correctRate.toFixed(2) + '%' : 'N/A'} </td>
            </tr>
          )
        })}
      </tbody>
    </table>
    </div>
    </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

const ThumbsTable = (props) => {
  if(props.data.length) {
    return (
      <div className='dataTable'>
      <div className='tableContainer'>
       <table>
        <thead>
          <tr>
            <th> Thumbs Checks </th>
            <th> Response Count </th>
            <th> Average Response </th>
          </tr>
        </thead>
        <tbody>
        {props.data.map((poll) => {
          return (
            <tr key={'P' + poll.poll_id} >
              <td> {poll.poll_name || 'N/A'} </td>
              <td> {poll.response_count || 0} </td>
              <td> {poll.average_thumb ? poll.average_thumb.toFixed(2) + '%' : 'N/A'} </td>
            </tr>
          )
        })}
      </tbody>
    </table>
    </div>
    </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

const AddThumbsForm = (props) => {
  if (props.addThumbs) {
    return (
      <div className='newPoll'>
        <h5 className='sectionHeading'>New Thumbs Check</h5>
        <form onSubmit={props.addStudent} className="pollForm">
          <div>
          
            <input type='text' className='newPollInput' placeholder='Title (for your records)' 
            maxLength={24} value={props.thumbsTitle} onChange={(event) => {
              props.handleThumbsTitleChange(event);
            }} />
            <text>*</text>
          </div>
          <div>
            <input type='text' className='newPollInput' placeholder='Question' value={props.thumbsQuestion} onChange={(event) => {
             props.handleThumbsQuestionChange(event);
            }} />
            <text>*</text>
          </div>
          <div>
            <button onClick={props.onSubmit} style={{marginLeft:'0', fontSize: '1em'}} type='submit'>Add</button>
          </div>
        </form>
      </div>
    )  
  } else {
    return (
      <div></div>
      )
  }
};

const AddMultiChoiceForm = (props) => {
  if (props.addMultiChoice) {
    return (
      <div className='newPoll'>
        <h5 className='sectionHeading' >New Multiple Choice</h5>
        <form onSubmit={props.handleMultiChoiceFormSubmit} className="pollForm">
          <div>
            <input type='text' className='newPollInput' placeholder='Short title (for your records)' 
            value={props.multiTitle} maxLength={24} onChange={(event) => {
              props.handleMultiTitleChange(event);
            }} />
            <text>*</text>
          </div>
          <div>
            <input type='text' className='newPollInput' placeholder='Question' value={props.multiQuestion} onChange={(event) => {
              props.handleMultiQuestionChange(event);
            }} />
            <text>*</text>
          </div>
          <div>
            <input type='text' className='newPollInput' placeholder='Answer (A, B, C, or D)' value={props.multiAnswer} onChange={(event) => {
              props.handleMultiAnswerChange(event);
            }} />
            <text>*</text>
          </div>
          <div>
            <input type='text' className='newPollInput' placeholder='Option A' value={props.multiA} onChange={(event) => {
              props.handleMultiAChange(event);
            }} />
            <text>*</text>
          </div>
          <div>
            <input type='text' className='newPollInput' placeholder='Option B' value={props.multiB} onChange={(event) => {
              props.handleMultiBChange(event);
            }} />
            <text>*</text>
          </div>
          <div>
            <input type='text' className='newPollInput' placeholder='Option C' value={props.multiC} onChange={(event) => {
              props.handleMultiCChange(event);
            }} />
          </div>
          <div>
            <input type='text' className='newPollInput' placeholder='Option D' value={props.multiD} onChange={(event) => {
              props.handleMultiDChange(event);
            }} />
          </div>
          
          <div>
            <button onClick={props.onSubmit} style={{marginLeft:'0', fontSize: '1em'}} type='submit'>Add</button>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div></div>
      )
  }
};

const ErrorMessage = (props) => {
  if (props.formError) {
    return (
      <div className='errorMessage'> 
        {props.formError} 
      </div>
    )
  } else {
    return (<div></div>)
  }
}

LessonData.contextTypes = {
  router: React.PropTypes.any.isRequired
};

module.exports = LessonData;