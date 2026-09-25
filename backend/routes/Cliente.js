const express = require("express");
const router = express.Router();

// Usa o Prisma client centralizado, criado uma única vez para a aplicação.
const prisma = require("../prisma/client");

// LISTAR TODOS OS USUÁRIOS
// GET /Usuarios
router.get("/", async function (req, res) {
  try {
    const clientes = await prisma.clientes.findMany(); // SELECT * FROM clientes    
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).json({ error: "Falha ao listar clientes" });
  }
});

// BUSCAR UM CLIENTE POR CPF
// GET /Clientes/:cpf
router.get("/:cpf", async function (req, res) {
  try {
    const { cpf } = req.params;

    const cliente = await prisma.clientes.findUnique({
      where: { cpf }
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.status(200).json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return res.status(500).json({ error: "Falha ao buscar cliente" });
  }
});

// CRIAR UM NOVO CLIENTE
// POST /Clientes
router.post("/", async function (req, res) {
  try {
    const { cpf, nomeCliente, emailCliente, senhaCliente } = req.body;

    if (!cpf || !nomeCliente || !emailCliente || !senhaCliente) {
      return res.status(400).json({
        error: "CPF, nome, e-mail e senha são obrigatórios."
      });
    }

    const cliente = await prisma.clientes.create({
      data: {
        cpf,
        nomeCliente,
        emailCliente,
        senhaCliente
      }
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error("Erro ao criar cliente:", error?.message || error);

    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um cliente com esse CPF ou e-mail." });
    }

    return res.status(500).json({
      error: "Falha ao criar cliente",
      detail: error?.message || "Erro interno do banco de dados"
    });
  }
});

// ATUALIZAR UM CLIENTE
// PUT /Clientes/:cpf
router.put("/:cpf", async function (req, res) {
  try {
    const { cpf } = req.params;
    const { nomeCliente, emailCliente, senhaCliente } = req.body;

    const clienteAtualizado = await prisma.clientes.update({
      where: { cpf },
      data: {
        nomeCliente,
        emailCliente,
        senhaCliente
      }
    });

    res.status(200).json(clienteAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Cliente não encontrado para atualizar" });
    }

    return res.status(500).json({ error: "Falha ao atualizar cliente" });
  }
});

// EXCLUIR UM CLIENTE
// DELETE /Clientes/:cpf
router.delete("/:cpf", async function (req, res) {
  try {
    const { cpf } = req.params;

    await prisma.clientes.delete({
      where: { cpf }
    });

    res.status(200).json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Cliente não encontrado para deletar" });
    }

    return res.status(500).json({ error: "Falha ao deletar cliente" });
  }
});

module.exports = router;