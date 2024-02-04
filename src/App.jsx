import React from 'react';
import PokemonSearch2 from './PokemonSearch_v2';
import './App.css'
import monLogo from './assets/monsterfinder-logo.png';
import mementoLogo from './assets/Memento_white_logo.png';

function App() {
  return (
    <>
    {/* <img src={mementoLogo} className="nin-logo"></img> */}
    <div className='super-container'>
      <img src={monLogo} className="logo"></img>
      <PokemonSearch2 />
    </div>
    </>
  )
}

export default App
