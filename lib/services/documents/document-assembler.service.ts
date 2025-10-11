/**
 * Service d'assemblage de documents
 * Remplace les variables et génère le HTML final
 */

import { DocumentTemplate, ContentBlock } from '@/lib/types/document-templates';

export class DocumentAssemblerService {
  /**
   * Assemble le document final en remplaçant les variables
   */
  static assembleDocument(
    template: DocumentTemplate,
    data: Record<string, any>
  ): string {
    const htmlBlocks: string[] = [];

    // Header HTML
    htmlBlocks.push(this.generateHTMLHeader(template));

    // Générer chaque bloc de contenu
    for (const block of template.contentBlocks) {
      // Vérifier les conditions
      if (block.conditional) {
        if (!this.evaluateCondition(block.conditional, data)) {
          continue; // Skip ce bloc
        }
      }

      const blockHTML = this.generateBlockHTML(block, data);
      htmlBlocks.push(blockHTML);
    }

    // Footer HTML
    htmlBlocks.push(this.generateHTMLFooter(template));

    return htmlBlocks.join('\n');
  }

  /**
   * Génère le header HTML
   */
  private static generateHTMLHeader(template: DocumentTemplate): string {
    return `<!DOCTYPE html>
<html lang="${template.metadata.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
            background: #fff;
        }

        .document-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }

        .document-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }

        .document-meta {
            font-size: 12px;
            opacity: 0.9;
        }

        .address-block {
            margin: 20px 0;
            white-space: pre-line;
        }

        .address-left {
            text-align: left;
        }

        .address-right {
            text-align: right;
        }

        .paragraph {
            margin: 15px 0;
            text-align: justify;
        }

        .header-text {
            font-weight: bold;
            font-size: 18px;
            margin: 25px 0 15px 0;
        }

        .list {
            margin: 15px 0 15px 30px;
        }

        .signature-block {
            margin-top: 50px;
            white-space: pre-line;
        }

        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            font-size: 11px;
            color: #666;
        }

        .watermark {
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            font-size: 13px;
        }

        @media print {
            body {
                padding: 20px;
            }
            .document-header {
                break-inside: avoid;
            }
            .watermark {
                border: 1px solid #667eea;
            }
        }
    </style>
</head>
<body>
    <div class="document-header">
        <div class="document-title">${template.title}</div>
        <div class="document-meta">
            Généré le ${new Date().toLocaleDateString('fr-CH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} par Aurore Finance
        </div>
    </div>

    <div class="watermark">
        📄 Document généré automatiquement • Vérifiez les informations avant envoi • ${template.metadata.swissLawReference || ''}
    </div>
`;
  }

  /**
   * Génère le HTML pour un bloc de contenu
   */
  private static generateBlockHTML(block: ContentBlock, data: Record<string, any>): string {
    // Remplacer les variables
    let content = this.replaceVariables(block.content, data);

    // Appliquer le style
    let className = '';
    let style = '';

    switch (block.type) {
      case 'address':
        className = block.style?.align === 'right' ? 'address-block address-right' : 'address-block address-left';
        break;

      case 'header':
        className = 'header-text';
        break;

      case 'paragraph':
        className = 'paragraph';
        if (block.style?.align) {
          style = `text-align: ${block.style.align};`;
        }
        break;

      case 'list':
        return `<div class="list">${content}</div>`;

      case 'signature':
        className = 'signature-block';
        break;

      case 'footer':
        className = 'footer';
        break;
    }

    if (block.style?.bold) {
      style += 'font-weight: bold;';
    }

    if (block.style?.italic) {
      style += 'font-style: italic;';
    }

    if (block.style?.fontSize) {
      style += `font-size: ${block.style.fontSize};`;
    }

    const styleAttr = style ? ` style="${style}"` : '';

    // Convertir les retours à la ligne en <br>
    content = content.replace(/\n/g, '<br>');

    return `<div class="${className}"${styleAttr}>${content}</div>`;
  }

  /**
   * Génère le footer HTML
   */
  private static generateHTMLFooter(template: DocumentTemplate): string {
    return `
    <div class="footer">
        <p><strong>Aurore Finance</strong> - Assistant de gestion financière suisse</p>
        <p>Document généré le ${new Date().toLocaleString('fr-CH')}</p>
        <p>Template: ${template.id} v${template.metadata.version} • ${template.metadata.legalCompliance ? '✓ Conformité juridique validée' : 'ℹ️ Document informatif'}</p>
    </div>
</body>
</html>`;
  }

  /**
   * Remplace les variables {{variable}} par les valeurs
   */
  private static replaceVariables(text: string, data: Record<string, any>): string {
    return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
      const key = variableName.trim();
      const value = data[key];

      if (value === null || value === undefined) {
        return `[${key}]`; // Placeholder si donnée manquante
      }

      return String(value);
    });
  }

  /**
   * Évalue une condition
   */
  private static evaluateCondition(
    condition: {
      field: string;
      operator: string;
      value?: any;
    },
    data: Record<string, any>
  ): boolean {
    const fieldValue = data[condition.field];

    switch (condition.operator) {
      case 'exists':
        return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';

      case '===':
        return fieldValue === condition.value;

      case '!==':
        return fieldValue !== condition.value;

      case '>':
        return Number(fieldValue) > Number(condition.value);

      case '<':
        return Number(fieldValue) < Number(condition.value);

      case 'includes':
        if (typeof fieldValue === 'string') {
          return fieldValue.includes(String(condition.value));
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(condition.value);
        }
        return false;

      default:
        return true;
    }
  }

  /**
   * Génère un PDF depuis HTML (à implémenter avec Puppeteer ou similaire)
   */
  static async generatePDF(html: string): Promise<Buffer> {
    // TODO: Implémenter avec Puppeteer ou jsPDF côté serveur
    // Pour l'instant, on retourne un placeholder
    throw new Error('PDF generation not yet implemented - use print-to-PDF from browser');
  }
}
