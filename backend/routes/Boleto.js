const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Cadastrar um boleto
async function criarBoleto(dados) {
  try {
    const boleto = await prisma.boleto.create({
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

    return boleto;
  } catch (error) {
    console.error('Erro ao cadastrar boleto:', error);
    throw error;
  }
}

// Listar todos os boletos
async function listarBoletos() {
  try {
    return await prisma.boleto.findMany({
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
async function buscarBoleto(id_boleto) {
  return await prisma.boleto.findUnique({
    where: {
      id_boleto: Number(id_boleto)
    },
    include: {
      cliente: true
    }
  });
}

// Atualizar um boleto
async function atualizarBoleto(id_boleto, dados) {
  return await prisma.boleto.update({
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
async function excluirBoleto(id_boleto) {
  return await prisma.boleto.delete({
    where: {
      id_boleto: Number(id_boleto)
    }
  });
}

module.exports = {
  criarBoleto,
  listarBoletos,
  buscarBoleto,
  atualizarBoleto,
  excluirBoleto
};