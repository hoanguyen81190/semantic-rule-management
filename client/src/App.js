import dashboardRoutes from './routes/routes'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import store from './core/store';
import ac_rest_manager from './core/ac_rest_manager.js';
import './App.css';

function App() {
  //retrieve the prefixes
  // ac_rest_manager.getAllRules2((pref) => {
  //   if (pref) {
  //     var prefAction = {
  //       type: 'ADD_KNOWLEDGE_BASE_PREFIX',
  //       prefix: pref
  //     };
  //
  //     store.dispatch(prefAction);
  //   }
  //
  // })
  return (
    <div className="App">
      <Switch>
        {dashboardRoutes.map((route, i) => (
          <Route key={i} {...route} />
        ))}
      </Switch>
    </div>
  );
}

App.propTypes = {
  global: PropTypes.object,
  dispatch: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  notifications: PropTypes.array
}

function mapStateToProps(state) {
  const { global, notifications } = state
  return {
    notifications,
    global: global || null
  }
}

export default withRouter(connect(mapStateToProps)(App))
