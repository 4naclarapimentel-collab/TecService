import { useEffect, useState } from "react";
import "./CadastroBoletos.css";

export default function CadastroBoletos() {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState({
    valor: "",
    vencimento: "",
    status: "Pendente",
    id_cliente: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  // Buscar clientes cadastrados
  useEffect(() => {
    async function buscarClientes() {
      try {
        const resposta = await fetch("/api/clientes");

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os clientes.");
        }

        const dados = await resposta.json();
        setClientes(dados);
      } catch (error) {
        setErro(true);
        setMensagem(error.message);
      }
    }

    buscarClientes();
  }, []);

  // Atualizar os campos
  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  // Cadastrar boleto
  async function handleSubmit(event) {
    event.preventDefault();
    setMensagem("");
    setErro(false);

    if (!formulario.id_cliente) {
      setErro(true);
      setMensagem("Selecione um cliente.");
      return;
    }

    if (
      !Number.isFinite(Number(formulario.valor)) ||
      Number(formulario.valor) <= 0
    ) {
      setErro(true);
      setMensagem("Informe um valor válido maior que zero.");
      return;
    }

    if (!formulario.vencimento) {
      setErro(true);
      setMensagem("Informe a data de vencimento.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("/api/boletos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valor: Number(formulario.valor),
          vencimento: formulario.vencimento,
          status: formulario.status,
          id_cliente: Number(formulario.id_cliente),
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || dados.message || "Erro ao cadastrar boleto."
        );
      }

      setMensagem("Boleto cadastrado com sucesso!");

      setFormulario({
        valor: "",
        vencimento: "",
        status: "Pendente",
        id_cliente: "",
      });
    } catch (error) {
      setErro(true);
      setMensagem(error.message || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="cadastro-boletos">
      <section className="boleto-card">
        <h1 className="boleto-titulo">Cadastro de Boletos</h1>

        <p className="boleto-subtitulo">
          Preencha os dados para registrar um novo boleto.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="boleto-campo">
            <label htmlFor="valor">Valor (R$)</label>
            <input
              id="valor"
              name="valor"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Ex.: 150.00"
              value={formulario.valor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="boleto-campo">
            <label htmlFor="vencimento">Data de vencimento</label>
            <input
              id="vencimento"
              name="vencimento"
              type="date"
              value={formulario.vencimento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="boleto-campo">
            <label htmlFor="status">Status do boleto</label>
            <select
              id="status"
              name="status"
              value={formulario.status}
              onChange={handleChange}
              required
            >
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
              <option value="Vencido">Vencido</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="boleto-campo">
            <label htmlFor="id_cliente">Cliente</label>
            <select
              id="id_cliente"
              name="id_cliente"
              value={formulario.id_cliente}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um cliente</option>

              {clientes.map((cliente) => (
                <option
                  key={cliente.id_cliente}
                  value={cliente.id_cliente}
                >
                  {cliente.nomeCliente
                    ? `${cliente.nomeCliente} - ID ${cliente.id_cliente}`
                    : `Cliente ${cliente.id_cliente}`}
                </option>
              ))}
            </select>
          </div>

          {mensagem && (
            <p
              className={`boleto-mensagem ${
                erro ? "mensagem-erro" : "mensagem-sucesso"
              }`}
              role="alert"
            >
              {mensagem}
            </p>
          )}

          <button
            className="boleto-botao"
            type="submit"
            disabled={carregando}
          >
            {carregando ? "Cadastrando..." : "Cadastrar Boleto"}
          </button>
        </form>
      </section>
    </main>
  );
}