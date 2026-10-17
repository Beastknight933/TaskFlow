import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const reportMdPath = path.resolve('./Project_Report.md');
const reportPdfPath = path.resolve('./Project_Report.pdf');

// Simple Markdown to HTML converter with table, header, code, and list support
function markdownToHtml(md) {
  let html = md
    // Escape HTML special characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr />');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Block code
  html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

  // Process tables
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table>\n';
      }
      // Check if separator line
      if (line.includes('---')) {
        continue;
      }
      const cells = line.split('|').slice(1, -1);
      const isHeader = !tableHtml.includes('<tbody>') && !tableHtml.includes('<tr>');
      if (isHeader) {
        tableHtml += '<thead><tr>';
        cells.forEach((c) => {
          tableHtml += `<th>${c.trim()}</th>`;
        });
        tableHtml += '</tr></thead>\n<tbody>\n';
      } else {
        tableHtml += '<tr>';
        cells.forEach((c) => {
          tableHtml += `<td>${c.trim()}</td>`;
        });
        tableHtml += '</tr>\n';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table>\n';
        newLines.push(tableHtml);
      }
      newLines.push(lines[i]);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table>\n';
    newLines.push(tableHtml);
  }

  html = newLines.join('\n');

  // Lists
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/gim, '');

  // Ordered lists
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

  // Paragraphs
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<table') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<hr')
      ) {
        return block;
      }
      return `<p>${block}</p>`;
    })
    .join('\n');

  return html;
}

async function generatePdf() {
  console.log('Reading Project_Report.md...');
  const mdContent = fs.readFileSync(reportMdPath, 'utf-8');
  const bodyContent = markdownToHtml(mdContent);

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TaskFlow Project Report</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page);
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      font-size: 10.5pt;
    }
    h1 {
      font-size: 20pt;
      color: #0f172a;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 6px;
      margin-top: 0;
      margin-bottom: 12px;
    }
    h2 {
      font-size: 14pt;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11.5pt;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    p {
      margin-bottom: 10px;
    }
    ul, ol {
      margin-top: 4px;
      margin-bottom: 10px;
      padding-left: 24px;
    }
    li {
      margin-bottom: 4px;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 16px 0;
    }
    pre {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 8.5pt;
      overflow-x: auto;
      margin-bottom: 12px;
      line-height: 1.4;
    }
    code {
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 9pt;
      background-color: #f1f5f9;
      padding: 1px 4px;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 600;
      color: #0f172a;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    strong {
      color: #0f172a;
    }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;

  console.log('Launching headless browser to compile PDF...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

  console.log('Rendering Project_Report.pdf...');
  await page.pdf({
    path: reportPdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '14mm',
      right: '14mm',
    },
  });

  await browser.close();
  console.log(`PDF successfully generated at: ${reportPdfPath}`);
}

generatePdf().catch((err) => {
  console.error('PDF generation error:', err);
  process.exit(1);
});
