var React = require('react');
var Eventful = require('eventful-react');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var ModeToggle = require('./ModeToggle');
var auth = require('./auth');
var url = require('./url');

var App = Eventful.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      items: [],
      filteredItems: [],
      totalCost: 0,
      budget: 100,
      remainingBudget: 100,
      mode: ModeToggle.EDITING
    };
  },

  getList: function() {
    $.get(url.list)
    .done(function(data) {
      this.setState({items: data});
      this.setState({filteredItems: data});
      this.addPrices();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error getting item list:', status, err);
    });
  },

  filterList: function(filter) {
    var filteredList = this.state.items;
    this.setState({
      filteredItems: filteredList.filter(function(item) {
        return item.name.toLowerCase().search(filter) !==-1;
      })
    });
  },

  addPrices: function() {
    var allItems = this.state.items;
    var sum = allItems.map(function(item) {
                return item.data.price;
              });
    this.setState({
      totalCost: sum.reduce(function(total, num){
        return total + num
      }, 0)
    })
    this.setRemainingBudget();
  },

  setRemainingBudget: function() {
    // if (this.state.budget > this.state.totalCost) {
      // console.log('remainingBudget is > 0');
      console.log(this.state.totalCost, ": total cost");
      console.log(this.state.remainingBudget, ": remaining budget");
      this.setState({
        remainingBudget: this.state.budget - this.state.totalCost
      })
    // } 
  },

  addItem: function(item) {
    $.post(url.addItem, item)
    .done(function(data) {
      this.getList();
      this.addPrices();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error adding new item to list:', status, err);
    });
  },

  updateItem: function(item) {
    $.post(url.updateItem, item)
    .done(function(data) {
      this.getList();
      this.addPrices();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error updating item in list:', status, err);
    });
  },

  deleteItem: function(item) {
    $.ajax({
      url: url.deleteItem,
      type: 'DELETE',
      data: item
    })
    .done(function(data) {
      this.getList();
      this.addPrices();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error deleting item from list:', status, err);
    });
  },

  archiveItem: function(item) {
    $.post(url.archiveItem, item)
    .done(function(data) {
      this.getList();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error archiving item in list:', status, err);
    });
  },

  registerUser: function(userData) {
    $.post(url.register, userData)
    .done(function(data) {
      console.log('registered:', data);
      this.context.router.transitionTo('/');
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error registering user:', status, err);
    });
  },

  loginUser: function(userData) {
    $.post(url.login, userData)
    .done(function(data) {
      this.context.router.transitionTo('/');
      this.getList();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error logging in user:', status, err);
    });
  },

  changeMode: function(data) {
    this.setState({ mode: data.mode });
  },

  componentDidMount: function() {
    // eventful event listeners
    this.on('register', function(data) {
      this.registerUser(data);
    });
    this.on('login', function(data) {
      this.loginUser(data);
    });
    this.on('update-item', function(data) {
      this.updateItem(data)
    });
    this.on('add-item', function(data) {
      this.addItem(data);
    });
    this.on('remove-item', function(data) {
      if (this.state.mode === ModeToggle.SHOPPING) {
        this.archiveItem(data);
      } else {
        this.deleteItem(data);
      }
    });
    this.on('change-mode', function(data) {
      this.changeMode(data);
    });
    this.on('filter-list', function(data) {
      this.filterList(data);
    });
    this.on('add-budget', function(data) {
      this.addBudget(data);
    })

    this.getList();
  },

  componentDidUpdate: function(prevProps, prevState) {
    localStorage.state = JSON.stringify(this.state);
  },

  render: function() {
    //var loginOrOut = this.state.loggedIn ?
    //  <Link to="register"> Register Account</Link> :
    //  <Link to="login"> Sign In</Link>;
    return (
      <div id="app">
        <RouteHandler data={this.state} />
      </div>
    );
  }
});

module.exports = App;