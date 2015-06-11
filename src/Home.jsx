var React = require('react');
var Eventful = require('eventful-react');
var ModeToggle = require('./ModeToggle');
var NavToggle = require('./NavToggle');
var List = require('./List');
var auth = require('./auth');

var Home = Eventful.createClass({
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
        <ModeToggle mode={this.props.data.mode} />
        <List filteredItems={this.props.data.filteredItems} budget={this.props.data.budget} totalCost={this.props.data.totalCost} remainingBudget={this.props.data.remainingBudget} predictedFood={this.props.data.predictedFood} selectedFood={this.props.data.selectedFood} mode={this.props.data.mode} />
      </div>
    );
  }
});

module.exports = Home;
