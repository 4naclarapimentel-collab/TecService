import { Route, Routes } from "react-router-dom";

import CadastroCliente from "./Componentes/CadastroCliente/CadastroCliente";
import CadastroProduto from "./Componentes/CadastroProduto/CadastroProduto";

import "./App.css";

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
    </Routes>
  );
}

export default App;