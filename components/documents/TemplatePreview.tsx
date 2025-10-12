'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle2, RefreshCw } from 'lucide-react';

interface TemplatePreviewProps {
  template: any;
  onConfirm: () => void;
  onRegenerate: () => void;
}

/**
 * Composant pour prévisualiser le template avec des placeholders
 * Permet à l'utilisateur de voir la structure avant de remplir les infos
 */
export default function TemplatePreview({ template, onConfirm, onRegenerate }: TemplatePreviewProps) {
  /**
   * Génère le HTML avec des placeholders visuels
   */
  const generatePreviewHtml = () => {
    const placeholderData: Record<string, string> = {};

    // Créer des placeholders pour tous les champs requis
    template.requiredFields.forEach((field: any) => {
      placeholderData[field.key] = `[${field.label.toUpperCase()}]`;
    });

    // Ajouter la date d'envoi
    placeholderData['date_envoi'] = '[DATE]';

    // Générer le HTML
    const htmlBlocks: string[] = [];

    // Header
    htmlBlocks.push(`
      <!DOCTYPE html>
      <html lang="fr">
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
            margin: 0;
          }
          .placeholder {
            background: #fef3c7;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
            color: #92400e;
            border: 2px dashed #f59e0b;
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
          .signature-block {
            margin-top: 50px;
          }
        </style>
      </head>
      <body>
        <div class="document-header">
          <div class="document-title">${template.title}</div>
        </div>
    `);

    // Générer chaque bloc de contenu
    for (const block of template.contentBlocks) {
      let content = block.content;

      // Remplacer les variables par des placeholders visuels
      content = content.replace(/\{\{([^}]+)\}\}/g, (match: string, variableName: string) => {
        const key = variableName.trim();
        const value = placeholderData[key] || `[${key.toUpperCase()}]`;
        return `<span class="placeholder">${value}</span>`;
      });

      // Convertir les retours à la ligne
      content = content.replace(/\n/g, '<br>');

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
        case 'signature':
          className = 'signature-block';
          break;
      }

      if (block.style?.bold) {
        style += 'font-weight: bold;';
      }

      const styleAttr = style ? ` style="${style}"` : '';
      htmlBlocks.push(`<div class="${className}"${styleAttr}>${content}</div>`);
    }

    // Footer
    htmlBlocks.push(`
      </body>
      </html>
    `);

    return htmlBlocks.join('\n');
  };

  const previewHtml = generatePreviewHtml();
  const isDynamicallyGenerated = template.metadata?.dynamicallyGenerated || false;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Aperçu du template</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Vérifiez la structure du document avant de remplir vos informations
                </p>
              </div>
            </div>
            {isDynamicallyGenerated && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Généré par IA
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Liste des champs requis */}
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              📋 Informations à fournir ({template.requiredFields.length} champs)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {template.requiredFields.map((field: any) => (
                <div key={field.key} className="text-sm text-gray-700">
                  • {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Prévisualisation du document */}
          <div className="border-2 border-gray-200 rounded-lg bg-white shadow-inner">
            <div
              className="p-8 max-h-[600px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>

          {/* Légende */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
            💡 Les zones en <span className="bg-yellow-200 px-2 py-1 rounded font-bold text-yellow-900 border-2 border-dashed border-yellow-500">[SURLIGNÉ]</span> seront remplacées par vos informations réelles
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Confirmer et remplir les informations
            </Button>
            <Button
              onClick={onRegenerate}
              variant="outline"
              size="lg"
              className="border-2"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Régénérer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
