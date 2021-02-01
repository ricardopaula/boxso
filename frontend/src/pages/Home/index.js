import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';

import api from '../../services/api';

import GridTable from '@nadavshaar/react-grid-table';


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

  function formatDate(date){
    let data = new Date(date);
    return ( ("0" + data.getDate()).slice(-2) + "/" + ("0" + (data.getMonth()+1)).slice(-2) + "/" + data.getFullYear() ) ;
  }

  function formatHour(date){
    let data = new Date(date);
    return ( ("0" + data.getHours()).slice(-2) + ":" + ("0" + data.getMinutes()).slice(-2));
  }

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  let rows = orders.map(order => (
      {
        "status": (order.status === 'confirmed' ? 'Confirmado' : 'Pendente'),
        "valor": `R$ ${order.brlvalue}`,
        "date": formatDate(order.created_at),
        "hour": formatHour(order.created_at)
      }

    ))

  const columns = [
    {
        id: 1,
        field: 'valor',
        label: 'Valor',
    },
    {
        id: 2,
        field: 'status',
        label: 'Status',
    },
    {
      id: 3,
      field: 'date',
      label: 'Data',
    },
    {
      id: 4,
      field: 'hour',
      label: 'Hora',
    }
];

  return (
    <div className="home-container">
      <header>

        <span>Bem vindo, {localStorage.getItem('fantasyName')}</span>

        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Vendas realizadas</h1>

      <GridTable
        columns={columns}
        rows={rows}
        showSearch={false}
        showColumnVisibilityManager={false}
        enableColumnsReorder={false}
        texts={
          {
             search: 'Pesquisa:',
             totalRows: 'Total de linhas:',
             rows: 'Linhas:',
             selected: 'Selecionado:',
             rowsPerPage: 'Linhas por Pag.:',
             page: 'Pag:',
             of: 'de',
             prev: 'Ant',
             next: 'Prox',
             columnVisibility: 'Visibilidade'
          }
        }
      />

    </div>
  );
}
