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
import { Calendar, TrendingUp, PiggyBank, AlertCircle, Upload, CheckCircle2, Info } from 'lucide-react';
import { VieillesseData } from '@/lib/types/maison-finances';

interface VieillesseFormProps {
  data?: Partial<VieillesseData>;
  onSave: (data: Partial<VieillesseData>) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  isDarkMode?: boolean;
}

export default function VieillesseForm({ data, onSave, onNext, onPrevious, isDarkMode = false }: VieillesseFormProps) {
  const [formData, setFormData] = useState<Partial<VieillesseData>>(data || { age_actuel: 35, age_retraite_souhaite: 65 });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingLPP, setUploadingLPP] = useState(false);

  const handleChange = (field: keyof VieillesseData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File) => {
    setUploadingLPP(true);

    try {
      // TODO: Implémenter l'upload vers Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUrl = `https://storage.example.com/lpp/${file.name}`;
      handleChange('lpp_certificat_url', mockUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert("Erreur lors de l'upload du fichier");
    } finally {
      setUploadingLPP(false);
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
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul de la rente LPP estimée
  const calculateRenteLPP = (): number => {
    if (!formData.lpp_avoir_actuel || !formData.lpp_taux_conversion) return 0;
    return (formData.lpp_avoir_actuel * formData.lpp_taux_conversion) / 100;
  };

  // Calcul des cotisations totales LPP
  const cotisationsTotalesLPP = (formData.lpp_cotisation_mensuelle_employee || 0) +
                                (formData.lpp_cotisation_mensuelle_employeur || 0);

  // Années jusqu'à la retraite
  const anneesAvantRetraite = (formData.age_retraite_souhaite || 65) - (formData.age_actuel || 35);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <Card className={`border-l-4 border-l-purple-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Calendar className="w-6 h-6 text-purple-600" />
            Vieillesse - Prévoyance Retraite
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Planifiez votre retraite avec les 3 piliers suisses (AVS, LPP, 3e pilier)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Informations générales */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📅 Planification Générale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age_actuel">
                Âge actuel <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age_actuel"
                type="number"
                min="18"
                max="100"
                placeholder="35"
                value={formData.age_actuel || ''}
                onChange={(e) => handleChange('age_actuel', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age_retraite">
                Âge de retraite souhaité <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age_retraite"
                type="number"
                min="58"
                max="70"
                placeholder="65"
                value={formData.age_retraite_souhaite || ''}
                onChange={(e) => handleChange('age_retraite_souhaite', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className={`flex flex-col justify-center p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Temps restant</div>
              <div className="text-2xl font-bold text-purple-600">
                {anneesAvantRetraite > 0 ? `${anneesAvantRetraite} ans` : 'À la retraite'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="besoin_revenu">Revenu mensuel souhaité à la retraite (CHF)</Label>
            <Input
              id="besoin_revenu"
              type="number"
              step="100"
              placeholder="5000"
              value={formData.besoin_revenu_retraite_mensuel || ''}
              onChange={(e) => handleChange('besoin_revenu_retraite_mensuel', parseFloat(e.target.value) || 0)}
            />
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Montant que vous aimeriez percevoir chaque mois à la retraite</p>
          </div>
        </CardContent>
      </Card>

      {/* 1er pilier - AVS */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1️⃣ Premier Pilier - AVS</CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Assurance-vieillesse et survivants (obligatoire)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annees_cotisation">
                Années de cotisation AVS <span className="text-red-500">*</span>
              </Label>
              <Input
                id="annees_cotisation"
                type="number"
                min="0"
                max="50"
                placeholder="15"
                value={formData.annees_cotisation_avs || ''}
                onChange={(e) => handleChange('annees_cotisation_avs', parseInt(e.target.value) || 0)}
                required
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nombre d'années où vous avez cotisé à l'AVS</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rente_avs">Rente AVS mensuelle estimée (CHF)</Label>
              <Input
                id="rente_avs"
                type="number"
                step="10"
                placeholder="1500"
                value={formData.montant_rente_avs_estimee || ''}
                onChange={(e) => handleChange('montant_rente_avs_estimee', parseFloat(e.target.value) || 0)}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Maximum: CHF 2'450/mois (2024). Demandez un extrait de compte AVS.</p>
            </div>
          </div>

          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
            <Checkbox
              id="lacunes_avs"
              checked={formData.lacunes_avs || false}
              onCheckedChange={(checked) => handleChange('lacunes_avs', checked)}
            />
            <Label htmlFor="lacunes_avs" className="cursor-pointer">
              J'ai des lacunes de cotisation AVS
              <span className={`block text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Années sans cotisation: études, séjour à l'étranger, etc.)
              </span>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* 2e pilier - LPP */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2️⃣ Deuxième Pilier - LPP/Caisse de Pension</CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Prévoyance professionnelle (obligatoire pour salariés)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
            <Checkbox
              id="lpp_existe"
              checked={formData.lpp_existe || false}
              onCheckedChange={(checked) => handleChange('lpp_existe', checked)}
            />
            <Label htmlFor="lpp_existe" className="cursor-pointer font-medium">
              Je cotise à une caisse de pension (LPP)
            </Label>
          </div>

          {formData.lpp_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lpp_nom">Nom de la caisse de pension</Label>
                  <Input
                    id="lpp_nom"
                    placeholder="Ex: Caisse de pension XYZ"
                    value={formData.lpp_nom_caisse || ''}
                    onChange={(e) => handleChange('lpp_nom_caisse', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lpp_plan">Plan de prévoyance</Label>
                  <Select
                    value={formData.lpp_plan_prevoyance || 'minimal'}
                    onValueChange={(value) => handleChange('lpp_plan_prevoyance', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal (LPP obligatoire)</SelectItem>
                      <SelectItem value="etendu">Étendu (LPP+ surobligatoire)</SelectItem>
                      <SelectItem value="cadre">Cadre (plan supérieur)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lpp_avoir">
                    Avoir de vieillesse actuel (CHF) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lpp_avoir"
                    type="number"
                    step="1000"
                    placeholder="120000"
                    value={formData.lpp_avoir_actuel || ''}
                    onChange={(e) => handleChange('lpp_avoir_actuel', parseFloat(e.target.value) || 0)}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Montant indiqué sur votre certificat LPP</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lpp_taux">Taux de conversion (%)</Label>
                  <Input
                    id="lpp_taux"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="6.8"
                    value={formData.lpp_taux_conversion || ''}
                    onChange={(e) => handleChange('lpp_taux_conversion', parseFloat(e.target.value) || 0)}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Taux légal: 6.8% (2024)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lpp_employee">Cotisation employé (CHF/mois)</Label>
                  <Input
                    id="lpp_employee"
                    type="number"
                    step="10"
                    placeholder="350"
                    value={formData.lpp_cotisation_mensuelle_employee || ''}
                    onChange={(e) => handleChange('lpp_cotisation_mensuelle_employee', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lpp_employeur">Cotisation employeur (CHF/mois)</Label>
                  <Input
                    id="lpp_employeur"
                    type="number"
                    step="10"
                    placeholder="400"
                    value={formData.lpp_cotisation_mensuelle_employeur || ''}
                    onChange={(e) => handleChange('lpp_cotisation_mensuelle_employeur', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Résumé LPP */}
              <div className={`p-4 rounded-lg space-y-2 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cotisations totales mensuelles:</span>
                  <span className="font-bold text-blue-600">{cotisationsTotalesLPP.toLocaleString('fr-CH')} CHF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rente mensuelle estimée à {formData.age_retraite_souhaite || 65} ans:</span>
                  <span className="font-bold text-indigo-600">{calculateRenteLPP().toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF</span>
                </div>
              </div>

              {/* Rachat LPP */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="lpp_rachat"
                    checked={formData.lpp_possibilite_rachat || false}
                    onCheckedChange={(checked) => handleChange('lpp_possibilite_rachat', checked)}
                  />
                  <Label htmlFor="lpp_rachat" className="cursor-pointer font-medium">
                    J'ai une possibilité de rachat LPP
                  </Label>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg -top-2 left-6">
                      Le rachat LPP vous permet de combler des lacunes et d'améliorer votre retraite tout en bénéficiant de déductions fiscales.
                    </div>
                  </div>
                </div>

                {formData.lpp_possibilite_rachat && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="lpp_montant_rachat">Montant de rachat possible (CHF)</Label>
                    <Input
                      id="lpp_montant_rachat"
                      type="number"
                      step="1000"
                      placeholder="50000"
                      value={formData.lpp_montant_rachat_possible || ''}
                      onChange={(e) => handleChange('lpp_montant_rachat_possible', parseFloat(e.target.value) || 0)}
                    />
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Montant indiqué sur votre certificat LPP</p>
                  </div>
                )}
              </div>

              {/* Upload certificat LPP */}
              <div className="space-y-2">
                <Label>Certificat LPP (optionnel mais recommandé)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    disabled={uploadingLPP}
                    className="flex-1"
                  />
                  {uploadingLPP && <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload en cours...</div>}
                  {formData.lpp_certificat_url && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3e pilier A */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <PiggyBank className="w-5 h-5" />
            3️⃣ Troisième Pilier A (3a) - Prévoyance liée
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Épargne fiscalement avantageuse (déduction fiscale)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
            <Checkbox
              id="pilier3a"
              checked={formData.pilier3a_existe || false}
              onCheckedChange={(checked) => handleChange('pilier3a_existe', checked)}
            />
            <Label htmlFor="pilier3a" className="cursor-pointer font-medium">
              Je cotise au 3e pilier A
            </Label>
          </div>

          {formData.pilier3a_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-green-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pilier3a_montant">Montant total (CHF)</Label>
                  <Input
                    id="pilier3a_montant"
                    type="number"
                    step="1000"
                    placeholder="75000"
                    value={formData.pilier3a_montant_total || ''}
                    onChange={(e) => handleChange('pilier3a_montant_total', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pilier3a_nombre">Nombre de comptes 3a</Label>
                  <Input
                    id="pilier3a_nombre"
                    type="number"
                    min="0"
                    max="5"
                    placeholder="2"
                    value={formData.pilier3a_nombre_comptes || ''}
                    onChange={(e) => handleChange('pilier3a_nombre_comptes', parseInt(e.target.value) || 0)}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recommandé: 2-3 comptes pour plus de flexibilité</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pilier3a_cotisation">Cotisation annuelle (CHF)</Label>
                  <Input
                    id="pilier3a_cotisation"
                    type="number"
                    step="100"
                    placeholder="7056"
                    value={formData.pilier3a_cotisation_annuelle || ''}
                    onChange={(e) => handleChange('pilier3a_cotisation_annuelle', parseFloat(e.target.value) || 0)}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Maximum 2024: CHF 7'056 (salariés)</p>
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="pilier3a_institution">Institution (Banque ou Assurance)</Label>
                  <Input
                    id="pilier3a_institution"
                    placeholder="Ex: UBS, PostFinance, Zurich Assurance..."
                    value={formData.pilier3a_institution || ''}
                    onChange={(e) => handleChange('pilier3a_institution', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3e pilier B */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>3️⃣ Troisième Pilier B (3b) - Prévoyance libre</CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Épargne sans contrainte de retrait</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
            <Checkbox
              id="pilier3b"
              checked={formData.pilier3b_existe || false}
              onCheckedChange={(checked) => handleChange('pilier3b_existe', checked)}
            />
            <Label htmlFor="pilier3b" className="cursor-pointer font-medium">
              J'ai une prévoyance libre (3b)
            </Label>
          </div>

          {formData.pilier3b_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-amber-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pilier3b_type">Type</Label>
                  <Select
                    value={formData.pilier3b_type || 'epargne_bancaire'}
                    onValueChange={(value) => handleChange('pilier3b_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assurance_vie">Assurance-vie</SelectItem>
                      <SelectItem value="epargne_bancaire">Épargne bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pilier3b_montant">Montant total (CHF)</Label>
                  <Input
                    id="pilier3b_montant"
                    type="number"
                    step="1000"
                    placeholder="30000"
                    value={formData.pilier3b_montant_total || ''}
                    onChange={(e) => handleChange('pilier3b_montant_total', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Autres placements retraite */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <TrendingUp className="w-5 h-5" />
            Autres Placements pour la Retraite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="autres_placements">Montant total d'autres placements (CHF)</Label>
            <Input
              id="autres_placements"
              type="number"
              step="1000"
              placeholder="50000"
              value={formData.autres_placements_retraite || ''}
              onChange={(e) => handleChange('autres_placements_retraite', parseFloat(e.target.value) || 0)}
            />
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions, obligations, fonds, immobilier locatif destinés à la retraite</p>
          </div>
        </CardContent>
      </Card>

      {/* Résumé prévoyance */}
      <Card className={`border-2 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'}`}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 Résumé de Votre Prévoyance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm">Rente AVS estimée (mensuelle)</span>
              <span className="font-bold text-blue-600">
                {(formData.montant_rente_avs_estimee || 0).toLocaleString('fr-CH')} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm">Rente LPP estimée (mensuelle)</span>
              <span className="font-bold text-indigo-600">
                {calculateRenteLPP().toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm">Capital 3e pilier total</span>
              <span className="font-bold text-green-600">
                {((formData.pilier3a_montant_total || 0) + (formData.pilier3b_montant_total || 0)).toLocaleString('fr-CH')} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-700' : 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-300'}`}>
              <span className="font-medium">Revenu mensuel total estimé à la retraite</span>
              <span className="text-2xl font-bold text-purple-600">
                {((formData.montant_rente_avs_estimee || 0) + calculateRenteLPP()).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </span>
            </div>

            {formData.besoin_revenu_retraite_mensuel && (
              <div className={`mt-4 p-4 rounded-lg border-2 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Objectif vs. Projection</div>
                <div className="flex items-center justify-between mb-2">
                  <span>Objectif:</span>
                  <span className="font-medium">{formData.besoin_revenu_retraite_mensuel.toLocaleString('fr-CH')} CHF</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>Projection:</span>
                  <span className="font-medium">
                    {((formData.montant_rente_avs_estimee || 0) + calculateRenteLPP()).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-medium">Écart:</span>
                  <span className={`font-bold ${
                    ((formData.montant_rente_avs_estimee || 0) + calculateRenteLPP()) >= formData.besoin_revenu_retraite_mensuel
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {(((formData.montant_rente_avs_estimee || 0) + calculateRenteLPP()) - formData.besoin_revenu_retraite_mensuel).toLocaleString('fr-CH', { minimumFractionDigits: 2, signDisplay: 'always' })} CHF
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <Button type="button" variant="outline" onClick={onPrevious} disabled={isLoading}>
          ← Précédent
        </Button>

        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <AlertCircle className="w-4 h-4 inline mr-2" />
          Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" disabled={isLoading}>
            Sauvegarder
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : 'Continuer →'}
          </Button>
        </div>
      </div>
    </form>
  );
}
