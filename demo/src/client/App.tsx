import React from 'react';
import { render } from 'react-dom';
import DemoContainer from './Components/DemoContainer';
import './style.css';
import Header from './Components/Header';
import Footer from './Components/Footer';

const App = () => {
  return (
    <>
      <Header />
      <DemoContainer />
      <Footer />
    </>
  );
};

render(<App />, document.querySelector('#root'));
