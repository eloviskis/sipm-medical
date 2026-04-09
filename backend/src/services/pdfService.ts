import { Response } from 'express';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface InvoiceData {
    clientName: string;
    date: string;
    total: number;
    items: { description: string; amount: number }[];
}

export const generateInvoice = (invoiceData: InvoiceData): Promise<string> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const invoicePath = path.join(__dirname, `../../invoices/invoice-${Date.now()}.pdf`);

        doc.pipe(fs.createWriteStream(invoicePath));

        // Cabeçalho da fatura
        doc.fontSize(20).text(`Fatura para ${invoiceData.clientName}`, 50, 50);
        doc.fontSize(12).text(`Data: ${invoiceData.date}`, 50, 80);
        doc.text(`Total: R$${invoiceData.total.toFixed(2)}`, 50, 100);

        // Lista de itens
        doc.moveDown();
        invoiceData.items.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.description}: R$${item.amount.toFixed(2)}`);
        });

        doc.end();

        doc.on('finish', () => {
            resolve(invoicePath);
        });

        doc.on('error', (error) => {
            reject(error);
        });
    });
};
