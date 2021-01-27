import React, { useState } from 'react';

import heroesImg from '../../assets/boxso.png';

export default function Logon() {

  var style = {
    textalign: "center",
    display: "block",
    justifycontent: "center",
    alignitems: "center",
    margin: "auto",
    width: '50%'

  };

  return (
    <div className="logon-container">
      <img style={style} src={heroesImg} alt="Boxso"/>
    </div>
  )
}
