import React, { useState } from "react";
import "./CadastroProduto.css";

function CadastroProduto() {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco_venda: "",
    quantidade_historico: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setCarregando(true);
    setMensagem("");
    setErro("");

    try {
      const response = await fetch("http://localhost:3000/Produto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          preco_venda: Number(form.preco_venda),
          quantidade_historico: Number(form.quantidade_historico),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar produto.");
      }

      setMensagem("Produto cadastrado com sucesso!");

      setForm({
        nome: "",
        descricao: "",
        preco_venda: "",
        quantidade_historico: "",
      });
    } catch (error) {
      setErro(error.message || "Não foi possível cadastrar o produto.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <h1>Cadastrar produto</h1>

        <p>
          Preencha os dados para cadastrar um novo produto no sistema.
        </p>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <label>
            Nome do produto
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex.: Câmera de segurança"
              maxLength={100}
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva as características do produto"
              maxLength={255}
              required
            />
          </label>

          <label>
            Preço de venda (R$)
            <input
              type="number"
              name="preco_venda"
              value={form.preco_venda}
              onChange={handleChange}
              placeholder="Ex.: 299.90"
              min="0"
              step="0.01"
              required
            />
          </label>

          <label>
            Quantidade
            <input
              type="number"
              name="quantidade_historico"
              value={form.quantidade_historico}
              onChange={handleChange}
              placeholder="Digite a quantidade"
              min="0"
              step="1"
              required
            />
          </label>

          <button type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar produto"}
          </button>
        </form>

        {mensagem && <p className="sucesso">{mensagem}</p>}
        {erro && <p className="erro">{erro}</p>}
      </div>
    </div>
  );
}

export default CadastroProduto;