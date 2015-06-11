var React = require('react');
var Eventful = require('eventful-react');
var ListItem = require('./ListItem');

var List = Eventful.createClass({
  addItem: function(e) {
    e.preventDefault();
    var newItemName = e.target.newItemInput.value;
    e.target.newItemInput.value = '';

    this.emit('add-item', { name: newItemName });
  },
  renderListItem: function(itemData, id) {
    return (
      <ListItem key={id} index={id} name={itemData.name} price={itemData.data.price} mode={this.props.mode} foodCategory={itemData.data.food_category}/>
    );
  },
  filterList: function(event) {
    event.preventDefault();
    this.emit('filter-list', event.target.value.toLowerCase());
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div className="ibox float-e-margins" id="list-border">
            <div className="ibox-title">
              <h5>Shopping List</h5>
            </div>
            <div className="ibox-content">
              <div className="row">
                <div className="list">
                  <div className='new-item-input'>
                    <form name="new-item-form" onSubmit={this.addItem}>
                      <input id="tags" className='new-item-input' type="text" ref="newItemInput" name="newItemInput" onChange={this.filterList} placeholder="Enter an item"/>
                      <input className='btn btn-sm btn-primary add-item-button' type="submit" value="Add Item"/>
                    </form>
                </div>
                <div className="budgetDisplay">
                  <h2 className="setBudget">Budget: ${this.props.budget}</h2>
                  <h2 className="remainingBudget">Remaining: ${this.props.remainingBudget}</h2>
                </div>
                <ul>
                  {this.props.filteredItems.map(this.renderListItem)}
                </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4"></div>
      </div>
    );
  }
});

module.exports = List;
