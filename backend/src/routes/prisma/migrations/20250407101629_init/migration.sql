-- CreateEnum
CREATE TYPE "StatusCommande" AS ENUM ('EnAttente', 'Validee', 'Annulee');

-- CreateEnum
CREATE TYPE "StatusFacture" AS ENUM ('EnAttente', 'Validee', 'Rejetee');

-- CreateEnum
CREATE TYPE "TypeFacture" AS ENUM ('Manuelle', 'Lot');

-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('ADMIN', 'AGENT', 'COMPTABLE');

-- CreateTable
CREATE TABLE "CommandeAchat" (
    "id" SERIAL NOT NULL,
    "numeroCommande" TEXT NOT NULL,
    "dateCommande" TIMESTAMP(3) NOT NULL,
    "montantTotal" DECIMAL(65,30) NOT NULL,
    "status" "StatusCommande" NOT NULL,
    "idFournisseur" INTEGER NOT NULL,

    CONSTRAINT "CommandeAchat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fournisseur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,

    CONSTRAINT "Fournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" SERIAL NOT NULL,
    "numeroFacture" TEXT NOT NULL,
    "dateFacture" TIMESTAMP(3) NOT NULL,
    "dateGL" TIMESTAMP(3),
    "montant" DECIMAL(65,30) NOT NULL,
    "status" "StatusFacture" NOT NULL,
    "typeFacture" "TypeFacture" NOT NULL,
    "messageErreur" TEXT,
    "idFournisseur" INTEGER NOT NULL,
    "idCommande" INTEGER,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nomUtilisateur" TEXT NOT NULL,
    "motDePasseHash" TEXT NOT NULL,
    "role" "RoleUtilisateur" NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommandeAchat_numeroCommande_key" ON "CommandeAchat"("numeroCommande");

-- CreateIndex
CREATE UNIQUE INDEX "Fournisseur_email_key" ON "Fournisseur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_numeroFacture_key" ON "Facture"("numeroFacture");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_nomUtilisateur_key" ON "Utilisateur"("nomUtilisateur");

-- AddForeignKey
ALTER TABLE "CommandeAchat" ADD CONSTRAINT "CommandeAchat_idFournisseur_fkey" FOREIGN KEY ("idFournisseur") REFERENCES "Fournisseur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_idFournisseur_fkey" FOREIGN KEY ("idFournisseur") REFERENCES "Fournisseur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_idCommande_fkey" FOREIGN KEY ("idCommande") REFERENCES "CommandeAchat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
