import { useEffect, useState } from "react";

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

  // Buscar os clientes cadastrados
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

  // Atualizar os campos do formulário
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

    if (Number(formulario.valor) <= 0) {
      setErro(true);
      setMensagem("Informe um valor maior que zero.");
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
      setMensagem(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={estilos.pagina}>
      <section style={estilos.cartao}>
        <h1 style={estilos.titulo}>Cadastro de Boletos</h1>

        <p style={estilos.subtitulo}>
          Preencha os dados para registrar um novo boleto.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={estilos.label} htmlFor="valor">
            Valor (R$)
          </label>

          <input
            style={estilos.input}
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

          <label style={estilos.label} htmlFor="vencimento">
            Data de vencimento
          </label>

          <input
            style={estilos.input}
            id="vencimento"
            name="vencimento"
            type="date"
            value={formulario.vencimento}
            onChange={handleChange}
            required
          />

          <label style={estilos.label} htmlFor="status">
            Status do boleto
          </label>

          <select
            style={estilos.input}
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

          <label style={estilos.label} htmlFor="id_cliente">
            Cliente
          </label>

          <select
            style={estilos.input}
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
                  ? `${cliente.nomeCliente} — ID ${cliente.id_cliente}`
                  : `Cliente ${cliente.id_cliente}`}
              </option>
            ))}
          </select>

          {mensagem && (
            <p
              role="alert"
              style={{
                color: erro ? "#b91c1c" : "#15803d",
                marginTop: 16,
              }}
            >
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            style={{
              ...estilos.botao,
              opacity: carregando ? 0.6 : 1,
            }}
          >
            {carregando ? "Cadastrando..." : "Cadastrar Boleto"}
          </button>
        </form>
      </section>
    </main>
  );
}

const estilos = {
  pagina: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    backgroundColor: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
  },
  cartao: {
    width: "100%",
    maxWidth: "480px",
    padding: "28px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  titulo: {
    marginTop: 0,
    marginBottom: "8px",
    color: "#1f2937",
    fontSize: "26px",
  },
  subtitulo: {
    color: "#6b7280",
    marginBottom: "24px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "16px",
    fontWeight: "bold",
    color: "#374151",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
  },
  botao: {
    width: "100%",
    marginTop: "24px",
    padding: "14px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};