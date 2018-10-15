import React from 'react';
import { Switch, Route } from 'react-router';

import HomePage from './containers/HomePage';
import SettingsPage from './containers/SettingsPage';
import ResetPage from './containers/ResetPage';
import AboutPage from './containers/AboutPage';

export default (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/settings" component={SettingsPage} />
    <Route exact path="/reset" component={ResetPage} />
    <Route exact path="/about" component={AboutPage} />
  </Switch>
);
