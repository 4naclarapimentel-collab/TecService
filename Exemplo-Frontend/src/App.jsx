import { Route, Routes } from "react-router-dom";

import CadastroCliente from "./Componentes/CadastroCliente/CadastroCliente";
import CadastroProduto from "./Componentes/CadastroProduto/CadastroProduto";

import "./App.css";
import CadastroItem_Venda from "./Componentes/CadastroItem_Venda/CadastroItem_Venda";

function App() {
  return (
    <Routes>
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

      {/* Tela de cadastro de venda */}
      <Route
        path="/CadastroVenda"
        element={<CadastroVenda/>}
      />
    </Routes>

    
  );
}



export default App;