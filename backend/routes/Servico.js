
const express = require("express");
const router = express.Router();

// Prisma client centralizado
const prisma = require("../prisma/client");

// LISTAR TODOS OS SERVIÇOS
// GET /Servico
router.get("/", async function (req, res) {
  try {
    const servicos = await prisma.servico.findMany({
      include: {
        cliente: true
      }
    });

    res.status(200).json(servicos);
  } catch (error) {
    console.error("Erro ao listar serviços:", error);
    res.status(500).json({
      error: "Falha ao listar serviços"
    });
  }
});

// BUSCAR UM SERVIÇO POR ID
// GET /Servico/:id_servico
router.get("/:id_servico", async function (req, res) {
  try {
    const id_servico = Number(req.params.id_servico);

    if (!Number.isInteger(id_servico) || id_servico <= 0) {
      return res.status(400).json({
        error: "ID do serviço inválido"
      });
    }

    const servico = await prisma.servico.findUnique({
      where: { id_servico },
      include: {
        cliente: true
      }
    });

    if (!servico) {
      return res.status(404).json({
        error: "Serviço não encontrado"
      });
    }

    return res.status(200).json(servico);
  } catch (error) {
    console.error("Erro ao buscar serviço:", error);
    return res.status(500).json({
      error: "Falha ao buscar serviço"
    });
  }
});

// CRIAR UM NOVO SERVIÇO
// POST /Servico
router.post("/", async function (req, res) {
  try {
    const {
      descricao,
      tipo_servico,
      data_agendamento,
      status,
      valor,
      id_cliente
    } = req.body;

    if (
      !descricao ||
      !tipo_servico ||
      !data_agendamento ||
      !status ||
      valor == null ||
      id_cliente == null
    ) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios."
      });
    }

    const data = new Date(data_agendamento);

    if (
      Number.isNaN(data.getTime()) ||
      !/^\\d{4}-\\d{2}-\\d{2}$/.test(data_agendamento) ||
      data.toISOString().slice(0, 10) !== data_agendamento
    ) {
      return res.status(400).json({
        error: "Data de agendamento inválida. Use o formato AAAA-MM-DD."
      });
    }

    if (
      typeof descricao !== "string" ||
      descricao.length > 255 ||
      typeof tipo_servico !== "string" ||
      tipo_servico.length > 100 ||
      typeof status !== "string" ||
      status.length > 30
    ) {
      return res.status(400).json({
        error: "Verifique os textos e seus limites de caracteres."
      });
    }

    if (
      !Number.isFinite(Number(valor)) ||
      Number(valor) < 0 ||
      !Number.isInteger(Number(id_cliente)) ||
      Number(id_cliente) <= 0
    ) {
      return res.status(400).json({
        error: "Valor ou ID do cliente inválido."
      });
    }

    const servico = await prisma.servico.create({
      data: {
        descricao,
        tipo_servico,
        data_agendamento: data,
        status,
        valor: Number(valor),
        cliente: {
          connect: {
            id_cliente: Number(id_cliente)
          }
        }
      }
    });

    return res.status(201).json(servico);
  } catch (error) {
    console.error("Erro ao criar serviço:", error);

    if (error.code === "P2003" || error.code === "P2025") {
      return res.status(400).json({
        error: "O cliente informado não existe."
      });
    }

    return res.status(500).json({
      error: "Falha ao criar serviço"
    });
  }
});

// ATUALIZAR UM SERVIÇO
// PUT /Servico/:id_servico
router.put("/:id_servico", async function (req, res) {
  try {
    const id_servico = Number(req.params.id_servico);

    if (!Number.isInteger(id_servico) || id_servico <= 0) {
      return res.status(400).json({
        error: "ID do serviço inválido"
      });
    }

    const {
      descricao,
      tipo_servico,
      data_agendamento,
      status,
      valor,
      id_cliente
    } = req.body;

    const dataAtualizacao = {};

    if (
      descricao === undefined &&
      tipo_servico === undefined &&
      data_agendamento === undefined &&
      status === undefined &&
      valor === undefined &&
      id_cliente === undefined
    ) {
      return res.status(400).json({
        error: "Informe ao menos um campo para atualizar."
      });
    }

    if (descricao !== undefined) {
      if (
        typeof descricao !== "string" ||
        !descricao.trim() ||
        descricao.length > 255
      ) {
        return res.status(400).json({
          error: "Descrição inválida."
        });
      }

      dataAtualizacao.descricao = descricao;
    }

    if (tipo_servico !== undefined) {
      if (
        typeof tipo_servico !== "string" ||
        !tipo_servico.trim() ||
        tipo_servico.length > 100
      ) {
        return res.status(400).json({
          error: "Tipo de serviço inválido."
        });
      }

      dataAtualizacao.tipo_servico = tipo_servico;
    }

    if (data_agendamento !== undefined) {
      const data = new Date(data_agendamento);

      if (
        typeof data_agendamento !== "string" ||
        !/^\\d{4}-\\d{2}-\\d{2}$/.test(data_agendamento) ||
        Number.isNaN(data.getTime()) ||
        data.toISOString().slice(0, 10) !== data_agendamento
      ) {
        return res.status(400).json({
          error: "Data inválida. Use o formato AAAA-MM-DD."
        });
      }

      dataAtualizacao.data_agendamento = data;
    }

    if (status !== undefined) {
      if (
        typeof status !== "string" ||
        !status.trim() ||
        status.length > 30
      ) {
        return res.status(400).json({
          error: "Status inválido."
        });
      }

      dataAtualizacao.status = status;
    }

    if (valor !== undefined) {
      if (
        valor === null ||
        !Number.isFinite(Number(valor)) ||
        Number(valor) < 0
      ) {
        return res.status(400).json({
          error: "Valor inválido."
        });
      }

      dataAtualizacao.valor = Number(valor);
    }

    if (id_cliente !== undefined) {
      if (
        !Number.isInteger(Number(id_cliente)) ||
        Number(id_cliente) <= 0
      ) {
        return res.status(400).json({
          error: "ID do cliente inválido."
        });
      }

      dataAtualizacao.cliente = {
        connect: {
          id_cliente: Number(id_cliente)
        }
      };
    }

    const servicoAtualizado = await prisma.servico.update({
      where: { id_servico },
      data: dataAtualizacao
    });

    return res.status(200).json(servicoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Serviço ou cliente não encontrado."
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        error: "O cliente informado não existe."
      });
    }

    return res.status(500).json({
      error: "Falha ao atualizar serviço"
    });
  }
});

// EXCLUIR UM SERVIÇO
// DELETE /Servico/:id_servico
router.delete("/:id_servico", async function (req, res) {
  try {
    const id_servico = Number(req.params.id_servico);

    if (!Number.isInteger(id_servico) || id_servico <= 0) {
      return res.status(400).json({
        error: "ID do serviço inválido"
      });
    }

    await prisma.servico.delete({
      where: { id_servico }
    });

    return res.status(200).json({
      message: "Serviço deletado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Serviço não encontrado para deletar"
      });
    }

    return res.status(500).json({
      error: "Falha ao deletar serviço"
    });
  }
});

module.exports = router;