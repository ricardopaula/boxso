import React, { useState } from 'react';
import './styles.css';

import logoImg from '../../assets/boxso.png';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-188433010-1');
ReactGA.pageview(window.location.pathname + window.location.search);

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
