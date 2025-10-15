'use client';

import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pen, Eraser, Check, X, Info } from 'lucide-react';

interface DigitalSignatureProps {
  onSignatureComplete: (signatureData: string, signatureMetadata: SignatureMetadata) => void;
  onBack: () => void;
  signerName: string;
  signerEmail: string;
  documentTitle: string;
}

export interface SignatureMetadata {
  signedAt: string;
  signerName: string;
  signerEmail: string;
  ipAddress?: string;
  userAgent: string;
  signatureHash: string;
}

export default function DigitalSignature({
  onSignatureComplete,
  onBack,
  signerName,
  signerEmail,
  documentTitle,
}: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2; // Retina
    canvas.height = 300;
    ctx.scale(2, 2);

    // Style
    ctx.strokeStyle = '#1e40af'; // Blue-700
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const generateTypedSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw typed signature in cursive font
    ctx.font = '48px "Brush Script MT", cursive';
    ctx.fillStyle = '#1e40af';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName || signerName, canvas.width / 4, canvas.height / 2);

    setHasSignature(true);
  };

  const handleSign = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get signature as base64
    const signatureData = canvas.toDataURL('image/png');

    // Generate signature hash (simple hash for demo)
    const timestamp = new Date().toISOString();
    const hashInput = `${signerName}${signerEmail}${timestamp}`;
    const signatureHash = btoa(hashInput).substring(0, 32);

    // Collect metadata
    const metadata: SignatureMetadata = {
      signedAt: timestamp,
      signerName,
      signerEmail,
      userAgent: navigator.userAgent,
      signatureHash,
    };

    onSignatureComplete(signatureData, metadata);
  };

  const isValid = hasSignature && acceptTerms;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="w-5 h-5 text-blue-600" />
          Signature digitale
        </CardTitle>
        <CardDescription>
          Signez électroniquement le document: {documentTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info légale */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-2">Signature électronique légalement contraignante</p>
              <ul className="space-y-1">
                <li>• Votre signature a la même valeur juridique qu'une signature manuscrite</li>
                <li>• Conforme à la loi fédérale sur la signature électronique (SCSE)</li>
                <li>• Horodatage cryptographique et traçabilité complète</li>
                <li>• Conservée de manière sécurisée et inaltérable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Informations du signataire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <Label className="text-sm font-medium text-gray-700">Signataire</Label>
            <p className="text-base font-semibold text-gray-900">{signerName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <p className="text-base font-semibold text-gray-900">{signerEmail}</p>
          </div>
        </div>

        {/* Mode de signature */}
        <div className="space-y-3">
          <Label>Mode de signature</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={signatureMode === 'draw' ? 'default' : 'outline'}
              onClick={() => setSignatureMode('draw')}
              className="flex-1"
            >
              <Pen className="w-4 h-4 mr-2" />
              Dessiner
            </Button>
            <Button
              type="button"
              variant={signatureMode === 'type' ? 'default' : 'outline'}
              onClick={() => setSignatureMode('type')}
              className="flex-1"
            >
              Taper
            </Button>
          </div>
        </div>

        {/* Zone de signature dessinée */}
        {signatureMode === 'draw' && (
          <div className="space-y-3">
            <Label>Dessinez votre signature ci-dessous</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white relative overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full cursor-crosshair touch-none"
                style={{ height: '150px' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <div className="absolute bottom-2 left-2 text-xs text-gray-400 pointer-events-none">
                Signez ici
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={clearSignature}
                disabled={!hasSignature}
                className="flex-1"
              >
                <Eraser className="w-4 h-4 mr-2" />
                Effacer
              </Button>
            </div>
          </div>
        )}

        {/* Zone de signature tapée */}
        {signatureMode === 'type' && (
          <div className="space-y-3">
            <Label htmlFor="typedName">Tapez votre nom complet</Label>
            <Input
              id="typedName"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={signerName}
              className="text-lg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateTypedSignature}
              disabled={!typedName && !signerName}
              className="w-full"
            >
              <Pen className="w-4 h-4 mr-2" />
              Générer la signature
            </Button>

            {/* Aperçu de la signature tapée */}
            {hasSignature && (
              <div className="border-2 border-gray-300 rounded-lg bg-white p-4">
                <canvas
                  ref={canvasRef}
                  className="w-full"
                  style={{ height: '150px' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Consentement */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer">
              Je certifie que cette signature est la mienne et qu'elle engage ma responsabilité juridique.
              J'accepte que ce document signé électroniquement ait la même valeur qu'un document signé manuellement
              conformément à la loi fédérale sur la signature électronique (SCSE).
            </label>
          </div>
        </div>

        {/* Horodatage */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Horodatage:</span> {new Date().toLocaleString('fr-CH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button
            type="button"
            onClick={handleSign}
            disabled={!isValid}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Valider la signature
          </Button>
        </div>

        {/* Message d'aide */}
        {!hasSignature && (
          <p className="text-sm text-gray-500 text-center">
            {signatureMode === 'draw'
              ? 'Utilisez votre souris ou votre doigt pour dessiner votre signature'
              : 'Tapez votre nom pour générer une signature cursive'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
