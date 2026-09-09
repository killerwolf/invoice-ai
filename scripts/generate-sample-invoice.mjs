import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../public/sample-invoice.png');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 40px;
      background: #f8fafc;
      color: #1e293b;
      display: flex;
      justify-content: center;
    }
    .invoice-box {
      width: 700px;
      background: #ffffff;
      padding: 40px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-logo {
      font-size: 28px;
      font-weight: 800;
      color: #4f46e5;
      letter-spacing: -0.5px;
    }
    .company-sub {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h1 {
      font-size: 24px;
      color: #0f172a;
      margin: 0;
    }
    .meta-table {
      font-size: 13px;
      margin-top: 8px;
      color: #64748b;
    }
    .details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .details-col {
      font-size: 14px;
      line-height: 1.5;
    }
    .details-col strong {
      display: block;
      color: #4338ca;
      margin-bottom: 6px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #f1f5f9;
      color: #475569;
      font-weight: 600;
      font-size: 13px;
      text-align: left;
      padding: 12px;
      border-radius: 4px;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      display: flex;
      justify-content: flex-end;
    }
    .totals-table {
      width: 260px;
    }
    .totals-table tr td {
      padding: 6px 12px;
      border: none;
    }
    .totals-table tr.grand-total td {
      border-top: 2px solid #e2e8f0;
      font-size: 16px;
      font-weight: 700;
      color: #4338ca;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px dashed #cbd5e1;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="header">
      <div>
        <div class="company-logo">Acme Cloud Solutions</div>
        <div class="company-sub">15 Rue de Rivoli, 75001 Paris | SIRET: 849 201 928 00012</div>
      </div>
      <div class="invoice-title">
        <h1>FACTURE</h1>
        <div class="meta-table">
          <div>N° Facture : <strong>INV-2024-0891</strong></div>
          <div>Date : <strong>12 Oct 2024</strong></div>
          <div>Échéance : <strong>12 Nov 2024</strong></div>
        </div>
      </div>
    </div>

    <div class="details">
      <div class="details-col">
        <strong>Facturé à :</strong>
        NexGen Media Inc.<br/>
        42 Boulevard Haussmann<br/>
        75009 Paris, France<br/>
        contact@nexgenmedia.io
      </div>
      <div class="details-col" style="text-align: right;">
        <strong>Mode de paiement :</strong>
        Virement bancaire (SEPA)<br/>
        IBAN : FR76 3000 4000 0123 4567 8901 234<br/>
        BIC : BPARFRPPXXX
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-right">Qté</th>
          <th class="text-right">Prix Unitaire</th>
          <th class="text-right">Total HT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>SaaS Enterprise Subscription (Octobre 2024)</td>
          <td class="text-right">1</td>
          <td class="text-right">249,00 €</td>
          <td class="text-right">249,00 €</td>
        </tr>
        <tr>
          <td>Document AI API Usage (Pack 5,000 crédits)</td>
          <td class="text-right">5</td>
          <td class="text-right">35,00 €</td>
          <td class="text-right">175,00 €</td>
        </tr>
        <tr>
          <td>Dedicated Cloud Support SLA 24/7</td>
          <td class="text-right">1</td>
          <td class="text-right">99,00 €</td>
          <td class="text-right">99,00 €</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <table class="totals-table">
        <tr>
          <td>Sous-total HT :</td>
          <td class="text-right">523,00 €</td>
        </tr>
        <tr>
          <td>TVA (20%) :</td>
          <td class="text-right">104,60 €</td>
        </tr>
        <tr class="grand-total">
          <td>Total TTC :</td>
          <td class="text-right">627,60 €</td>
        </tr>
      </table>
    </div>

    <div class="footer">
      Merci pour votre confiance ! En cas de retard de paiement, des pénalités légales seront appliquées.
    </div>
  </div>
</body>
</html>
`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 1050, deviceScaleFactor: 2 });
  await page.setContent(invoiceHtml, { waitUntil: 'networkidle0' });

  const invoiceElement = await page.$('.invoice-box');
  await invoiceElement.screenshot({ path: outputPath });

  console.log('Sample invoice created at:', outputPath);
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
