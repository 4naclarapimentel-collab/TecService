
const express = require("express");
const router = express.Router();

// Prisma client centralizado
const prisma = require("../prisma/client");

// LISTAR TODOS OS ITENS DE VENDA
// GET /Item_Venda
router.get("/", async function (req, res) {
  try {
    const itensVenda = await prisma.item_Venda.findMany({
      include: {
        venda: true,
        produto: true
      }
    });

    res.status(200).json(itensVenda);
  } catch (error) {
    console.error("Erro ao listar itens de venda:", error);
    res.status(500).json({
      error: "Falha ao listar itens de venda"
    });
  }
});

// BUSCAR UM ITEM DE VENDA POR ID
// GET /Item_Venda/:id_item_venda
router.get("/:id_item_venda", async function (req, res) {
  try {
    const id_item_venda = Number(req.params.id_item_venda);

    if (!Number.isInteger(id_item_venda) || id_item_venda <= 0) {
      return res.status(400).json({
        error: "ID do item de venda inválido"
      });
    }

    const itemVenda = await prisma.item_Venda.findUnique({
      where: { id_item_venda },
      include: {
        venda: true,
        produto: true
      }
    });

    if (!itemVenda) {
      return res.status(404).json({
        error: "Item de venda não encontrado"
      });
    }

    return res.status(200).json(itemVenda);
  } catch (error) {
    console.error("Erro ao buscar item de venda:", error);
    return res.status(500).json({
      error: "Falha ao buscar item de venda"
    });
  }
});

// CRIAR UM NOVO ITEM DE VENDA
// POST /Item_Venda
router.post("/", async function (req, res) {
  try {
    const {
      quantidade,
      valor_unitario,
      id_venda,
      id_produto
    } = req.body;

    if (
      quantidade == null ||
      valor_unitario == null ||
      id_venda == null ||
      id_produto == null
    ) {
      return res.status(400).json({
        error: "Quantidade, valor unitário, ID da venda e ID do produto são obrigatórios."
      });
    }

    if (
      !Number.isInteger(Number(quantidade)) ||
      Number(quantidade) <= 0 ||
      !Number.isFinite(Number(valor_unitario)) ||
      Number(valor_unitario) < 0 ||
      !Number.isInteger(Number(id_venda)) ||
      !Number.isInteger(Number(id_produto))
    ) {
      return res.status(400).json({
        error: "Verifique a quantidade, o valor unitário e os IDs informados."
      });
    }

    const itemVenda = await prisma.item_Venda.create({
      data: {
        quantidade: Number(quantidade),
        valor_unitario: Number(valor_unitario),
        venda: {
          connect: {
            id_vendas: Number(id_venda)
          }
        },
        produto: {
          connect: {
            id_produto: Number(id_produto)
          }
        }
      }
    });

    return res.status(201).json(itemVenda);
  } catch (error) {
    console.error("Erro ao criar item de venda:", error);

    if (error.code === "P2003" || error.code === "P2025") {
      return res.status(400).json({
        error: "A venda ou o produto informado não existe."
      });
    }

    return res.status(500).json({
      error: "Falha ao criar item de venda"
    });
  }
});

// ATUALIZAR UM ITEM DE VENDA
// PUT /Item_Venda/:id_item_venda
router.put("/:id_item_venda", async function (req, res) {
  try {
    const id_item_venda = Number(req.params.id_item_venda);

    if (!Number.isInteger(id_item_venda) || id_item_venda <= 0) {
      return res.status(400).json({
        error: "ID do item de venda inválido"
      });
    }

    const {
      quantidade,
      valor_unitario,
      id_venda,
      id_produto
    } = req.body;

    if (
      quantidade == null &&
      valor_unitario == null &&
      id_venda == null &&
      id_produto == null
    ) {
      return res.status(400).json({
        error: "Informe ao menos um campo para atualizar."
      });
    }

    const data = {};

    if (quantidade != null) {
      if (!Number.isInteger(Number(quantidade)) || Number(quantidade) <= 0) {
        return res.status(400).json({
          error: "A quantidade deve ser um número inteiro positivo."
        });
      }

      data.quantidade = Number(quantidade);
    }

    if (valor_unitario != null) {
      if (
        !Number.isFinite(Number(valor_unitario)) ||
        Number(valor_unitario) < 0
      ) {
        return res.status(400).json({
          error: "O valor unitário deve ser um número válido e não negativo."
        });
      }

      data.valor_unitario = Number(valor_unitario);
    }

    if (id_venda != null) {
      if (!Number.isInteger(Number(id_venda))) {
        return res.status(400).json({
          error: "ID da venda inválido."
        });
      }

      data.venda = {
        connect: {
          id_vendas: Number(id_venda)
        }
      };
    }

    if (id_produto != null) {
      if (!Number.isInteger(Number(id_produto))) {
        return res.status(400).json({
          error: "ID do produto inválido."
        });
      }

      data.produto = {
        connect: {
          id_produto: Number(id_produto)
        }
      };
    }

    const itemAtualizado = await prisma.item_Venda.update({
      where: { id_item_venda },
      data
    });

    return res.status(200).json(itemAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar item de venda:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Item de venda, venda ou produto não encontrado."
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        error: "A venda ou o produto informado não existe."
      });
    }

    return res.status(500).json({
      error: "Falha ao atualizar item de venda"
    });
  }
});

// EXCLUIR UM ITEM DE VENDA
// DELETE /Item_Venda/:id_item_venda
router.delete("/:id_item_venda", async function (req, res) {
  try {
    const id_item_venda = Number(req.params.id_item_venda);

    if (!Number.isInteger(id_item_venda) || id_item_venda <= 0) {
      return res.status(400).json({
        error: "ID do item de venda inválido"
      });
    }

    await prisma.item_Venda.delete({
      where: { id_item_venda }
    });

    return res.status(200).json({
      message: "Item de venda deletado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao excluir item de venda:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Item de venda não encontrado para deletar"
      });
    }

    return res.status(500).json({
      error: "Falha ao deletar item de venda"
    });
  }
});

module.exports = router;