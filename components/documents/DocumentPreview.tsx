'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Check, X, FileText } from 'lucide-react';

interface DocumentPreviewProps {
  htmlContent: string;
  templateTitle: string;
  onConfirm: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export default function DocumentPreview({
  htmlContent,
  templateTitle,
  onConfirm,
  onEdit,
  onCancel
}: DocumentPreviewProps) {
  const [showRawHtml, setShowRawHtml] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              <CardTitle>Prévisualisation du document</CardTitle>
            </div>
            <Badge variant="outline" className="bg-white">
              {templateTitle}
            </Badge>
          </div>
          <CardDescription>
            Vérifiez le contenu avant de télécharger le document final
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Toggle View */}
          <div className="mb-4 flex gap-2">
            <Button
              variant={!showRawHtml ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowRawHtml(false)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Aperçu visuel
            </Button>
            <Button
              variant={showRawHtml ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowRawHtml(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Code HTML
            </Button>
          </div>

          {/* Preview Content */}
          <div className="border-2 border-gray-200 rounded-lg bg-white shadow-inner">
            {!showRawHtml ? (
              <div
                className="p-8 max-h-[600px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{
                  fontFamily: 'Arial, sans-serif',
                  lineHeight: '1.6',
                  color: '#333'
                }}
              />
            ) : (
              <pre className="p-4 text-xs max-h-[600px] overflow-auto bg-gray-50">
                <code>{htmlContent}</code>
              </pre>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button
              variant="outline"
              onClick={onEdit}
              className="flex-1"
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier les données
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <Check className="mr-2 h-4 w-4" />
              Confirmer et télécharger
            </Button>
          </div>

          {/* Info Message */}
          <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
            <p className="font-medium mb-1">💡 Astuce :</p>
            <p>
              Après téléchargement, vous pourrez ouvrir le document HTML dans votre navigateur
              et l'imprimer en PDF (Ctrl+P / Cmd+P) pour une version finale professionnelle.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
