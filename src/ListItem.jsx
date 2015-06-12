var React = require('react/addons');
var Eventful = require('eventful-react');
var ModeToggle = require('./ModeToggle');


var ListItem = Eventful.createClass({
  getInitialState: function() {
    return {
      value: this.props.name,
      editable: false,
      quantity: 1
    };
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({ value: newProps.name });
  },
  switchToEditable: function() {
    this.setState({editable: true}, function() {
      React.findDOMNode(this.refs.editInput).focus();
    });
  },
  updateValue: function(e) {
    this.setState({ value: e.target.value });
  },
  updateQuantity: function(e) {
    e.preventDefault();
    var quantity = e.target.value;
    this.setState({quantity: quantity});
  },
  setQuantity: function(e) {
    this.setState({editable: false});
    this.emit('set-quantity', {index: (this.props.price * this.state.quantity)});
  },
  updatePrice: function(e) {
    this.emit('update-price');
  },
  removeItem: function() {
    this.emit('remove-item', { index: this.props.index });
  },
  render: function() {
    var cssClasses = {
      staticItem: 'static-item ',
      editableItem: 'editable-item ',
      editableQuantity: 'editable-quantity ',
      editingIcon: 'fa fa-trash fa-lg remove-button editing-icon ',
      shoppingIcon: 'fa fa-check fa-lg remove-button shopping-icon '
    };

    if (this.state.editable) {
      cssClasses.staticItem += 'hide';
      cssClasses.editableQuantity += 'show';
    } else {
      cssClasses.staticItem += 'show';
      cssClasses.editableQuantity += 'hide';
    }

    if (this.props.mode === ModeToggle.SHOPPING) {
      cssClasses.editingIcon += 'hide';
      cssClasses.shoppingIcon += 'show';
    } else {
      cssClasses.editingIcon += 'show';
      cssClasses.shoppingIcon += 'hide';
    }
    return (
      <li className="list-item animated fadeInDown">
        <div className={cssClasses.staticItem}>
          <i className={cssClasses.shoppingIcon} onClick={this.removeItem}></i>
          <i className ={cssClasses.editingIcon} onClick={this.removeItem}></i>
          <div className="item-label">{this.props.name}</div>
          <div className="food-cat">{this.props.category}</div>
          <div className="food-price">${parseFloat(this.props.price * this.state.quantity).toFixed(2)}</div>
          <div className="quantity" onClick={this.switchToEditable}>qty: {this.state.quantity}</div>
        </div>
        <div className={cssClasses.editableQuantity}>
          <form name={"item-form-" + this.props.index} onSubmit={this.setQuantity}>
            <input type="text" ref="editInput" value={this.state.quantity} onChange={this.updateQuantity} />
          </form>
        </div>
      </li>
    );
  }
});

module.exports = ListItem;
