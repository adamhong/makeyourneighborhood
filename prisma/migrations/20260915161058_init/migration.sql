-- CreateTable
CREATE TABLE "Proposal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "existingImageUrl" TEXT,
    "inspirationImageUrl" TEXT,
    "needs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "supportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "authorName" TEXT NOT NULL,
    "email" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentInterest" (
    "id" SERIAL NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "amount" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Proposal_neighborhood_idx" ON "Proposal"("neighborhood");

-- CreateIndex
CREATE INDEX "Proposal_category_idx" ON "Proposal"("category");

-- CreateIndex
CREATE INDEX "Comment_proposalId_idx" ON "Comment"("proposalId");

-- CreateIndex
CREATE INDEX "InvestmentInterest_proposalId_idx" ON "InvestmentInterest"("proposalId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentInterest" ADD CONSTRAINT "InvestmentInterest_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
