const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany();
    res.json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
});

// Create a new invoice
router.post('/', async (req, res) => {
  const {
    numeroCommande,
    dateCommande,
    montantTotal,
    status,
    idFournisseur,
    items,
    taxRate,
    subtotal,
    total,
    supplierTaxId,
    poNumber,
    contractRef,
  } = req.body;

  // Validate required fields
  if (
    !numeroCommande ||
    !dateCommande ||
    !montantTotal ||
    !status ||
    !idFournisseur
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create a new invoice using Prisma
    const newInvoice = await prisma.invoice.create({
      data: {
        numeroCommande,
        dateCommande: new Date(dateCommande),
        montantTotal,
        status,
        fournisseur: {
          connect: { id: idFournisseur },
        },
        items,
        taxRate,
        subtotal,
        total,
      },
    });

    res.status(201).json(newInvoice);
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ message: 'Error creating invoice' });
  }
});

module.exports = router;