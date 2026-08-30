import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import SellPage from './pages/SellPage';
import UserPage from './pages/UserPage';
import { LanguageProvider } from './i18n';

const App = () => (
  <LanguageProvider>
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/admin" component={AdminPage} />
    <Route path="/sell" component={SellPage} />
    <Route path="/user" component={UserPage} />
  </Switch>
  </LanguageProvider>
);

export default App;
