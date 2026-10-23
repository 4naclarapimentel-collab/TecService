const express = require('express');
const router = express.Router();

// Cadastrar um boleto
async function criarBoletos(dados) {
  try {
    const boleto = await prisma.boletos.create({
      data: {
        valor: dados.valor,
        vencimento: new Date(dados.vencimento),
        status: dados.status,
        id_cliente: dados.id_cliente
      },
      include: {
        cliente: true
      }
    });

    return boletos;
  } catch (error) {
    console.error('Erro ao cadastrar boleto:', error);
    throw error;
  }
}

// Listar todos os boletos
async function listarBoletos() {
  try {
    return await prisma.boletos.findMany({
      include: {
        cliente: true
      },
      orderBy: {
        vencimento: 'asc'
      }
    });
  } catch (error) {
    console.error('Erro ao listar boletos:', error);
    throw error;
  }
}

// Buscar um boleto pelo ID
async function buscarBoletos(id_boletos) {
  return await prisma.boletos.findUnique({
    where: {
      id_boleto: Number(id_boletos)
    },
    include: {
      cliente: true
    }
  });
}

// Atualizar um boleto
async function atualizarBoletos(id_boletos, dados) {
  return await prisma.boletos.update({
    where: {
      id_boleto: Number(id_boleto)
    },
    data: {
      ...(dados.valor !== undefined && {
        valor: dados.valor
      }),
      ...(dados.vencimento !== undefined && {
        vencimento: new Date(dados.vencimento)
      }),
      ...(dados.status !== undefined && {
        status: dados.status
      }),
      ...(dados.id_cliente !== undefined && {
        id_cliente: dados.id_cliente
      })
    },
    include: {
      cliente: true
    }
  });
}

// Excluir um boleto
async function excluirBoletos(id_boleto) {
  return await prisma.boletos.delete({
    where: {
      id_boleto: Number(id_boletos)
    }
  });
}

module.exports = {
  criarBoletos,
  listarBoletos,
  buscarBoletos,
  atualizarBoletos,
  excluirBoletos
};

module.exports = router;