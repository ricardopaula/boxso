import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';
export default function Admin (){
  const [shopkeepers, setShopkeepers] = useState([]);

  const history = useHistory();

  const token = localStorage.getItem('token')

  useEffect(() => {
    api.get('shopkeepers', { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
      setShopkeepers(response.data)
    })
  })

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  return (
    <div className="admin-container">
      <header>

        <span>Bem vindo, {localStorage.getItem('fantasyName')}</span>

        <Link className="button" to="/shopkeeper/new">Cadastrar novo Lojista </Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Lojistas cadastrados</h1>

      <ul>
        {shopkeepers.map(shopkeeper => (
          <li key={shopkeeper.id}>

            <strong>Responsável</strong>
            <p>{shopkeeper.ownername}</p>

            <strong>Nome fantasia:</strong>
            <p>{shopkeeper.fantasyname}</p>

          </li>
        ))}
      </ul>
    </div>
  );
}
