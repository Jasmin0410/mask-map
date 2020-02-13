import React from 'react';
import './style/style.scss';
import './style/reset.css';
import MaskMap from './Component/MaskMap';
import NavBar from './Component/NavBar';


function App() {
  return (
    <div className="container">
      <NavBar />
      <MaskMap />
    </div>
  );
}


export default App;
