import React, { useState } from "react";
import "./CadastroVendas.css";

function CadastroVenda() {
  const [form, setForm] = useState({
    data_venda: "",
    valor_total: "",
    id_cliente: "",
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
      const response = await fetch("http://localhost:3000/Vendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          valor_total: Number(form.valor_total),
          id_cliente: Number(form.id_cliente),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar venda.");
      }

      setMensagem("Venda cadastrada com sucesso!");

      setForm({
        data_venda: "",
        valor_total: "",
        id_cliente: "",
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
        <h1>Cadastrar venda</h1>

        <p>
          Preencha os dados para registrar uma nova venda no sistema.
        </p>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <label>
            Data da venda
            <input
              type="date"
              name="data_venda"
              value={form.data_venda}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Valor total (R$)
            <input
              type="number"
              name="valor_total"
              value={form.valor_total}
              onChange={handleChange}
              placeholder="Ex.: 250.00"
              min="0"
              step="0.01"
              required
            />
          </label>

          <label>
            ID do cliente
            <input
              type="number"
              name="id_cliente"
              value={form.id_cliente}
              onChange={handleChange}
              placeholder="Digite o ID do cliente"
              min="1"
              step="1"
              required
            />
          </label>

          <button type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar venda"}
          </button>
        </form>

        {mensagem && <p className="sucesso">{mensagem}</p>}
        {erro && <p className="erro">{erro}</p>}
      </div>
    </div>
  );
}

export default CadastroVendas;
