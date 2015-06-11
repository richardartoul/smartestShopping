var React = require('react');
var Eventful = require('eventful-react');
var NavToggle = require('./NavToggle');
var List = require('./List');
var auth = require('./auth');

var Budget = Eventful.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  statics: {
    willTransitionTo: function (transition, _, _, cb) {
      auth.loggedIn(function(authed) {
        if (!authed) {
          transition.redirect('/login');
        }
        cb();
      });
    }
  },

  render: function() {
    return (
      <div id="home">
        <NavToggle />
        <h1> will set up budget here </h1>
      </div>
    );
  }
});

module.exports = Budget;
