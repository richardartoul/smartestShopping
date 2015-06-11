var React = require('react');
var Eventful = require('eventful-react');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var ModeToggle = require('./ModeToggle');
var auth = require('./auth');
var url = require('./url');
var config = require('./config')

var App = Eventful.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      items: [],
      filteredItems: [],
      mode: ModeToggle.EDITING
    };
  },

  getList: function() {
    $.get(url.list)
    .done(function(data) {
      this.setState({items: data});
      this.setState({filteredItems: data});
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        this.getAisle(data[i].name, i);
      }
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error getting item list:', status, err);
    });
  },

  getAisle: function(itemName, index) {
    var aisle;
    $.ajax({
      url: url.aisle,
      data: {name: itemName},
      type: 'GET'
    }).done(function(data) {
      //the api returns the response in an intersting way and need to be parsed
      aisle = parseInt(data[0].AisleNumber[0].substring(6));
      if (aisle) {
        var items = this.state.items;
        items[index].aisle = aisle;
        this.setState({items: items});
      }
    }.bind(this))
  },

  filterList: function(filter) {
    var filteredList = this.state.items;
    this.setState({
      filteredItems: filteredList.filter(function(item) {
        return item.name.toLowerCase().search(filter) !==-1;
      })
    });
  },

  addItem: function(item) {
    $.post(url.addItem, item)
    .done(function(data) {
      this.getList();
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error('Error adding new item to list:', status, err);
    });
  },

  updateItem: function(item) {
    $.post(url.updateItem, item)
    .done(function(data) {
      this.getList();
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
      console.log('registered:',data);
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

    this.getList();
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