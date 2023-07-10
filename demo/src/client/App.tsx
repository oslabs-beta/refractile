import React from 'react';
import { render } from 'react-dom';
import DemoContainer from './Components/DemoContainer';
import './style.css';

const App = () => {
  return (
    <div>
      <h1>Refractile - Wasm Demo</h1>
      <DemoContainer></DemoContainer>
    </div>
  );
};

render(<App />, document.querySelector('#root'));
