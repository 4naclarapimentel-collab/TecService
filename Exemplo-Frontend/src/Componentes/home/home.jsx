import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

export function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <h1>Painel de Controle</h1>
        <p>Selecione uma opção abaixo para navegar no sistema</p>
      </header>

      <main className="grid-container">
        <Link to="/CadastroVendas" className="card">
          <div className="card-icon">📊</div>
          <h2>Vendas</h2>
          <p>Gerencie o cadastro e relatórios de vendas.</p>
        </Link>

        <Link to="/CadastroItem_Venda" className="card">
          <div className="card-icon">📦</div>
          <h2>Itens de Venda</h2>
          <p>Cadastre os produtos e itens disponíveis.</p>
        </Link>

        <Link to="/CadastroServico" className="card">
          <div className="card-icon">🛠️</div>
          <h2>Serviços</h2>
          <p>Gerencie os serviços oferecidos no sistema.</p>
        </Link>

        <Link to="/CadastroAdministrador" className="card">
          <div className="card-icon">👤</div>
          <h2>Administradores</h2>
          <p>Controle de acesso e administradores.</p>
        </Link>

        <Link to="/CadastroBoletos" className="card">
          <div className="card-icon">📄</div>
          <h2>Boletos</h2>
          <p>Emissão e gerenciamento de boletos.</p>
        </Link>
      </main>
    </div>
  );
}