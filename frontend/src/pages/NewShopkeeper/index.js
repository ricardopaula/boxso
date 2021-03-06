import React, { useState } from 'react';
import './styles.css';

import api from '../../services/api';

import { Link, useHistory } from 'react-router-dom';

export default function Profile (){

  const [ownername, setOwnername] = useState();
  const [fantasyname, setFantasyname] = useState();
  const [cpfcnpj, setCpfcnpj] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [address, setAddress] = useState();
  const [addressnumber, setAddressnumber] = useState();
  const [neighborhood, setNeighborhood] = useState();
  const [city, setCity] = useState();
  const [uf, setUf] = useState();
  const [phone, setPhone] = useState();
  const [cell, setCell] = useState();
  const [bank, setBank] = useState();
  const [ag, setAg] = useState();
  const [cc, setCc] = useState();

  const history = useHistory();

  async function handleNewShopkeeper(e) {
    e.preventDefault();

    const data = {
      ownername,
      fantasyname,
      cpfcnpj,
      email,
      password,
      address,
      addressnumber,
      neighborhood,
      city,
      uf,
      phone,
      cell,
      bank,
      ag,
      cc,
    }

    try {
      await api.post('shopkeepers', data)
      history.push('/admin');
    } catch (error) {
      alert('Erro ao cadastrar lojista')
    }
  }

  return (
    <div className="new-shopkeeper-container">
      <div className="content">

        <form onSubmit={handleNewShopkeeper}>

          <div className="container">
            <h1>Cadastrar novo lojista</h1>
          </div>

          <div className="container">
            <input
              placeholder="Nome do responsável"
              value={ownername}
              onChange={e => setOwnername(e.target.value)}
            />

            <input
              placeholder="Nome fantasia"
              value={fantasyname}
              onChange={e => setFantasyname(e.target.value)}
            />
          </div>

          <div className="container">
            <input
              placeholder="CPF / CNPJ"
              value={cpfcnpj}
              onChange={e => setCpfcnpj(e.target.value)}
            />

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
          </div>

          <div className="container">
            <input
              placeholder="Endereço"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className="container">
            <input
              placeholder="Numero"
              value={addressnumber}
              onChange={e => setAddressnumber(e.target.value)}
            />

            <input
              placeholder="Complemento"
              value={neighborhood}
              onChange={e => setNeighborhood(e.target.value)}
            />

            <input
              placeholder="Cidade"
              value={city}
              onChange={e => setCity(e.target.value)}
            />

            <input
              placeholder="UF"
              value={uf}
              onChange={e => setUf(e.target.value)}
            />
          </div>

          <div className="container">
            <input
              placeholder="Celular"
              value={cell}
              onChange={e => setCell(e.target.value)}
            />

            <input
              placeholder="Telefone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className="container">
            <input
              placeholder="Banco"
              value={bank}
              onChange={e => setBank(e.target.value)}
            />

            <input
              placeholder="Agencia"
              value={ag}
              onChange={e => setAg(e.target.value)}
            />

            <input
              placeholder="Conta"
              value={cc}
              onChange={e => setCc(e.target.value)}
            />
          </div>

          <div className="container">
            <Link className="button" to="/admin">Cancelar</Link>
            <button className="button" type="submit"> Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
