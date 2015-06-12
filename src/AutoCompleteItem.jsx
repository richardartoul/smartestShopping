var React = require('react');
var Eventful = require('eventful-react');
var ModeToggle = require('./ModeToggle');
var url = require('./url');

var AutocompleteItem = Eventful.createClass({
  getInitialState: function() {
    return {
      value: '',
    };
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({ value: newProps.name, price: newProps.price, _id: newProps.id });
  },

  selectItem: function(){
    var _id = this.props.item._id;

    $.post(url.addItem, {_id: _id})
    .done(function(data) {
      this.emit('refresh-list',data);
      this.emit('emptyAutocomplete');
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error getting item list:', status, err);
    }.bind(this));
  },

  render: function() {

    return (
      <li className="list-item animated fadeInDown">
        <div className="autocomplete" onClick={this.selectItem}>
          {this.state.value}
          <span>
            ${this.state.price}
          </span>
        </div>
      </li>
    );
  }
});

module.exports = AutocompleteItem;
