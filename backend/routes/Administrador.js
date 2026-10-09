const express = require("express");
const router = express.Router();

// Usa o Prisma client centralizado, criado uma única vez para a aplicação.
const prisma = require("../prisma/client");

// LISTAR TODOS OS ADMINISTRADORES
// GET /Administradores
router.get("/", async function (req, res) {
  try {
    const administradores = await prisma.administrador.findMany(); // SELECT * FROM administradores    
    res.status(200).json(administradores);
  } catch (error) {
    console.error("Erro ao listar administradores:", error);
    res.status(500).json({ error: "Falha ao listar administradores" });
  }
});

// BUSCAR UM ADMINISTRADOR POR CPF
// GET /Administradores/:cpf
router.get("/:cpf", async function (req, res) {
  try {
    const { cpf } = req.params;

    const administrador = await prisma.administrador.findUnique({
      where: { cpf }
    });

    if (!administrador) {
      return res.status(404).json({ error: "Administrador não encontrado" });
    }

    return res.status(200).json(administrador);
  } catch (error) {
    console.error("Erro ao buscar administrador:", error);
    return res.status(500).json({ error: "Falha ao buscar administrador" });
  }
});

// CRIAR UM NOVO ADMINISTRADOR
// POST /Administrador
router.post("/", async function (req, res) {
  try {
    const { cpf, nomeAdministrador, emailAdministrador, senhaAdministrador, perfilAdministrador} = req.body;

    if (!cpf || !nomeAdministrador || !emailAdministrador || !senhaAdministrador) {
      return res.status(400).json({
        error: "CPF, nome, e-mail, senha e perfil são obrigatórios."
      });
    }

    const administrador = await prisma.administrador.create({
      data: {
        cpf,
        nomeAdministrador,
        emailAdministrador,
        senhaAdministrador,
        perfilAdministrador
      }
    });

    res.status(201).json(administrador);
  } catch (error) {
    console.error("Erro ao criar administrador:", error?.message || error);

    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um administrador com esse CPF ou e-mail." });
    }

    return res.status(500).json({
      error: "Falha ao criar administrador",
      detail: error?.message || "Erro interno do banco de dados"
    });
  }
});

// ATUALIZAR UM ADMINISTRADOR
// PUT /Administradores/:cpf
router.put("/:cpf", async function (req, res) {
  try {
    const { cpf } = req.params;
    const { nomeAdministrador, emailAdministrador, senhaAdministrador, perfilAdministrador} = req.body;

    const administradorAtualizado = await prisma.administrador.update({
      where: { cpf },
      data: {
        nomeAdministrador,
        emailAdministrador,
        senhaAdministrador,
        perfilAdministrador

      }
    });

    res.status(200).json(administradorAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar administrador:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Administrador não encontrado para atualizar" });
    }

    return res.status(500).json({ error: "Falha ao atualizar administrador" });
  }
});

// EXCLUIR UM ADMINISTRADOR
// DELETE /Administradores/:cpf
router.delete("/:cpf", async function (req, res) {
  try {
    const { cpf } = req.params;

    await prisma.administrador.delete({
      where: { cpf }
    });

    res.status(200).json({ message: "Administrador deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir administrador:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Administrador não encontrado para deletar" });
    }

    return res.status(500).json({ error: "Falha ao deletar administrador" });
  }
});

module.exports = router;