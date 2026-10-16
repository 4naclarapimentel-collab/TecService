 
import React, { useState } from "react";
import "./CadastroItem_Venda.css";

function CadastroItem_Venda() {
  const [form, setForm] = useState({
    quantidade: "",
    valor_unitario: "",
    id_venda: "",
    id_produto: "",
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
      const response = await fetch(
        "http://localhost:3000/Item_Venda",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantidade: Number(form.quantidade),
            valor_unitario: Number(form.valor_unitario),
            id_venda: Number(form.id_venda),
            id_produto: Number(form.id_produto),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erro ao cadastrar item de venda."
        );
      }

      setMensagem("Item de venda cadastrado com sucesso!");

      setForm({
        quantidade: "",
        valor_unitario: "",
        id_venda: "",
        id_produto: "",
      });
    } catch (error) {
      setErro(error.message || "Não foi possível cadastrar o item.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <h1>Cadastrar item de venda</h1>

        <p>
          Preencha os dados para adicionar um produto a uma venda.
        </p>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <label>
            Quantidade
            <input
              type="number"
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              placeholder="Digite a quantidade"
              min="1"
              step="1"
              required
            />
          </label>

          <label>
            Valor unitário (R$)
            <input
              type="number"
              name="valor_unitario"
              value={form.valor_unitario}
              onChange={handleChange}
              placeholder="Ex.: 49.90"
              min="0"
              step="0.01"
              required
            />
          </label>

          <label>
            ID da venda
            <input
              type="number"
              name="id_venda"
              value={form.id_venda}
              onChange={handleChange}
              placeholder="Digite o ID da venda"
              min="1"
              step="1"
              required
            />
          </label>

          <label>
            ID do produto
            <input
              type="number"
              name="id_produto"
              value={form.id_produto}
              onChange={handleChange}
              placeholder="Digite o ID do produto"
              min="1"
              step="1"
              required
            />
          </label>

          <button type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar item"}
          </button>
        </form>

        {mensagem && <p className="sucesso">{mensagem}</p>}

        {erro && <p className="erro">{erro}</p>}
      </div>
    </div>
  );
}

export default CadastroItem_Venda;
