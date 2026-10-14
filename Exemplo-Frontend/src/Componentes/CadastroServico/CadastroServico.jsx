
import React, { useState } from "react";
import "./CadastroServico.css";

function CadastroServico() {
  const [form, setForm] = useState({
    descricao: "",
    tipo_servico: "",
    data_agendamento: "",
    status: "",
    valor: "",
    id_cliente: "",
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
      const response = await fetch("http://localhost:3000/Servico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          valor: Number(form.valor),
          id_cliente: Number(form.id_cliente),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar serviço.");
      }

      setMensagem("Serviço cadastrado com sucesso!");

      setForm({
        descricao: "",
        tipo_servico: "",
        data_agendamento: "",
        status: "",
        valor: "",
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
        <h1>Cadastrar serviço</h1>

        <p>
          Preencha os dados para cadastrar um novo serviço no sistema.
        </p>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <label>
            Descrição
            <input
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva o serviço"
              maxLength={255}
              required
            />
          </label>

          <label>
            Tipo de serviço
            <input
              type="text"
              name="tipo_servico"
              value={form.tipo_servico}
              onChange={handleChange}
              placeholder="Ex.: Manutenção preventiva"
              maxLength={100}
              required
            />
          </label>

          <label>
            Data do agendamento
            <input
              type="date"
              name="data_agendamento"
              value={form.data_agendamento}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o status</option>
              <option value="Agendado">Agendado</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </label>

          <label>
            Valor do serviço (R$)
            <input
              type="number"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              placeholder="Ex.: 150.00"
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
            {carregando ? "Cadastrando..." : "Cadastrar serviço"}
          </button>
        </form>

        {mensagem && <p className="sucesso">{mensagem}</p>}
        {erro && <p className="erro">{erro}</p>}
      </div>
    </div>
  );
}

export default CadastroServico;