
import { Route, Routes } from "react-router-dom";

import CadastroCliente from "./Componentes/CadastroCliente/CadastroCliente";
import CadastroProduto from "./Componentes/CadastroProduto/CadastroProduto";
import CadastroVendas from "./Componentes/CadastroVendas/CadastroVendas";
import CadastroItem_Venda from "./Componentes/CadastroItem_Venda/CadastroItem_Venda";
import CadastroServico from "./Componentes/CadastroServico/CadastroServico";
import CadastroAdministrador from "./Componentes/CadastroAdministrador/CadastroAdministrador";
import CadastroBoletos from "./Componentes/CadastroBoletos/CadastroBoletos";
import { Home } from './Componentes/home/home.jsx';

import "./App.css";

function App() {
  return (
    <Routes>
      {/* Tela de Início */}
      <Route
          path="/Home"
          element={<Home />}
        />

      {/* Tela de cadastro de clientes */}
      <Route
        path="/CadastroCliente"
        element={<CadastroCliente />}
      />

      {/* Tela de cadastro de produtos */}
      <Route
        path="/CadastroProduto"
        element={<CadastroProduto />}
      />

      {/* Tela de cadastro de vendas */}
      <Route
        path="/CadastroVendas"
        element={<CadastroVendas />}
      />

      {/* Tela de cadastro de itens de venda */}
      <Route
        path="/CadastroItem_Venda"
        element={<CadastroItem_Venda />}
      />

      {/* Tela de cadastro de serviços */}
      <Route
        path="/CadastroServico"
        element={<CadastroServico />}
      />

      {/* Tela de cadastro de administradores */}
      <Route
        path="/CadastroAdministrador"
        element={<CadastroAdministrador />}
      />

      {/* Tela de cadastro de boletos */}
      <Route
        path="/CadastroBoletos"
        element={<CadastroBoletos />}
      />
      
    </Routes>
  );
}

export default App;
