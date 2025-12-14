'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, PieChart, Bitcoin, AlertCircle, Coins, CreditCard, AlertTriangle } from 'lucide-react';
import { FortuneData } from '@/lib/types/maison-finances';

interface FortuneFormProps {
  data?: Partial<FortuneData>;
  onSave: (data: Partial<FortuneData>) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  isDarkMode?: boolean;
}

export default function FortuneForm({ data, onSave, onNext, onPrevious, isDarkMode = false }: FortuneFormProps) {
  const [formData, setFormData] = useState<Partial<FortuneData>>(data || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FortuneData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRepartitionChange = (field: string, value: number) => {
    const repartition = formData.comptes_titres_repartition || {
      actions_suisses: 0,
      actions_etrangeres: 0,
      obligations: 0,
      fonds: 0,
      etf: 0,
      autres: 0
    };
    handleChange('comptes_titres_repartition', { ...repartition, [field]: value });
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

  // Calcul des actifs totaux
  const calculateActifsTotal = (): number => {
    let total = 0;
    total += formData.comptes_courants_total || 0;
    total += formData.comptes_epargne_total || 0;
    total += formData.comptes_titres_valeur || 0;
    total += formData.crypto_valeur || 0;
    total += formData.metaux_precieux_valeur || 0;
    total += formData.autres_actifs_valeur || 0;
    return total;
  };

  // Calcul des dettes totales
  const calculateDettesTotal = (): number => {
    let total = 0;
    total += formData.credits_consommation_total || 0;
    total += formData.cartes_credit_solde || 0;
    total += formData.autres_dettes_montant || 0;
    return total;
  };

  // Calcul de la fortune nette
  const fortuneNette = calculateActifsTotal() - calculateDettesTotal();

  // Calcul du total de la répartition
  const totalRepartition = Object.values(formData.comptes_titres_repartition || {}).reduce((a, b) => a + b, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <Card className={`border-l-4 border-l-indigo-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Fortune - Patrimoine & Placements
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Inventaire complet de vos actifs et dettes pour calculer votre fortune nette
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Liquidités */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Coins className="w-5 h-5" />
            Liquidités & Comptes Bancaires
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="comptes_courants">
                Total comptes courants (CHF) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="comptes_courants"
                type="number"
                step="0.01"
                placeholder="15000.00"
                value={formData.comptes_courants_total || ''}
                onChange={(e) => handleChange('comptes_courants_total', parseFloat(e.target.value) || 0)}
                required
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Somme de tous vos comptes courants</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comptes_epargne">
                Total comptes d'épargne (CHF) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="comptes_epargne"
                type="number"
                step="0.01"
                placeholder="35000.00"
                value={formData.comptes_epargne_total || ''}
                onChange={(e) => handleChange('comptes_epargne_total', parseFloat(e.target.value) || 0)}
                required
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comptes épargne, comptes de placement, etc.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placements bancaires */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <PieChart className="w-5 h-5" />
            Placements & Titres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} rounded-lg`}>
            <Checkbox
              id="comptes_titres"
              checked={formData.comptes_titres_existe || false}
              onCheckedChange={(checked) => handleChange('comptes_titres_existe', checked)}
            />
            <Label htmlFor="comptes_titres" className="cursor-pointer font-medium">
              J'ai un ou plusieurs comptes-titres
            </Label>
          </div>

          {formData.comptes_titres_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-300">
              <div className="space-y-2">
                <Label htmlFor="titres_valeur">Valeur totale du portefeuille (CHF)</Label>
                <Input
                  id="titres_valeur"
                  type="number"
                  step="1000"
                  placeholder="100000"
                  value={formData.comptes_titres_valeur || ''}
                  onChange={(e) => handleChange('comptes_titres_valeur', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Répartition des actifs (%)</Label>
                  <span className={`text-sm font-medium ${totalRepartition === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    Total: {totalRepartition}%
                  </span>
                </div>

                {/* Actions suisses */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Actions suisses</Label>
                    <span className="text-sm font-medium">{formData.comptes_titres_repartition?.actions_suisses || 0}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[formData.comptes_titres_repartition?.actions_suisses || 0]}
                    onValueChange={([value]) => handleRepartitionChange('actions_suisses', value)}
                  />
                </div>

                {/* Actions étrangères */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Actions étrangères</Label>
                    <span className="text-sm font-medium">{formData.comptes_titres_repartition?.actions_etrangeres || 0}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[formData.comptes_titres_repartition?.actions_etrangeres || 0]}
                    onValueChange={([value]) => handleRepartitionChange('actions_etrangeres', value)}
                  />
                </div>

                {/* Obligations */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Obligations</Label>
                    <span className="text-sm font-medium">{formData.comptes_titres_repartition?.obligations || 0}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[formData.comptes_titres_repartition?.obligations || 0]}
                    onValueChange={([value]) => handleRepartitionChange('obligations', value)}
                  />
                </div>

                {/* Fonds */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Fonds de placement</Label>
                    <span className="text-sm font-medium">{formData.comptes_titres_repartition?.fonds || 0}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[formData.comptes_titres_repartition?.fonds || 0]}
                    onValueChange={([value]) => handleRepartitionChange('fonds', value)}
                  />
                </div>

                {/* ETF */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">ETF</Label>
                    <span className="text-sm font-medium">{formData.comptes_titres_repartition?.etf || 0}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[formData.comptes_titres_repartition?.etf || 0]}
                    onValueChange={([value]) => handleRepartitionChange('etf', value)}
                  />
                </div>

                {/* Autres */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Autres (liquidités, etc.)</Label>
                    <span className="text-sm font-medium">{formData.comptes_titres_repartition?.autres || 0}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[formData.comptes_titres_repartition?.autres || 0]}
                    onValueChange={([value]) => handleRepartitionChange('autres', value)}
                  />
                </div>
              </div>

              {/* Profil investisseur */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="profil_risque">Profil de risque</Label>
                  <Select
                    value={formData.profil_risque || 'equilibre'}
                    onValueChange={(value) => handleChange('profil_risque', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defensif">Défensif (sécurité maximale)</SelectItem>
                      <SelectItem value="equilibre">Équilibré (équilibre risque/rendement)</SelectItem>
                      <SelectItem value="dynamique">Dynamique (croissance)</SelectItem>
                      <SelectItem value="agressif">Agressif (rendement maximal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horizon_placement">Horizon de placement (années)</Label>
                  <Input
                    id="horizon_placement"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="10"
                    value={formData.horizon_placement || ''}
                    onChange={(e) => handleChange('horizon_placement', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cryptomonnaies */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Bitcoin className="w-5 h-5" />
            Cryptomonnaies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'} rounded-lg`}>
            <Checkbox
              id="crypto"
              checked={formData.crypto_existe || false}
              onCheckedChange={(checked) => handleChange('crypto_existe', checked)}
            />
            <Label htmlFor="crypto" className="cursor-pointer font-medium">
              Je détiens des cryptomonnaies
            </Label>
          </div>

          {formData.crypto_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-orange-300">
              <div className="space-y-2">
                <Label htmlFor="crypto_valeur">Valeur totale (CHF)</Label>
                <Input
                  id="crypto_valeur"
                  type="number"
                  step="100"
                  placeholder="5000"
                  value={formData.crypto_valeur || ''}
                  onChange={(e) => handleChange('crypto_valeur', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crypto_types">Types de cryptos détenues (séparés par virgules)</Label>
                <Input
                  id="crypto_types"
                  placeholder="Bitcoin, Ethereum, Solana..."
                  value={formData.crypto_types?.join(', ') || ''}
                  onChange={(e) => handleChange('crypto_types', e.target.value.split(',').map(s => s.trim()))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Métaux précieux */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🪙 Métaux Précieux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'} rounded-lg`}>
            <Checkbox
              id="metaux"
              checked={formData.metaux_precieux_existe || false}
              onCheckedChange={(checked) => handleChange('metaux_precieux_existe', checked)}
            />
            <Label htmlFor="metaux" className="cursor-pointer font-medium">
              Je possède des métaux précieux (or, argent, platine...)
            </Label>
          </div>

          {formData.metaux_precieux_existe && (
            <div className="space-y-2 pl-4 border-l-2 border-yellow-300">
              <Label htmlFor="metaux_valeur">Valeur totale estimée (CHF)</Label>
              <Input
                id="metaux_valeur"
                type="number"
                step="100"
                placeholder="10000"
                value={formData.metaux_precieux_valeur || ''}
                onChange={(e) => handleChange('metaux_precieux_valeur', parseFloat(e.target.value) || 0)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Autres actifs */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>💼 Autres Actifs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-lg`}>
            <Checkbox
              id="autres_actifs"
              checked={formData.autres_actifs_existe || false}
              onCheckedChange={(checked) => handleChange('autres_actifs_existe', checked)}
            />
            <Label htmlFor="autres_actifs" className="cursor-pointer font-medium">
              J'ai d'autres actifs (prêts consentis, participations, etc.)
            </Label>
          </div>

          {formData.autres_actifs_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-purple-300">
              <div className="space-y-2">
                <Label htmlFor="autres_actifs_desc">Description</Label>
                <Input
                  id="autres_actifs_desc"
                  placeholder="Ex: Parts dans une société, prêts à des tiers..."
                  value={formData.autres_actifs_description || ''}
                  onChange={(e) => handleChange('autres_actifs_description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="autres_actifs_valeur">Valeur totale (CHF)</Label>
                <Input
                  id="autres_actifs_valeur"
                  type="number"
                  step="1000"
                  placeholder="20000"
                  value={formData.autres_actifs_valeur || ''}
                  onChange={(e) => handleChange('autres_actifs_valeur', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dettes */}
      <Card className={`border-l-4 border-l-red-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Dettes & Crédits
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Inventaire de vos engagements financiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Crédits à la consommation */}
          <div className="space-y-3">
            <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} rounded-lg`}>
              <Checkbox
                id="credits_conso"
                checked={formData.credits_consommation_existe || false}
                onCheckedChange={(checked) => handleChange('credits_consommation_existe', checked)}
              />
              <Label htmlFor="credits_conso" className="cursor-pointer font-medium">
                J'ai des crédits à la consommation
              </Label>
            </div>

            {formData.credits_consommation_existe && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-red-300">
                <div className="space-y-2">
                  <Label htmlFor="credits_total">Montant total restant dû (CHF)</Label>
                  <Input
                    id="credits_total"
                    type="number"
                    step="100"
                    placeholder="15000"
                    value={formData.credits_consommation_total || ''}
                    onChange={(e) => handleChange('credits_consommation_total', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credits_taux">Taux d'intérêt moyen (%)</Label>
                  <Input
                    id="credits_taux"
                    type="number"
                    step="0.1"
                    placeholder="8.5"
                    value={formData.credits_consommation_taux || ''}
                    onChange={(e) => handleChange('credits_consommation_taux', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cartes de crédit */}
          <div className="space-y-2">
            <Label htmlFor="cartes_credit" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Solde des cartes de crédit (CHF)
            </Label>
            <Input
              id="cartes_credit"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.cartes_credit_solde || ''}
              onChange={(e) => handleChange('cartes_credit_solde', parseFloat(e.target.value) || 0)}
            />
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Montant actuellement non remboursé</p>
          </div>

          {/* Autres dettes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autres_dettes"
                checked={formData.autres_dettes_existe || false}
                onCheckedChange={(checked) => handleChange('autres_dettes_existe', checked)}
              />
              <Label htmlFor="autres_dettes" className="cursor-pointer">
                J'ai d'autres dettes
              </Label>
            </div>

            {formData.autres_dettes_existe && (
              <div className="space-y-4 pl-4 border-l-2 border-gray-300">
                <div className="space-y-2">
                  <Label htmlFor="autres_dettes_desc">Description</Label>
                  <Input
                    id="autres_dettes_desc"
                    placeholder="Ex: Prêt familial, impôts en retard..."
                    value={formData.autres_dettes_description || ''}
                    onChange={(e) => handleChange('autres_dettes_description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autres_dettes_montant">Montant total (CHF)</Label>
                  <Input
                    id="autres_dettes_montant"
                    type="number"
                    step="100"
                    placeholder="5000"
                    value={formData.autres_dettes_montant || ''}
                    onChange={(e) => handleChange('autres_dettes_montant', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résumé Fortune */}
      <Card className={`border-2 ${isDarkMode ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'}`}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 Résumé de Votre Fortune</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm font-medium">Actifs totaux</span>
              <span className="text-xl font-bold text-green-600">
                + {calculateActifsTotal().toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="text-sm font-medium">Dettes totales</span>
              <span className="text-xl font-bold text-red-600">
                - {calculateDettesTotal().toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${isDarkMode ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-700' : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-300'}`}>
              <span className="text-lg font-medium">Fortune nette</span>
              <span className={`text-3xl font-bold ${fortuneNette >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fortuneNette.toLocaleString('fr-CH', { minimumFractionDigits: 2, signDisplay: 'always' })} CHF
              </span>
            </div>

            {/* Répartition des actifs */}
            {calculateActifsTotal() > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Répartition des actifs</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Liquidités</span>
                    <span className="font-medium">
                      {(((formData.comptes_courants_total || 0) + (formData.comptes_epargne_total || 0)) / calculateActifsTotal() * 100).toFixed(1)}%
                    </span>
                  </div>
                  {formData.comptes_titres_existe && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Titres/Actions</span>
                      <span className="font-medium">
                        {((formData.comptes_titres_valeur || 0) / calculateActifsTotal() * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {formData.crypto_existe && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Cryptomonnaies</span>
                      <span className="font-medium">
                        {((formData.crypto_valeur || 0) / calculateActifsTotal() * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
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
