var React = require('react');
var Router = require('react-router');

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var App = require('./App');
var Home = require('./Home');
var Login = require('./Login');
var Register = require('./Register');
var Budget = require('./Budget');
var StoreLayout = require('./StoreLayout');
var NotFound = require('./NotFound');


var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="login" handler={Login} />
    <Route name="register" handler={Register} />
    <Route name="budget" handler={Budget} />
    <Route name="storelayout" handler={StoreLayout} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.body);
});
