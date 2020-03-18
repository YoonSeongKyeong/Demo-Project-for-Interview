import React from 'react';
import { Button, Alert } from 'antd';
import { Link } from 'react-router-dom';
import './style.css';

// Home에서는 ItemList와 ShoppingCart로 갈 수 있는 링크를 제공한다

const Home: React.FC = () => {
  return (
    <div className="text-center align-center Home">
      <Alert
        message="Home"
        type="info"
        className="width-third-center Home-normal-item"
      />

      <div>
        <Button type="primary" className="Home-normal-item">
          <Link to="/items">ItemList</Link>
        </Button>

        <Button type="primary" className="Home-normal-item">
          <Link to="/cart">WishList</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
