import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
import ItemList from '../containers/ItemList/ItemList';
import Home from '../containers/Home/Home';
import ShoppingCart from '../containers/ShoppingCart/ShoppingCart';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/items" component={ItemList} />
          <Route path="/cart" component={ShoppingCart} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
