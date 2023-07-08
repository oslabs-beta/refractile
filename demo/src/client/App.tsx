import React from 'react';
import { render } from 'react-dom';

const App = () => {
  return (
    <div>
      <h1>Refractile - Wasm Demo</h1>
    </div>
  );
}

render(<App />, document.querySelector('#root'));