'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Scale, FileText, Users, Heart, Shield, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { JuridiqueData } from '@/lib/types/maison-finances';

interface JuridiqueFormProps {
  data?: Partial<JuridiqueData>;
  onSave: (data: Partial<JuridiqueData>) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  isDarkMode?: boolean;
}

export default function JuridiqueForm({ data, onSave, onNext, onPrevious, isDarkMode = false }: JuridiqueFormProps) {
  const [formData, setFormData] = useState<Partial<JuridiqueData>>(data || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof JuridiqueData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      if (onNext) onNext();
    } catch (error) {
      console.error('Save error:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const domainesProtection = [
    'Vie privée',
    'Circulation routière',
    'Droit du travail',
    'Droit du logement'
  ];

  // Calcul du score de préparation juridique
  const calculatePreparationScore = (): number => {
    let score = 0;
    let total = 8;

    if (formData.protection_juridique_existe) score += 1;
    if (formData.testament_existe) score += 2;
    if (formData.pacte_successoral_existe) score += 1.5;
    if (formData.mandat_precautions_existe) score += 1.5;
    if (formData.directives_anticipees_existent) score += 1;
    if (formData.procuration_bancaire_existe) score += 0.5;
    if (formData.documents_importants_centralises) score += 0.5;
    if (formData.personnes_confiance_informees) score += 0.5;

    return (score / total) * 100;
  };

  const preparationScore = calculatePreparationScore();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <Card className={`border-l-4 border-l-slate-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Scale className="w-6 h-6 text-slate-600" />
            Juridique - Protection & Documents
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Assurez-vous d'avoir tous les documents importants en ordre
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Protection juridique */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Shield className="w-5 h-5 text-blue-600" />
            Protection Juridique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} rounded-lg`}>
            <Checkbox
              id="protection_juridique"
              checked={formData.protection_juridique_existe || false}
              onCheckedChange={(checked) => handleChange('protection_juridique_existe', checked)}
            />
            <Label htmlFor="protection_juridique" className="cursor-pointer font-medium">
              J'ai une assurance protection juridique
            </Label>
          </div>

          {formData.protection_juridique_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-300">
              <div className="space-y-2">
                <Label>Domaines couverts</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {domainesProtection.map((domaine) => (
                    <div key={domaine} className="flex items-center space-x-2">
                      <Checkbox
                        id={`domaine_juridique_${domaine}`}
                        checked={formData.protection_juridique_domaines?.includes(domaine) || false}
                        onCheckedChange={(checked) => {
                          const current = formData.protection_juridique_domaines || [];
                          if (checked) {
                            handleChange('protection_juridique_domaines', [...current, domaine]);
                          } else {
                            handleChange('protection_juridique_domaines', current.filter(d => d !== domaine));
                          }
                        }}
                      />
                      <Label htmlFor={`domaine_juridique_${domaine}`} className="text-sm cursor-pointer">
                        {domaine}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testament */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <FileText className="w-5 h-5 text-purple-600" />
            Testament & Succession
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Dispositions pour le transfert de votre patrimoine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Testament */}
          <div className="space-y-3">
            <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-lg`}>
              <Checkbox
                id="testament"
                checked={formData.testament_existe || false}
                onCheckedChange={(checked) => handleChange('testament_existe', checked)}
              />
              <Label htmlFor="testament" className="cursor-pointer font-medium">
                J'ai rédigé un testament
              </Label>
            </div>

            {formData.testament_existe && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-purple-300">
                <div className="space-y-2">
                  <Label htmlFor="testament_date">Date du testament</Label>
                  <Input
                    id="testament_date"
                    type="date"
                    value={formData.testament_date || ''}
                    onChange={(e) => handleChange('testament_date', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="testament_notaire"
                    checked={formData.testament_chez_notaire || false}
                    onCheckedChange={(checked) => handleChange('testament_chez_notaire', checked)}
                  />
                  <Label htmlFor="testament_notaire" className="cursor-pointer">
                    Déposé chez un notaire
                  </Label>
                </div>
              </div>
            )}

            {!formData.testament_existe && (
              <div className={`p-3 ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'} border border-orange-200 rounded-lg`}>
                <p className="text-sm text-orange-700">
                  ⚠️ Sans testament, la loi suisse détermine vos héritiers. Un testament vous permet de disposer librement de la quotité disponible.
                </p>
              </div>
            )}
          </div>

          {/* Pacte successoral */}
          <div className="space-y-3">
            <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'} rounded-lg`}>
              <Checkbox
                id="pacte"
                checked={formData.pacte_successoral_existe || false}
                onCheckedChange={(checked) => handleChange('pacte_successoral_existe', checked)}
              />
              <Label htmlFor="pacte" className="cursor-pointer font-medium">
                J'ai un pacte successoral
              </Label>
            </div>

            {formData.pacte_successoral_existe && (
              <div className="space-y-2 pl-4 border-l-2 border-indigo-300">
                <Label htmlFor="pacte_date">Date du pacte</Label>
                <Input
                  id="pacte_date"
                  type="date"
                  value={formData.pacte_successoral_date || ''}
                  onChange={(e) => handleChange('pacte_successoral_date', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Contrat de mariage */}
          {formData.contrat_mariage_existe && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contrat_mariage"
                  checked={formData.contrat_mariage_existe || false}
                  onCheckedChange={(checked) => handleChange('contrat_mariage_existe', checked)}
                />
                <Label htmlFor="contrat_mariage" className="cursor-pointer font-medium">
                  J'ai un contrat de mariage
                </Label>
              </div>

              {formData.contrat_mariage_existe && (
                <div className="space-y-2 pl-4 border-l-2 border-pink-300">
                  <Label htmlFor="regime">Régime matrimonial</Label>
                  <Select
                    value={formData.regime_matrimonial || 'participation_acquets'}
                    onValueChange={(value) => handleChange('regime_matrimonial', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participation_acquets">Participation aux acquêts (régime légal)</SelectItem>
                      <SelectItem value="communaute_biens">Communauté de biens</SelectItem>
                      <SelectItem value="separation_biens">Séparation de biens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispositions anticipées */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Heart className="w-5 h-5 text-red-600" />
            Dispositions en Cas d'Incapacité
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Documents pour protéger vos intérêts en cas d'incapacité de discernement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mandat de précautions */}
          <div className="space-y-3">
            <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} rounded-lg`}>
              <Checkbox
                id="mandat"
                checked={formData.mandat_precautions_existe || false}
                onCheckedChange={(checked) => handleChange('mandat_precautions_existe', checked)}
              />
              <Label htmlFor="mandat" className="cursor-pointer font-medium">
                J'ai un mandat pour cause d'inaptitude (mandat de précaution)
              </Label>
            </div>

            {formData.mandat_precautions_existe && (
              <div className="space-y-2 pl-4 border-l-2 border-red-300">
                <Label htmlFor="mandat_date">Date du mandat</Label>
                <Input
                  id="mandat_date"
                  type="date"
                  value={formData.mandat_precautions_date || ''}
                  onChange={(e) => handleChange('mandat_precautions_date', e.target.value)}
                />
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Le mandat de précaution vous permet de désigner qui gérera vos affaires si vous perdez votre capacité de discernement
                </p>
              </div>
            )}

            {!formData.mandat_precautions_existe && (
              <div className={`p-3 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} border border-red-200 rounded-lg`}>
                <p className="text-sm text-red-700">
                  ⚠️ Sans mandat de précaution, un curateur sera désigné par l'autorité de protection de l'adulte pour gérer vos affaires.
                </p>
              </div>
            )}
          </div>

          {/* Directives anticipées */}
          <div className="space-y-3">
            <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-pink-500/10' : 'bg-pink-50'} rounded-lg`}>
              <Checkbox
                id="directives"
                checked={formData.directives_anticipees_existent || false}
                onCheckedChange={(checked) => handleChange('directives_anticipees_existent', checked)}
              />
              <Label htmlFor="directives" className="cursor-pointer font-medium">
                J'ai des directives anticipées (dispositions de fin de vie)
              </Label>
            </div>

            {formData.directives_anticipees_existent && (
              <div className="space-y-2 pl-4 border-l-2 border-pink-300">
                <Label htmlFor="directives_date">Date des directives</Label>
                <Input
                  id="directives_date"
                  type="date"
                  value={formData.directives_anticipees_date || ''}
                  onChange={(e) => handleChange('directives_anticipees_date', e.target.value)}
                />
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Les directives anticipées indiquent vos souhaits concernant les traitements médicaux en fin de vie
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Procurations et accès */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Users className="w-5 h-5 text-green-600" />
            Procurations & Accès
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Procuration bancaire */}
          <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} rounded-lg`}>
            <Checkbox
              id="procuration"
              checked={formData.procuration_bancaire_existe || false}
              onCheckedChange={(checked) => handleChange('procuration_bancaire_existe', checked)}
            />
            <Label htmlFor="procuration" className="cursor-pointer font-medium">
              J'ai donné une procuration bancaire à une personne de confiance
            </Label>
          </div>

          <div className={`p-3 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} border border-blue-200 rounded-lg`}>
            <p className="text-sm text-blue-700">
              💡 Une procuration bancaire permet à une personne de confiance d'accéder à vos comptes en cas d'urgence ou d'incapacité.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Organisation documentaire */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <FileText className="w-5 h-5 text-orange-600" />
            Organisation Documentaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="documents_centralises"
                checked={formData.documents_importants_centralises || false}
                onCheckedChange={(checked) => handleChange('documents_importants_centralises', checked)}
              />
              <Label htmlFor="documents_centralises" className="cursor-pointer">
                Tous mes documents importants sont centralisés et accessibles
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="personnes_informees"
                checked={formData.personnes_confiance_informees || false}
                onCheckedChange={(checked) => handleChange('personnes_confiance_informees', checked)}
              />
              <Label htmlFor="personnes_informees" className="cursor-pointer">
                Mes proches savent où trouver mes documents importants
              </Label>
            </div>
          </div>

          <div className={`p-4 ${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'} border border-yellow-200 rounded-lg`}>
            <h4 className="font-medium mb-2">📋 Documents importants à conserver:</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Pièces d'identité (passeport, carte d'identité)</li>
              <li>Acte de naissance, livret de famille</li>
              <li>Contrats d'assurance (vie, maladie, RC, etc.)</li>
              <li>Certificats LPP et attestations 3e pilier</li>
              <li>Contrats hypothécaires et titres de propriété</li>
              <li>Testament, mandat de précaution, directives anticipées</li>
              <li>Mots de passe et accès numériques (dans un coffre sécurisé)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Score de préparation */}
      <Card className={`border-2 ${isDarkMode ? 'bg-gradient-to-br from-slate-900/20 to-gray-900/20 border-slate-700' : 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200'}`}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 Votre Niveau de Préparation Juridique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score de préparation:</span>
              <span className={`text-3xl font-bold ${
                preparationScore >= 75 ? 'text-green-600' :
                preparationScore >= 50 ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {preparationScore.toFixed(0)}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  preparationScore >= 75 ? 'bg-green-600' :
                  preparationScore >= 50 ? 'bg-orange-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${preparationScore}%` }}
              />
            </div>

            {preparationScore < 75 && (
              <div className={`p-4 ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'} border border-orange-200 rounded-lg`}>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  Actions recommandées:
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {!formData.testament_existe && (
                    <li>• Rédiger un testament pour disposer librement de votre patrimoine</li>
                  )}
                  {!formData.mandat_precautions_existe && (
                    <li>• Établir un mandat de précaution pour protéger vos intérêts</li>
                  )}
                  {!formData.directives_anticipees_existent && (
                    <li>• Rédiger des directives anticipées pour vos soins de fin de vie</li>
                  )}
                  {!formData.documents_importants_centralises && (
                    <li>• Centraliser tous vos documents importants dans un lieu sûr</li>
                  )}
                  {!formData.personnes_confiance_informees && (
                    <li>• Informer vos proches de l'emplacement de vos documents</li>
                  )}
                </ul>
              </div>
            )}

            {preparationScore >= 75 && (
              <div className={`p-4 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} border border-green-200 rounded-lg`}>
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Excellente préparation! Votre situation juridique est bien organisée.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg`}>
        <Button type="button" variant="outline" onClick={onPrevious} disabled={isLoading}>
          ← Précédent
        </Button>

        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <AlertCircle className="w-4 h-4 inline mr-2" />
          Tous les champs sont optionnels
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" disabled={isLoading}>
            Sauvegarder
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : 'Terminer ✓'}
          </Button>
        </div>
      </div>
    </form>
  );
}
