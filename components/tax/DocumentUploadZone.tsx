'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Eye,
  Download
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  extractedData?: any;
  documentType?: string;
}

interface DocumentUploadZoneProps {
  onUpload: (file: File) => void;
  onError: (error: string) => void;
}

export function DocumentUploadZone({ onUpload, onError }: DocumentUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      // Validation de la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        onError(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
        continue;
      }

      // Validation du type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];

      if (!allowedTypes.includes(file.type)) {
        onError(`Type de fichier non supporté: ${file.name}`);
        continue;
      }

      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Ajouter le fichier à la liste avec status "uploading"
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      setUploadedFiles(prev => [...prev, newFile]);

      try {
        await uploadFile(file, fileId);
      } catch (error) {
        console.error('Erreur upload:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error' as const }
            : f
        ));
        onError(`Erreur lors du téléchargement de ${file.name}`);
      }
    }
  }, [onError]);

  const uploadFile = async (file: File, fileId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileId', fileId);

    // Simulation de progression d'upload
    const updateProgress = (progress: number) => {
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, progress }
          : f
      ));
    };

    // Progression d'upload simulée
    updateProgress(30);
    
    try {
      const response = await fetch('/api/tax/upload', {
        method: 'POST',
        body: formData
      });

      updateProgress(70);

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const result = await response.json();
      
      updateProgress(90);

      // Changer le statut vers "processing" pour l'extraction
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'processing' as const, progress: 100 }
          : f
      ));

      // Lancer l'extraction des données
      await extractDocumentData(fileId, result.url);

    } catch (error) {
      throw error;
    }
  };

  const extractDocumentData = async (fileId: string, fileUrl: string) => {
    try {
      const response = await fetch('/api/tax/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, fileUrl })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'extraction');
      }

      const result = await response.json();

      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              status: 'completed' as const,
              extractedData: result.extractedData,
              documentType: result.documentType
            }
          : f
      ));

    } catch (error) {
      console.error('Erreur extraction:', error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error' as const }
          : f
      ));
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-6 w-6 text-red-600" />;
    if (type.includes('image')) return <Image className="h-6 w-6 text-blue-600" />;
    return <File className="h-6 w-6 text-gray-600" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Téléchargement...';
      case 'processing':
        return 'Analyse en cours...';
      case 'completed':
        return 'Traité';
      case 'error':
        return 'Erreur';
      default:
        return 'En attente';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeBadge = (type?: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      'salary_certificate': { label: 'Certificat de salaire', color: 'bg-blue-100 text-blue-800' },
      'bank_statement': { label: 'Relevé bancaire', color: 'bg-green-100 text-green-800' },
      'tax_statement': { label: 'Attestation fiscale', color: 'bg-purple-100 text-purple-800' },
      'insurance_premium': { label: 'Prime d\'assurance', color: 'bg-orange-100 text-orange-800' },
      'pension_certificate': { label: 'Attestation de rente', color: 'bg-yellow-100 text-yellow-800' },
      'other': { label: 'Autre document', color: 'bg-gray-100 text-gray-800' }
    };

    if (!type || !typeMap[type]) {
      return <Badge variant="secondary">Type à identifier</Badge>;
    }

    const { label, color } = typeMap[type];
    return <Badge className={color}>{label}</Badge>;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div className="space-y-6">
      {/* Zone de téléchargement */}
      <Card 
        {...getRootProps()} 
        className={`border-2 border-dashed cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">
            {isDragActive 
              ? 'Déposez vos fichiers ici...' 
              : 'Glissez-déposez vos documents fiscaux'
            }
          </h3>
          <p className="text-gray-600 mb-4">
            ou cliquez pour sélectionner des fichiers
          </p>
          <div className="text-sm text-gray-500">
            <p>Types acceptés: PDF, JPG, PNG, DOCX</p>
            <p>Taille maximum: 10MB par fichier</p>
          </div>
        </CardContent>
      </Card>

      {/* Liste des fichiers téléchargés */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Documents téléchargés</h3>
          
          {uploadedFiles.map((file) => (
            <Card key={file.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium truncate">{file.name}</h4>
                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                        
                        {file.documentType && (
                          <div className="mt-2">
                            {getDocumentTypeBadge(file.documentType)}
                          </div>
                        )}
                        
                        {file.extractedData && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <h5 className="text-sm font-medium text-green-900 mb-2">
                              Données extraites :
                            </h5>
                            <div className="text-sm text-green-800 space-y-1">
                              {Object.entries(file.extractedData).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="font-medium">{key}:</span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          <span className="text-sm text-gray-600">
                            {getStatusLabel(file.status)}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <div className="mt-3">
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Guide d'utilisation */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Extraction intelligente :</strong> Nos algorithmes d'IA analysent automatiquement 
          vos documents pour extraire les montants et informations fiscales pertinentes. 
          Vérifiez toujours les données extraites avant validation.
        </AlertDescription>
      </Alert>
    </div>
  );
}