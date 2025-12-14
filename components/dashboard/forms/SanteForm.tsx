'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Heart, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { SanteData } from '@/lib/types/maison-finances';

interface SanteFormProps {
  data?: Partial<SanteData>;
  onSave: (data: Partial<SanteData>) => Promise<void>;
  onNext?: () => void;
  isDarkMode?: boolean;
}

export default function SanteForm({ data, onSave, onNext, isDarkMode = false }: SanteFormProps) {
  const [formData, setFormData] = useState<Partial<SanteData>>(data || {});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingLAMAL, setUploadingLAMAL] = useState(false);
  const [uploadingLCA, setUploadingLCA] = useState(false);

  const handleChange = (field: keyof SanteData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File, type: 'lamal' | 'lca') => {
    if (type === 'lamal') {
      setUploadingLAMAL(true);
    } else {
      setUploadingLCA(true);
    }

    try {
      // TODO: Implémenter l'upload vers Supabase Storage
      // const { data, error } = await supabase.storage.from('documents').upload(...)

      // Simulation pour le moment
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUrl = `https://storage.example.com/${type}/${file.name}`;

      if (type === 'lamal') {
        handleChange('assurance_lamal_document_url', mockUrl);
      } else {
        handleChange('assurance_lca_document_url', mockUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert("Erreur lors de l'upload du fichier");
    } finally {
      setUploadingLAMAL(false);
      setUploadingLCA(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      if (onNext) onNext();
    } catch (error) {
      console.error('Save error:', error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  const franchisesLAMAL = [
    { value: 300, label: '300 CHF (Franchise minimum)' },
    { value: 500, label: '500 CHF' },
    { value: 1000, label: "1'000 CHF" },
    { value: 1500, label: "1'500 CHF" },
    { value: 2000, label: "2'000 CHF" },
    { value: 2500, label: "2'500 CHF (Franchise maximum)" }
  ];

  const prestationsLCA = [
    'Médecine alternative (naturopathie, homéopathie, etc.)',
    'Soins dentaires',
    'Lunettes et lentilles',
    'Chambre privée hôpital',
    'Médecine douce',
    'Fitness et prévention',
    'Transport et sauvetage',
    "Séjour à l'étranger"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <Card className={`border-l-4 border-l-red-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Heart className="w-6 h-6 text-red-600" />
            Santé - Assurances Maladie
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Complétez vos informations concernant votre assurance maladie de base (LAMal) et vos assurances complémentaires (LCA)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* LAMAL - Assurance de base obligatoire */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🏥 Assurance de Base (LAMal)</CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Assurance maladie obligatoire en Suisse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom de l'assurance */}
            <div className="space-y-2">
              <Label htmlFor="assurance_lamal_nom">
                Nom de l'assurance <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assurance_lamal_nom"
                placeholder="Ex: CSS, Helsana, Assura..."
                value={formData.assurance_lamal_nom || ''}
                onChange={(e) => handleChange('assurance_lamal_nom', e.target.value)}
                required
              />
            </div>

            {/* Prime mensuelle */}
            <div className="space-y-2">
              <Label htmlFor="assurance_lamal_prime">
                Prime mensuelle (CHF) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assurance_lamal_prime"
                type="number"
                step="0.01"
                placeholder="350.00"
                value={formData.assurance_lamal_prime_mensuelle || ''}
                onChange={(e) => handleChange('assurance_lamal_prime_mensuelle', parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Franchise */}
            <div className="space-y-2">
              <Label htmlFor="assurance_lamal_franchise">
                Franchise annuelle <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.assurance_lamal_franchise?.toString() || '300'}
                onValueChange={(value) => handleChange('assurance_lamal_franchise', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {franchisesLAMAL.map((f) => (
                    <SelectItem key={f.value} value={f.value.toString()}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modèle d'assurance */}
            <div className="space-y-2">
              <Label htmlFor="assurance_lamal_modele">
                Modèle d'assurance <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.assurance_lamal_modele || 'standard'}
                onValueChange={(value) => handleChange('assurance_lamal_modele', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (libre choix du médecin)</SelectItem>
                  <SelectItem value="medecin_famille">Médecin de famille</SelectItem>
                  <SelectItem value="telmed">Telmed (conseil téléphonique)</SelectItem>
                  <SelectItem value="hmo">HMO (centre médical)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Couverture accidents */}
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
            <Checkbox
              id="couverture_accidents"
              checked={formData.assurance_lamal_couverture_accidents || false}
              onCheckedChange={(checked) => handleChange('assurance_lamal_couverture_accidents', checked)}
            />
            <Label htmlFor="couverture_accidents" className="cursor-pointer">
              Couverture accidents incluse
              <span className={`block text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Si vous travaillez moins de 8h/semaine ou êtes sans emploi)
              </span>
            </Label>
          </div>

          {/* Upload police LAMal */}
          <div className="space-y-2">
            <Label>Police d'assurance LAMal (optionnel)</Label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'lamal');
                }}
                disabled={uploadingLAMAL}
                className="flex-1"
              />
              {uploadingLAMAL && <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload en cours...</div>}
              {formData.assurance_lamal_document_url && (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LCA - Assurances complémentaires */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>➕ Assurances Complémentaires (LCA)</CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Assurances facultatives pour prestations supplémentaires</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Possède une LCA */}
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
            <Checkbox
              id="assurance_lca_existe"
              checked={formData.assurance_lca_existe || false}
              onCheckedChange={(checked) => handleChange('assurance_lca_existe', checked)}
            />
            <Label htmlFor="assurance_lca_existe" className="cursor-pointer font-medium">
              J'ai une ou plusieurs assurances complémentaires
            </Label>
          </div>

          {/* Détails LCA si existe */}
          {formData.assurance_lca_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-purple-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nom assurance LCA */}
                <div className="space-y-2">
                  <Label htmlFor="assurance_lca_nom">Nom de l'assurance</Label>
                  <Input
                    id="assurance_lca_nom"
                    placeholder="Ex: CSS MyFlex"
                    value={formData.assurance_lca_nom || ''}
                    onChange={(e) => handleChange('assurance_lca_nom', e.target.value)}
                  />
                </div>

                {/* Prime LCA */}
                <div className="space-y-2">
                  <Label htmlFor="assurance_lca_prime">Prime mensuelle (CHF)</Label>
                  <Input
                    id="assurance_lca_prime"
                    type="number"
                    step="0.01"
                    placeholder="50.00"
                    value={formData.assurance_lca_prime_mensuelle || ''}
                    onChange={(e) => handleChange('assurance_lca_prime_mensuelle', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {/* Prestations couvertes */}
              <div className="space-y-2">
                <Label>Prestations couvertes</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prestationsLCA.map((prestation) => (
                    <div key={prestation} className="flex items-center space-x-2">
                      <Checkbox
                        id={`prestation_${prestation}`}
                        checked={formData.assurance_lca_prestations?.includes(prestation) || false}
                        onCheckedChange={(checked) => {
                          const current = formData.assurance_lca_prestations || [];
                          if (checked) {
                            handleChange('assurance_lca_prestations', [...current, prestation]);
                          } else {
                            handleChange('assurance_lca_prestations', current.filter(p => p !== prestation));
                          }
                        }}
                      />
                      <Label htmlFor={`prestation_${prestation}`} className="text-sm cursor-pointer">
                        {prestation}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload police LCA */}
              <div className="space-y-2">
                <Label>Police d'assurance LCA (optionnel)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'lca');
                    }}
                    disabled={uploadingLCA}
                    className="flex-1"
                  />
                  {uploadingLCA && <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload en cours...</div>}
                  {formData.assurance_lca_document_url && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* État de santé général */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🩺 État de Santé Général</CardTitle>
          <CardDescription>Informations pour une meilleure évaluation de vos besoins</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Problèmes de santé chroniques */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="problemes_sante"
                checked={formData.problemes_sante_chroniques || false}
                onCheckedChange={(checked) => handleChange('problemes_sante_chroniques', checked)}
              />
              <Label htmlFor="problemes_sante" className="cursor-pointer">
                J'ai des problèmes de santé chroniques ou des maladies de longue durée
              </Label>
            </div>

            {formData.problemes_sante_chroniques && (
              <Textarea
                placeholder="Décrivez brièvement vos problèmes de santé (ces informations resteront confidentielles)"
                value={formData.problemes_sante_details || ''}
                onChange={(e) => handleChange('problemes_sante_details', e.target.value)}
                rows={3}
              />
            )}
          </div>

          {/* Traitements médicaux réguliers */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="traitements_reguliers"
              checked={formData.traitement_medicaux_reguliers || false}
              onCheckedChange={(checked) => handleChange('traitement_medicaux_reguliers', checked)}
            />
            <Label htmlFor="traitements_reguliers" className="cursor-pointer">
              Je suis sous traitement médical régulier (médicaments quotidiens)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <AlertCircle className="w-4 h-4 inline mr-2" />
          Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" disabled={isLoading}>
            Sauvegarder le brouillon
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : 'Enregistrer et continuer'}
          </Button>
        </div>
      </div>
    </form>
  );
}
