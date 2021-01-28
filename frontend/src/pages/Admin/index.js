import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';

import GridTable from '@nadavshaar/react-grid-table';

import api from '../../services/api';

import './styles.css';
export default function Admin (){
  const [shopkeepers, setShopkeepers] = useState([]);

  const history = useHistory();

  useEffect(() => {
    api.get('shopkeepers').then(response => {
      setShopkeepers(response.data)
    })
  })

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  let rows = shopkeepers.map(shopkeeper => (
    {
      "id": shopkeeper.id,
      "fantasyname": shopkeeper.fantasyname,
      "ownername": shopkeeper.ownername,
      "cpfcnpj": shopkeeper.cpfcnpj,
      "email": shopkeeper.email,
      "city": shopkeeper.city,
      "uf": shopkeeper.uf,
      "phone": shopkeeper.phone,
      "cell": shopkeeper.cell,
      "bank": shopkeeper.bank,
      "ag": shopkeeper.ag,
      "cc": shopkeeper.cc
    }
  ))

  const columns = [
    {
        id: 1,
        field: 'id',
        label: 'ID',
        width: '80px'
    },
    {
        id: 2,
        field: 'fantasyname',
        label: 'Nome Fantasia',
    },
    {
      id: 3,
      field: 'ownername',
      label: 'Responsável',
    },
    {
      id: 4,
      field: 'cpfcnpj',
      label: 'CPF/CNPJ',
      width: '170px'
    },
    {
      id: 5,
      field: 'email',
      label: 'Email',
      width: '300px'
    },
    {
      id: 6,
      field: 'city',
      label: 'Cidade',
    },
    {
      id: 7,
      field: 'uf',
      label: 'UF',
      width: '70px'
    },
    {
      id: 8,
      field: 'phone',
      label: 'Telefone',
      width: '150px'
    },
    {
      id: 9,
      field: 'cell',
      label: 'Celular',
      width: '150px'
    },
    {
      id: 10,
      field: 'bank',
      label: 'Banco',
    },
    {
      id: 11,
      field: 'ag',
      label: 'AG',
      width: '100px'
    },
    {
      id: 12,
      field: 'cc',
      label: 'CC',
      width: '100px'
    }
  ];


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

      <GridTable
        columns={columns}
        rows={rows}
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
