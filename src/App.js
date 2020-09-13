import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import { Product } from './components/Product';
import { Header } from './components/Header';
import { Footer } from './components/Footer';



function App() {
  return (
    <Router>
      <Header></Header>
      <div className="App">
        <Switch>
          <Route path="/:id" component={Product} />
        </Switch>
      </div>
      <Footer></Footer>
    </Router>
  );
}

export default App;
