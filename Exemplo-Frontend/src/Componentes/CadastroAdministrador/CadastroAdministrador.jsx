import React, { useState } from "react";
import "./CadastroAdministrador.css";

function CadastroAdministrador() {
  const [form, setForm] = useState({
    perfil: "",
    nome: "",
    cpf: "",
    email: "",
    senha: "",
  
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setCarregando(true);
    setMensagem("");
    setErro("");

    try {
      const response = await fetch("http://localhost:3000/Cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      console.log("Resposta do servidor:", response);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar administrador.");
      }

      setMensagem("administrador cadastrado com sucesso!");

      setForm({
        perfil: "",
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        endereco: "",
        
      });
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <h1>Cadastrar cliente</h1>
        <p>
          formulario para cadastro de administrador.
        </p>

        <form onSubmit={handleSubmit} className="cadastro-form">
          

          
          <label>
            Nome
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite o nome"
              required
            />
          </label>

          <label>
            CPF
            <input
              type="text"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              placeholder="Digite o CPF"
              required
            />
          </label>

          

          <label>
            E-mail
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Digite o e-mail"
              required
            />
          </label>

          <label>
           Descricao
            <input
              type="text"
              name="endereco"
              value={form.perfil}
              onChange={handleChange}
              placeholder="descreva sua funcao"
              required
            />
          </label>

          
          <button type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {mensagem && <p className="sucesso">{mensagem}</p>}
        {erro && <p className="erro">{erro}</p>}
      </div>
    </div>
  );
}

export default CadastroAdministrador;