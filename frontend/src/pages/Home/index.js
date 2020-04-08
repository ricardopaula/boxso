import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';
export default function Home (){
  const uuid = localStorage.getItem('uuid')

  const [orders, setSOrders] = useState([]);

  const history = useHistory();

  useEffect(() => {
    api.get(`orders/shopkeepers/${uuid}`).then(response => {
      setSOrders(response.data)
    })
  })

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  return (
    <div className="home-container">
      <header>

        <span>Bem vindo, {localStorage.getItem('fantasyName')}</span>

        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Vendas realizadas</h1>

      <ul>
        {orders.map(order => (
          <li key={order.id}>

            <strong>Valor</strong>
            <p>{order.brlvalue}</p>

            <strong>Status:</strong>
            <p>{order.status}</p>

            <strong>Data:</strong>
            <p>{order.created_at}</p>

          </li>
        ))}
      </ul>
    </div>
  );
}
