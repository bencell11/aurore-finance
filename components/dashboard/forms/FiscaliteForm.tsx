'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, TrendingDown, Calculator, AlertCircle, Lightbulb, Info } from 'lucide-react';
import { FiscaliteData } from '@/lib/types/maison-finances';

interface FiscaliteFormProps {
  data?: Partial<FiscaliteData>;
  onSave: (data: Partial<FiscaliteData>) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  isDarkMode?: boolean;
}

export default function FiscaliteForm({ data, onSave, onNext, onPrevious, isDarkMode = false }: FiscaliteFormProps) {
  const [formData, setFormData] = useState<Partial<FiscaliteData>>(data || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FiscaliteData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calcul automatique des déductions
  useEffect(() => {
    // Déductions LPP + 3a (importées depuis les formulaires précédents)
    const deductionsLPP3a = (formData.deductions_lpp_pilier3a || 0);

    // Déductions intérêts hypothécaires (importées depuis Immobilier)
    const deductionsHypo = (formData.deductions_interets_hypothecaires || 0);

    // Total des déductions
    const totalDeductions =
      deductionsLPP3a +
      deductionsHypo +
      (formData.deductions_frais_garde_enfants || 0) +
      (formData.deductions_frais_formation || 0) +
      (formData.deductions_dons || 0) +
      (formData.deductions_pension_alimentaire || 0);

    // Revenu imposable = Revenu brut - Déductions
    const revenuImposable = Math.max(0, (formData.revenu_imposable_estime || 0) - totalDeductions);

    setFormData(prev => ({
      ...prev,
      revenu_imposable_estime: revenuImposable
    }));
  }, [
    formData.deductions_lpp_pilier3a,
    formData.deductions_interets_hypothecaires,
    formData.deductions_frais_garde_enfants,
    formData.deductions_frais_formation,
    formData.deductions_dons,
    formData.deductions_pension_alimentaire
  ]);

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

  // Liste des cantons suisses
  const cantonsSuisses = [
    { value: 'AG', label: 'Argovie (AG)' },
    { value: 'AI', label: 'Appenzell Rhodes-Intérieures (AI)' },
    { value: 'AR', label: 'Appenzell Rhodes-Extérieures (AR)' },
    { value: 'BE', label: 'Berne (BE)' },
    { value: 'BL', label: 'Bâle-Campagne (BL)' },
    { value: 'BS', label: 'Bâle-Ville (BS)' },
    { value: 'FR', label: 'Fribourg (FR)' },
    { value: 'GE', label: 'Genève (GE)' },
    { value: 'GL', label: 'Glaris (GL)' },
    { value: 'GR', label: 'Grisons (GR)' },
    { value: 'JU', label: 'Jura (JU)' },
    { value: 'LU', label: 'Lucerne (LU)' },
    { value: 'NE', label: 'Neuchâtel (NE)' },
    { value: 'NW', label: 'Nidwald (NW)' },
    { value: 'OW', label: 'Obwald (OW)' },
    { value: 'SG', label: 'Saint-Gall (SG)' },
    { value: 'SH', label: 'Schaffhouse (SH)' },
    { value: 'SO', label: 'Soleure (SO)' },
    { value: 'SZ', label: 'Schwyz (SZ)' },
    { value: 'TG', label: 'Thurgovie (TG)' },
    { value: 'TI', label: 'Tessin (TI)' },
    { value: 'UR', label: 'Uri (UR)' },
    { value: 'VD', label: 'Vaud (VD)' },
    { value: 'VS', label: 'Valais (VS)' },
    { value: 'ZG', label: 'Zoug (ZG)' },
    { value: 'ZH', label: 'Zurich (ZH)' }
  ];

  // Estimation simplifiée des impôts (à affiner avec vraies données fiscales)
  const estimerImpots = (): { federaux: number; cantonaux: number; communaux: number; total: number } => {
    const revenuImposable = formData.revenu_imposable_estime || 0;
    const fortune = formData.fortune_imposable_estimee || 0;

    // Impôts fédéraux directs (barème simplifié)
    let federaux = 0;
    if (revenuImposable > 0) {
      // Barème progressif simplifié
      if (revenuImposable <= 17800) federaux = 0;
      else if (revenuImposable <= 31600) federaux = (revenuImposable - 17800) * 0.0077;
      else if (revenuImposable <= 41400) federaux = 106 + (revenuImposable - 31600) * 0.0088;
      else if (revenuImposable <= 55200) federaux = 192 + (revenuImposable - 41400) * 0.0220;
      else if (revenuImposable <= 72500) federaux = 496 + (revenuImposable - 55200) * 0.0264;
      else if (revenuImposable <= 78100) federaux = 953 + (revenuImposable - 72500) * 0.0308;
      else if (revenuImposable <= 103600) federaux = 1126 + (revenuImposable - 78100) * 0.0352;
      else if (revenuImposable <= 134600) federaux = 2023 + (revenuImposable - 103600) * 0.0770;
      else if (revenuImposable <= 176000) federaux = 4410 + (revenuImposable - 134600) * 0.0880;
      else if (revenuImposable <= 755200) federaux = 8053 + (revenuImposable - 176000) * 0.1100;
      else federaux = 71765 + (revenuImposable - 755200) * 0.1320;
    }

    // Impôts cantonaux et communaux (estimation simplifiée)
    // Multiplicateur moyen selon canton (à affiner)
    const multiplicateurs: Record<string, number> = {
      'VD': 1.8, 'GE': 2.0, 'NE': 2.1, 'BE': 1.9, 'FR': 1.7,
      'ZH': 1.2, 'ZG': 0.8, 'SZ': 1.0, 'LU': 1.4, 'AG': 1.3,
      'BS': 1.9, 'BL': 1.6, 'SG': 1.5, 'TI': 2.2, 'VS': 1.8,
      'GR': 1.6, 'TG': 1.4, 'SO': 1.7, 'SH': 1.4, 'JU': 2.0,
      'AI': 1.2, 'AR': 1.3, 'GL': 1.5, 'NW': 1.1, 'OW': 1.2, 'UR': 1.3
    };

    const multiplicateur = multiplicateurs[formData.canton_residence || 'VD'] || 1.5;

    // Calcul simplifié: impôt cantonal ≈ impôt fédéral × multiplicateur
    const cantonaux = federaux * multiplicateur;

    // Impôts communaux (environ 70-80% des impôts cantonaux)
    const communaux = cantonaux * 0.75;

    // Impôt sur la fortune (simplifié: 0.2-0.5% selon canton)
    const impotFortune = fortune * 0.003;

    const total = federaux + cantonaux + communaux + impotFortune;

    return {
      federaux: Math.round(federaux),
      cantonaux: Math.round(cantonaux),
      communaux: Math.round(communaux),
      total: Math.round(total)
    };
  };

  const impotsEstimes = estimerImpots();

  // Calcul du taux d'imposition effectif
  const tauxEffectif = formData.revenu_imposable_estime
    ? (impotsEstimes.total / formData.revenu_imposable_estime) * 100
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <Card className={`border-l-4 border-l-emerald-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Fiscalité - Impôts & Optimisation
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Calcul automatique de vos impôts et identification d'opportunités d'optimisation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Situation fiscale */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📍 Situation Fiscale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="canton">
                Canton de résidence <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.canton_residence || 'VD'}
                onValueChange={(value) => handleChange('canton_residence', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cantonsSuisses.map((canton) => (
                    <SelectItem key={canton.value} value={canton.value}>
                      {canton.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commune">
                Commune de résidence <span className="text-red-500">*</span>
              </Label>
              <Input
                id="commune"
                placeholder="Ex: Lausanne"
                value={formData.commune_residence || ''}
                onChange={(e) => handleChange('commune_residence', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="statut_fiscal">
                Statut fiscal <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.statut_fiscal || 'celibataire'}
                onValueChange={(value) => handleChange('statut_fiscal', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celibataire">Célibataire</SelectItem>
                  <SelectItem value="marie_un_revenu">Marié(e) - Un revenu</SelectItem>
                  <SelectItem value="marie_deux_revenus">Marié(e) - Deux revenus</SelectItem>
                  <SelectItem value="concubinage">Concubinage (déclarations séparées)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenus et Fortune imposables */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Calculator className="w-5 h-5" />
            Base de Calcul
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Ces montants sont calculés automatiquement depuis vos formulaires précédents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenu_imposable">Revenu imposable estimé (CHF/an)</Label>
              <Input
                id="revenu_imposable"
                type="number"
                step="1000"
                placeholder="96000"
                value={formData.revenu_imposable_estime || ''}
                onChange={(e) => handleChange('revenu_imposable_estime', parseFloat(e.target.value) || 0)}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenu brut moins déductions sociales (AVS, LPP, etc.)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fortune_imposable">Fortune imposable estimée (CHF)</Label>
              <Input
                id="fortune_imposable"
                type="number"
                step="10000"
                placeholder="250000"
                value={formData.fortune_imposable_estimee || ''}
                onChange={(e) => handleChange('fortune_imposable_estimee', parseFloat(e.target.value) || 0)}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fortune nette (actifs - dettes)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Déductions fiscales */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <TrendingDown className="w-5 h-5 text-green-600" />
            Déductions Fiscales
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Déductions qui réduisent votre revenu imposable
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Déductions automatiques */}
            <div className={`space-y-2 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} p-4 rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-green-600" />
                <Label className="font-medium">Déductions automatiques</Label>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>LPP + 3e pilier A:</span>
                  <span className="font-medium">{(formData.deductions_lpp_pilier3a || 0).toLocaleString('fr-CH')} CHF</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Intérêts hypothécaires:</span>
                  <span className="font-medium">{(formData.deductions_interets_hypothecaires || 0).toLocaleString('fr-CH')} CHF</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Ces montants sont importés depuis vos formulaires précédents</p>
            </div>

            {/* Déductions manuelles */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="frais_garde">Frais de garde d'enfants (CHF/an)</Label>
                <Input
                  id="frais_garde"
                  type="number"
                  step="100"
                  placeholder="5000"
                  value={formData.deductions_frais_garde_enfants || ''}
                  onChange={(e) => handleChange('deductions_frais_garde_enfants', parseFloat(e.target.value) || 0)}
                />
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Maximum: 10'100 CHF/enfant (VD)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frais_formation">Frais de formation (CHF/an)</Label>
                <Input
                  id="frais_formation"
                  type="number"
                  step="100"
                  placeholder="2000"
                  value={formData.deductions_frais_formation || ''}
                  onChange={(e) => handleChange('deductions_frais_formation', parseFloat(e.target.value) || 0)}
                />
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Maximum: 12'000 CHF/an</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dons">Dons à des organisations d'utilité publique (CHF/an)</Label>
              <Input
                id="dons"
                type="number"
                step="100"
                placeholder="500"
                value={formData.deductions_dons || ''}
                onChange={(e) => handleChange('deductions_dons', parseFloat(e.target.value) || 0)}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Minimum 100 CHF - Maximum 20% du revenu net</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pension">Pension alimentaire versée (CHF/an)</Label>
              <Input
                id="pension"
                type="number"
                step="100"
                placeholder="0"
                value={formData.deductions_pension_alimentaire || ''}
                onChange={(e) => handleChange('deductions_pension_alimentaire', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimation des impôts */}
      <Card className={`border-2 ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-emerald-700' : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'}`}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Calculator className="w-5 h-5 text-emerald-600" />
            Estimation de Vos Impôts (Année)
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Calcul estimatif basé sur votre canton et votre situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm">Impôts fédéraux directs:</span>
              <span className="font-bold text-blue-600">
                {impotsEstimes.federaux.toLocaleString('fr-CH')} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm">Impôts cantonaux:</span>
              <span className="font-bold text-indigo-600">
                {impotsEstimes.cantonaux.toLocaleString('fr-CH')} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm">Impôts communaux:</span>
              <span className="font-bold text-purple-600">
                {impotsEstimes.communaux.toLocaleString('fr-CH')} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-700' : 'bg-gradient-to-r from-emerald-100 to-green-100'} rounded-lg border-2 border-emerald-300`}>
              <span className="text-lg font-medium">Total impôts annuels estimés:</span>
              <span className="text-3xl font-bold text-emerald-600">
                {impotsEstimes.total.toLocaleString('fr-CH')} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm">Charge mensuelle moyenne:</span>
              <span className="font-bold text-orange-600">
                {Math.round(impotsEstimes.total / 12).toLocaleString('fr-CH')} CHF/mois
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm">Taux d'imposition effectif:</span>
              <span className="font-bold text-red-600">
                {tauxEffectif.toFixed(2)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunités d'optimisation */}
      <Card className={`border-l-4 border-l-yellow-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Opportunités d'Optimisation Fiscale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className={`p-4 ${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'} rounded-lg border border-yellow-200`}>
              <h4 className="font-medium mb-2">💡 3e pilier A non maximisé</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Vous pouvez encore verser {(7056 - (formData.deductions_lpp_pilier3a || 0)).toLocaleString('fr-CH')} CHF en 3a cette année.
                Économie fiscale estimée: {Math.round((7056 - (formData.deductions_lpp_pilier3a || 0)) * tauxEffectif / 100).toLocaleString('fr-CH')} CHF
              </p>
            </div>

            {formData.deductions_interets_hypothecaires && formData.deductions_interets_hypothecaires > 0 && (
              <div className={`p-4 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} rounded-lg border border-blue-200`}>
                <h4 className="font-medium mb-2">🏠 Amortissement indirect</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Au lieu d'amortir directement votre hypothèque, versez le montant dans votre 3e pilier A pour bénéficier de déductions fiscales
                  tout en réduisant votre dette hypothécaire.
                </p>
              </div>
            )}

            <div className={`p-4 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} rounded-lg border border-green-200`}>
              <h4 className="font-medium mb-2">📅 Échelonnement des retraits 3a</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Ouvrez plusieurs comptes 3a pour pouvoir les retirer sur plusieurs années et réduire la progression fiscale lors du retrait.
              </p>
            </div>

            {formData.statut_fiscal === 'marie_deux_revenus' && (
              <div className={`p-4 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-lg border border-purple-200`}>
                <h4 className="font-medium mb-2">💑 Fractionnement fiscal</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  En tant que couple marié avec deux revenus, assurez-vous de répartir optimalement vos déductions entre les deux conjoints.
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
