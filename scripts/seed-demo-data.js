import { prisma } from "../src/lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🚀 Iniciando população de dados de demonstração...");

  // 1. Cadastrar as categorias padrão do sistema (userId: null) com cores
  const defaultCategories = [
    { name: 'SALARIO', color: '#27ae60' },
    { name: 'COMIDA', color: '#ff9f1c' },
    { name: 'TRANSPORTE', color: '#3498db' },
    { name: 'LAZER', color: '#9b59b6' },
    { name: 'SAUDE', color: '#2ecc71' },
    { name: 'EDUCACAO', color: '#00a8cc' },
    { name: 'MORADIA', color: '#795548' },
    { name: 'ASSINATURA', color: '#e91e63' },
    { name: 'COMBUSTIVEL', color: '#f1c40f' },
    { name: 'INVESTIMENTO', color: '#16a085' },
    { name: 'OUTROS', color: '#95a5a6' }
  ];

  console.log("📂 Cadastrando categorias padrões do sistema com cores...");
  for (const cat of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        userId: null,
        name: cat.name,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          color: cat.color,
          userId: null,
        },
      });
    } else if (existing.color !== cat.color) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { color: cat.color }
      });
    }
  }

  // Mapear categorias salvas para obter seus IDs dinamicamente
  const categoriesInDb = await prisma.category.findMany({
    where: { userId: null },
  });
  const categoryMap = {};
  for (const cat of categoriesInDb) {
    categoryMap[cat.name] = cat.id;
  }
  console.log("✔️ Categorias de sistema mapeadas.");

  // 2. Criar ou buscar o usuário demo
  const email = "demo@example.com";
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log(`👤 Criando usuário demo: ${email}...`);
    const passwordHash = await bcrypt.hash("demo123", 10);
    user = await prisma.user.create({
      data: {
        name: "Usuário Demo",
        email,
        passwordHash,
      },
    });
  } else {
    console.log(`👤 Usuário demo encontrado (ID: ${user.id}).`);
  }

  // Limpar transações e metas antigas apenas do usuário demo
  console.log("🧹 Limpando transações e metas antigas do usuário demo...");
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.financialGoal.deleteMany({ where: { userId: user.id } });

  const now = new Date();

  // 3. Cadastrar Metas Financeiras (5 meses diferentes para satisfazer o mínimo de 4 meses)
  const targetMonthsForGoals = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    targetMonthsForGoals.push({
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      label: d.toLocaleString("pt-BR", { month: "long", year: "numeric" }),
    });
  }

  console.log("\n🎯 Gerando metas financeiras...");
  for (let index = 0; index < targetMonthsForGoals.length; index++) {
    const item = targetMonthsForGoals[index];
    let goalName = "Reserva de Emergência";
    let targetAmount = 2000.0;

    if (index === 0) {
      goalName = "Reserva de Emergência";
      targetAmount = 2500.0;
    } else if (index === 1) {
      goalName = "Planejamento Viagem";
      targetAmount = 1500.0;
    } else if (index === 2) {
      goalName = "Investimentos Globais";
      targetAmount = 3000.0;
    } else if (index === 3) {
      goalName = "Curso e Certificações";
      targetAmount = 800.0;
    } else {
      goalName = "Previdência Privada";
      targetAmount = 1200.0;
    }

    await prisma.financialGoal.create({
      data: {
        name: goalName,
        targetAmount,
        month: item.month,
        year: item.year,
        userId: user.id,
      },
    });
    console.log(`  - Meta criada para ${item.label}: "${goalName}" (Alvo: R$ ${targetAmount})`);
  }

  // 4. Cadastrar Transações (12 meses / 1 ano de transações)
  const targetMonthsForTransactions = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    targetMonthsForTransactions.push({
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      label: d.toLocaleString("pt-BR", { month: "long", year: "numeric" }),
    });
  }

  console.log("\n💸 Gerando 1 ano de transações...");
  for (const item of targetMonthsForTransactions) {
    const { month, year, label } = item;

    // Transações padrão mensais
    const transactionsData = [
      // Receitas (INCOME)
      { amount: 6000.00, type: "INCOME", category: "SALARIO", description: "Salário Mensal", day: 5 },
      { amount: 350.00, type: "INCOME", category: "OUTROS", description: "Reembolso / Freelance", day: 15 },
      { amount: 150.00, type: "INCOME", category: "INVESTIMENTO", description: "Rendimentos FIIs", day: 20 },

      // Despesas (EXPENSE)
      { amount: 1600.00, type: "EXPENSE", category: "MORADIA", description: "Aluguel", day: 10 },
      { amount: 180.00, type: "EXPENSE", category: "MORADIA", description: "Conta de Luz", day: 12 },
      { amount: 80.00, type: "EXPENSE", category: "MORADIA", description: "Conta de Água", day: 14 },
      
      { amount: 420.00, type: "EXPENSE", category: "COMIDA", description: "Compras Supermercado", day: 3 },
      { amount: 130.00, type: "EXPENSE", category: "COMIDA", description: "Restaurantes / Delivery", day: 18 },

      { amount: 40.00, type: "EXPENSE", category: "TRANSPORTE", description: "Uber / Ônibus", day: 8 },

      { amount: 190.00, type: "EXPENSE", category: "COMBUSTIVEL", description: "Abastecimento semanal", day: 11 },
      
      { amount: 110.00, type: "EXPENSE", category: "LAZER", description: "Lazer Fim de Semana", day: 6 },
      { amount: 180.00, type: "EXPENSE", category: "LAZER", description: "Jantar Especial", day: 22 },

      { amount: 75.00, type: "EXPENSE", category: "SAUDE", description: "Farmácia", day: 16 },
      
      { amount: 120.00, type: "EXPENSE", category: "EDUCACAO", description: "Livros / Mensalidade Curso", day: 9 },

      { amount: 55.90, type: "EXPENSE", category: "ASSINATURA", description: "Streaming", day: 1 },
      { amount: 22.90, type: "EXPENSE", category: "ASSINATURA", description: "Música online", day: 2 },

      { amount: 600.00, type: "EXPENSE", category: "INVESTIMENTO", description: "Aporte Renda Fixa", day: 28 }
    ];

    let count = 0;
    for (const tx of transactionsData) {
      const txDate = new Date(Date.UTC(year, month - 1, tx.day, 12, 0, 0));
      const categoryId = categoryMap[tx.category] || categoryMap['OUTROS'];
      
      await prisma.transaction.create({
        data: {
          amount: tx.amount,
          type: tx.type,
          categoryId: categoryId,
          description: tx.description,
          date: txDate,
          userId: user.id
        }
      });
      count++;
    }
    console.log(`  - ${count} transações geradas para ${label}`);
  }

  console.log("\n✨ Banco de dados populado com sucesso!");
  console.log("ℹ️ Você pode entrar na aplicação usando:");
  console.log(`   📧 E-mail: ${email}`);
  console.log("   🔑 Senha: demo123");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar script de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
