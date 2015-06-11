var React = require('react');
var Eventful = require('eventful-react');

var NavToggle = Eventful.createClass({
  // statics: {
  //   // modes enum
  //   SHOPPING: {},
  //   EDITING: {}
  // },
  
  // getInitialState: function() {
  //   return {
  //     mode: ModeToggle.EDITING
  //   };
  // },
  // changeHandler: function(e) {
  //   var newMode = ModeToggle[e.target.value];
  //   this.setState({ mode: newMode });
  //   this.emit('change-mode', { mode: newMode })
  // },

  render: function() {
    // var buttonClasses = {
    //   shopping: 'btn btn-sm btn-white',
    //   editing: 'btn btn-sm btn-white'
    // };
    // if (this.state.mode === ModeToggle.SHOPPING) {
    //   buttonClasses.shopping += ' active';
    // } else {
    //   buttonClasses.editing += ' active';
    // }

    return (
      <div>


      <div className="btn-group btn-group-justified" role="group" aria-label="...">
        <div className="btn-group" role="group">
          <a href='#/'>
          <button type="button" className="btn btn-success">
          <span className="glyphicon glyphicon-check" aria-hidden="true"></span>
          </button>
          </a>
        </div>
        <div className="btn-group" role="group">
          <a href='#/Budget'>
          <button type="button" className="btn btn-danger">
          <span className="glyphicon glyphicon-usd" aria-hidden="true"></span>
          </button>
          </a>
        </div>
        <div className="btn-group" role="group">
          <a href='#/StoreLayout'>
          <button type="button" className="btn btn-info">
          <span className="glyphicon glyphicon-sort" aria-hidden="true"></span>
          </button>
          </a>
        </div>
      </div>

      </div>
    );
  }
});

module.exports = NavToggle;
