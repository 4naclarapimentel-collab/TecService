import { Route, Routes } from "react-router-dom";
import CadastroCliente from "./Componentes/CadastroCliente/CadastroCliente";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/CadastroCliente" element={<CadastroCliente />} />
    </Routes>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/CadastroBoletos" element={<CadastroBoletos />} />
    </Routes>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/CadastroServico" element={<CadastroServico />} />
    </Routes>
  );
}

export default App;