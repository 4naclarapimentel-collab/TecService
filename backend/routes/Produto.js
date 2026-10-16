const express = require("express");
const router = express.Router();

// Usa o Prisma Client centralizado
const prisma = require("../prisma/client");

// LISTAR TODOS OS PRODUTOS
// GET /Produto
router.get("/", async function (req, res) {
  try {
    const produtos = await prisma.produto.findMany();

    return res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);

    return res.status(500).json({
      error: "Falha ao listar produtos",
    });
  }
});

// BUSCAR UM PRODUTO PELO ID
// GET /Produto/:id_produto
router.get("/:id_produto", async function (req, res) {
  try {
    const id_produto = Number(req.params.id_produto);

    if (!Number.isInteger(id_produto) || id_produto <= 0) {
      return res.status(400).json({
        error: "ID do produto inválido.",
      });
    }

    const produto = await prisma.produto.findUnique({
      where: { id_produto },
    });

    if (!produto) {
      return res.status(404).json({
        error: "Produto não encontrado.",
      });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);

    return res.status(500).json({
      error: "Falha ao buscar produto",
    });
  }
});

// CRIAR UM NOVO PRODUTO
// POST /Produto
router.post("/", async function (req, res) {
  try {
    const {
      nome,
      descricao,
      preco_venda,
      quantidade_historico,
    } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      typeof descricao !== "string" ||
      !descricao.trim() ||
      preco_venda === undefined ||
      preco_venda === null ||
      preco_venda === "" ||
      quantidade_historico === undefined ||
      quantidade_historico === null ||
      quantidade_historico === ""
    ) {
      return res.status(400).json({
        error: "Preencha todos os campos obrigatórios.",
      });
    }

    const preco = Number(preco_venda);
    const quantidade = Number(quantidade_historico);

    if (!Number.isFinite(preco) || preco < 0) {
      return res.status(400).json({
        error: "Informe um preço válido.",
      });
    }

    if (!Number.isInteger(quantidade) || quantidade < 0) {
      return res.status(400).json({
        error: "Informe uma quantidade inteira válida.",
      });
    }

    const produto = await prisma.produto.create({
      data: {
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco_venda: preco,
        quantidade_historico: quantidade,
      },
    });

    return res.status(201).json(produto);
  } catch (error) {
    console.error(
      "Erro ao criar produto:",
      error?.message || error
    );

    return res.status(500).json({
      error: "Falha ao criar produto",
    });
  }
});

// ATUALIZAR UM PRODUTO
// PUT /Produto/:id_produto
router.put("/:id_produto", async function (req, res) {
  try {
    const id_produto = Number(req.params.id_produto);

    if (!Number.isInteger(id_produto) || id_produto <= 0) {
      return res.status(400).json({
        error: "ID do produto inválido.",
      });
    }

    const {
      nome,
      descricao,
      preco_venda,
      quantidade_historico,
    } = req.body;

    const data = {};

    if (nome !== undefined) {
      if (typeof nome !== "string" || !nome.trim()) {
        return res.status(400).json({
          error: "Informe um nome válido.",
        });
      }

      data.nome = nome.trim();
    }

    if (descricao !== undefined) {
      if (
        typeof descricao !== "string" ||
        !descricao.trim()
      ) {
        return res.status(400).json({
          error: "Informe uma descrição válida.",
        });
      }

      data.descricao = descricao.trim();
    }

    if (preco_venda !== undefined) {
      if (preco_venda === "" || preco_venda === null) {
        return res.status(400).json({
          error: "Informe um preço válido.",
        });
      }

      const preco = Number(preco_venda);

      if (!Number.isFinite(preco) || preco < 0) {
        return res.status(400).json({
          error: "Informe um preço válido.",
        });
      }

      data.preco_venda = preco;
    }

    if (quantidade_historico !== undefined) {
      if (
        quantidade_historico === "" ||
        quantidade_historico === null
      ) {
        return res.status(400).json({
          error: "Informe uma quantidade válida.",
        });
      }

      const quantidade = Number(quantidade_historico);

      if (!Number.isInteger(quantidade) || quantidade < 0) {
        return res.status(400).json({
          error: "Informe uma quantidade inteira válida.",
        });
      }

      data.quantidade_historico = quantidade;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        error: "Informe pelo menos um campo para atualizar.",
      });
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id_produto },
      data,
    });

    return res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Produto não encontrado para atualizar.",
      });
    }

    return res.status(500).json({
      error: "Falha ao atualizar produto",
    });
  }
});

// EXCLUIR UM PRODUTO
// DELETE /Produto/:id_produto
router.delete("/:id_produto", async function (req, res) {
  try {
    const id_produto = Number(req.params.id_produto);

    if (!Number.isInteger(id_produto) || id_produto <= 0) {
      return res.status(400).json({
        error: "ID do produto inválido.",
      });
    }

    await prisma.produto.delete({
      where: { id_produto },
    });

    return res.status(200).json({
      message: "Produto excluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Produto não encontrado para excluir.",
      });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        error: "Não é possível excluir o produto porque ele está vinculado a uma venda.",
      });
    }

    return res.status(500).json({
      error: "Falha ao excluir produto",
    });
  }
});

module.exports = router;