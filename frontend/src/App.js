import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";

import "./App.scss";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route exact path="/" component={Dashboard} />
        </Router>
      </div>
    );
  }
}

export default App;
