import React, { useState } from 'react';
import './styles.css';

import logoImg from '../../assets/boxso.png';

import ReactGA from 'react-ga';
ReactGA.initialize('G-J22JL26WHX');
ReactGA.set({
  page: "início",
})

export default function Logon() {

  return (
    <div className="">

      <div className="container">
        <img  src={logoImg} alt="Boxso"/>
      </div>

      <div className="container">
        <h1>contato@boxso.com.br</h1>
      </div>

    </div>
  )
}
