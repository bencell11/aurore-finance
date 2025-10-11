'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eraser, Check, Pen } from 'lucide-react';

interface DigitalSignatureProps {
  onSignatureComplete: (signatureDataUrl: string) => void;
  onSignatureClear?: () => void;
}

export default function DigitalSignature({
  onSignatureComplete,
  onSignatureClear
}: DigitalSignatureProps) {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = useState(false);

  const handleClear = () => {
    signatureRef.current?.clear();
    setIsSigned(false);
    onSignatureClear?.();
  };

  const handleSave = () => {
    if (signatureRef.current?.isEmpty()) {
      alert('Veuillez signer avant de valider');
      return;
    }

    const dataUrl = signatureRef.current?.toDataURL('image/png');
    if (dataUrl) {
      setIsSigned(true);
      onSignatureComplete(dataUrl);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="h-5 w-5" />
          Signature numérique
        </CardTitle>
        <CardDescription>
          Signez ci-dessous avec votre souris ou votre doigt (sur mobile)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: 'w-full h-40 md:h-48 cursor-crosshair',
              style: { touchAction: 'none' }
            }}
            backgroundColor="white"
            penColor="black"
            minWidth={1}
            maxWidth={2.5}
            onEnd={() => setIsSigned(false)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1"
          >
            <Eraser className="mr-2 h-4 w-4" />
            Effacer
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
            disabled={isSigned}
          >
            <Check className="mr-2 h-4 w-4" />
            {isSigned ? 'Signature validée' : 'Valider la signature'}
          </Button>
        </div>

        {isSigned && (
          <div className="text-sm text-green-600 flex items-center gap-2 bg-green-50 p-3 rounded">
            <Check className="h-4 w-4" />
            Votre signature a été enregistrée avec succès
          </div>
        )}
      </CardContent>
    </Card>
  );
}
