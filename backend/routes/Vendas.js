const express = require("express");
const router = express.Router();

// Prisma Client centralizado
const prisma = require("../prisma/Vendas");

// LISTAR TODAS AS VENDAS
// GET /Vendas
router.get("/", async function (req, res) {
  try {
    const vendas = await prisma.vendas.findMany({
      include: {
        cliente: true,
        itens_venda: true
      }
    });

    return res.status(200).json(vendas);
  } catch (error) {
    console.error("Erro ao listar vendas:", error);
    return res.status(500).json({
      error: "Falha ao listar vendas"
    });
  }
});

// BUSCAR UMA VENDA POR ID
// GET /Vendas/:id_vendas
router.get("/:id_vendas", async function (req, res) {
  try {
    const id_vendas = Number(req.params.id_vendas);

    if (!Number.isInteger(id_vendas) || id_vendas <= 0) {
      return res.status(400).json({
        error: "ID da venda inválido"
      });
    }

    const venda = await prisma.vendas.findUnique({
      where: { id_vendas },
      include: {
        cliente: true,
        itens_venda: true
      }
    });

    if (!venda) {
      return res.status(404).json({
        error: "Venda não encontrada"
      });
    }

    return res.status(200).json(venda);
  } catch (error) {
    console.error("Erro ao buscar venda:", error);
    return res.status(500).json({
      error: "Falha ao buscar venda"
    });
  }
});

// CRIAR UMA NOVA VENDA
// POST /Vendas
router.post("/", async function (req, res) {
  try {
    const { data_venda, valor_total, id_cliente } = req.body;

    if (
      !data_venda ||
      valor_total === undefined ||
      valor_total === null ||
      id_cliente === undefined ||
      id_cliente === null
    ) {
      return res.status(400).json({
        error: "Data da venda, valor total e ID do cliente são obrigatórios."
      });
    }

    const data = new Date(data_venda);
    const valor = Number(valor_total);
    const clienteId = Number(id_cliente);

    if (Number.isNaN(data.getTime())) {
      return res.status(400).json({
        error: "Data da venda inválida."
      });
    }

    if (!Number.isFinite(valor) || valor < 0) {
      return res.status(400).json({
        error: "Valor total inválido."
      });
    }

    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      return res.status(400).json({
        error: "ID do cliente inválido."
      });
    }

    const venda = await prisma.vendas.create({
      data: {
        data_venda: data,
        valor_total: valor,
        cliente: {
          connect: {
            id_cliente: clienteId
          }
        }
      },
      include: {
        cliente: true,
        itens_venda: true
      }
    });

    return res.status(201).json(venda);
  } catch (error) {
    console.error("Erro ao criar venda:", error);

    if (error.code === "P2003" || error.code === "P2025") {
      return res.status(400).json({
        error: "O cliente informado não existe."
      });
    }

    return res.status(500).json({
      error: "Falha ao criar venda"
    });
  }
});

// ATUALIZAR UMA VENDA
// PUT /Vendas/:id_vendas
router.put("/:id_vendas", async function (req, res) {
  try {
    const id_vendas = Number(req.params.id_vendas);
    const { data_venda, valor_total, id_cliente } = req.body;

    if (!Number.isInteger(id_vendas) || id_vendas <= 0) {
      return res.status(400).json({
        error: "ID da venda inválido."
      });
    }

    const data = {};

    if (data_venda !== undefined) {
      const dataConvertida = new Date(data_venda);

      if (Number.isNaN(dataConvertida.getTime())) {
        return res.status(400).json({
          error: "Data da venda inválida."
        });
      }

      data.data_venda = dataConvertida;
    }

    if (valor_total !== undefined) {
      const valor = Number(valor_total);

      if (!Number.isFinite(valor) || valor < 0) {
        return res.status(400).json({
          error: "Valor total inválido."
        });
      }

      data.valor_total = valor;
    }

    if (id_cliente !== undefined) {
      const clienteId = Number(id_cliente);

      if (!Number.isInteger(clienteId) || clienteId <= 0) {
        return res.status(400).json({
          error: "ID do cliente inválido."
        });
      }

      data.cliente = {
        connect: {
          id_cliente: clienteId
        }
      };
    }

    const vendaAtualizada = await prisma.vendas.update({
      where: { id_vendas },
      data,
      include: {
        cliente: true,
        itens_venda: true
      }
    });

    return res.status(200).json(vendaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar venda:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Venda ou cliente não encontrado."
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        error: "O cliente informado não existe."
      });
    }

    return res.status(500).json({
      error: "Falha ao atualizar venda"
    });
  }
});

// EXCLUIR UMA VENDA
// DELETE /Vendas/:id_vendas
router.delete("/:id_vendas", async function (req, res) {
  try {
    const id_vendas = Number(req.params.id_vendas);

    if (!Number.isInteger(id_vendas) || id_vendas <= 0) {
      return res.status(400).json({
        error: "ID da venda inválido."
      });
    }

    await prisma.vendas.delete({
      where: { id_vendas }
    });

    return res.status(200).json({
      message: "Venda deletada com sucesso."
    });
  } catch (error) {
    console.error("Erro ao excluir venda:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Venda não encontrada para deletar."
      });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        error: "Não foi possível excluir a venda porque existem registros relacionados."
      });
    }

    return res.status(500).json({
      error: "Falha ao deletar venda"
    });
  }
});

module.exports = router;