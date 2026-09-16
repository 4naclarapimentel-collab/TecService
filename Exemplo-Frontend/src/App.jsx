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

export default App;