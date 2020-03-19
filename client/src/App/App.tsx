import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
import ItemList from '../containers/ItemList';
import Home from '../containers/Home';
import ShoppingCart from '../containers/ShoppingCart';
import SignIn from '../containers/SignIn';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/signin" component={SignIn} />
          <Route path="/items" component={ItemList} />
          <Route path="/cart" component={ShoppingCart} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
