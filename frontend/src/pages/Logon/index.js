import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import './styles.css';

import heroesImg from '../../assets/boxso.png';

export default function Logon() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await api.post('sessions', { email, password });

      if (response.data.type === 'LOGIN_SUCESSFULL') {
        localStorage.setItem('uuid', response.data.uuid);
        localStorage.setItem('fantasyName', response.data.fantasyname);
        localStorage.setItem('admin', response.data.admin);
        localStorage.setItem('token', response.data.token);


        if(response.data.admin){
          history.push('/admin');
        }else{
          history.push('/home');
        }
      }else{
        alert('Credenciais inválidas');
      }

    } catch (error) {
      alert('Falha no Login, teste novamente');
    }
  }

  return (
    <div className="logon-container">
      <section className="form">
        <form onSubmit={handleLogin}>
          <h1>Entrar na plataforma</h1>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            />

          <input
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
          <button className="button" type="submit">Entrar</button>

        </form>

      </section>
      <img src={heroesImg} alt="Boxso"/>
    </div>
  )
}
