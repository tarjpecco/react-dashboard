import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import { Provider } from "react-redux";
import "./App.scss";

const App = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route exact path="/" component={Dashboard} />
    </Router>
  </Provider>
);

export default App;
