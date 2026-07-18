-- 1. Remover a coluna antiga que referencia o Enum
ALTER TABLE "Transaction" DROP COLUMN "category";

-- 2. Excluir o Enum antigo que não é mais utilizado
DROP TYPE "public"."TransactionCategory";

-- 3. Adicionar a nova coluna categoryId
ALTER TABLE "Transaction" ADD COLUMN "categoryId" INTEGER NOT NULL;

-- 4. Criar a nova tabela Category
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- 5. Criar índice único para categorias customizadas
CREATE UNIQUE INDEX "Category_userId_name_key" ON "Category"("userId", "name");

-- 6. Adicionar chaves estrangeiras (Foreign Keys)
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
