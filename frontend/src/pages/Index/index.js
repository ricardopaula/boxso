import React from 'react';
import './styles.css';

import logoImg from '../../assets/logo_boxso_transparent.png';
import funcionamentoImg from '../../assets/boxso_funcionamento.png';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-188433010-1');
ReactGA.pageview(window.location.pathname + window.location.search);

export default function Logon() {

  return (
    <div className="">

      <div className="logo">
        <img  src={logoImg} alt="Boxso"/>
      </div>

      <div className="image">
        <img  src={funcionamentoImg} alt="Boxso"/>
      </div>

      <div className="container">
        <h1>contato@boxso.com.br</h1>
      </div>

    </div>
  )
}
