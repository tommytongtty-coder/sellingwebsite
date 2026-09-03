import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import SellPage from './pages/SellPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { LanguageProvider } from './i18n';
import { AuthProvider } from './auth';

const App = () => (
  <AuthProvider>
  <LanguageProvider>
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/admin" component={AdminPage} />
    <Route path="/sell" component={SellPage} />
    <Route path="/user" component={UserPage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/register" component={RegisterPage} />
  </Switch>
  </LanguageProvider>
  </AuthProvider>
);

export default App;
