'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wallet, Briefcase, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { RevenuData } from '@/lib/types/maison-finances';

interface RevenuFormProps {
  data?: Partial<RevenuData>;
  onSave: (data: Partial<RevenuData>) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  isDarkMode?: boolean;
}

export default function RevenuForm({ data, onSave, onNext, onPrevious, isDarkMode = false }: RevenuFormProps) {
  const [formData, setFormData] = useState<Partial<RevenuData>>(data || { taux_activite: 100 });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof RevenuData, value: any) => {
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

  // Calcul du revenu net annuel total
  const calculateRevenuTotal = (): number => {
    let total = 0;

    if (formData.statut_professionnel === 'salarie' && formData.salaire_net_mensuel) {
      const moisBase = formData['13eme_salaire'] ? 13 : 12;
      total += formData.salaire_net_mensuel * moisBase;
      if (formData.primes_variables) total += formData.primes_variables;
    }

    if (formData.statut_professionnel === 'independant' && formData.benefice_net_independant) {
      total += formData.benefice_net_independant;
    }

    if (formData.revenus_locatifs) total += formData.revenus_locatifs * 12;
    if (formData.revenus_placements) total += formData.revenus_placements;
    if (formData.autres_revenus) total += formData.autres_revenus;

    return total;
  };

  // Calcul du revenu mensuel moyen
  const revenuMensuelMoyen = calculateRevenuTotal() / 12;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <Card className={`border-l-4 border-l-green-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Wallet className="w-6 h-6 text-green-600" />
            Revenu - Sources de Revenus
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Renseignez toutes vos sources de revenus pour une vision complète de votre situation financière
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Situation professionnelle */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Briefcase className="w-5 h-5" />
            Activité Professionnelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Statut professionnel */}
            <div className="space-y-2">
              <Label htmlFor="statut_professionnel">
                Statut professionnel <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.statut_professionnel || 'salarie'}
                onValueChange={(value) => handleChange('statut_professionnel', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salarie">Salarié(e)</SelectItem>
                  <SelectItem value="independant">Indépendant(e)</SelectItem>
                  <SelectItem value="sans_emploi">Sans emploi</SelectItem>
                  <SelectItem value="retraite">Retraité(e)</SelectItem>
                  <SelectItem value="etudiant">Étudiant(e)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Taux d'activité */}
            {formData.statut_professionnel !== 'sans_emploi' && formData.statut_professionnel !== 'retraite' && (
              <div className="space-y-2">
                <Label htmlFor="taux_activite">
                  Taux d'activité: {formData.taux_activite || 100}%
                </Label>
                <Slider
                  id="taux_activite"
                  min={0}
                  max={100}
                  step={10}
                  value={[formData.taux_activite || 100]}
                  onValueChange={([value]) => handleChange('taux_activite', value)}
                  className="mt-2"
                />
                <div className={`flex justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenus salariés */}
      {formData.statut_professionnel === 'salarie' && (
        <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>💼 Revenus Salariés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salaire brut */}
              <div className="space-y-2">
                <Label htmlFor="salaire_brut">Salaire brut mensuel (CHF)</Label>
                <Input
                  id="salaire_brut"
                  type="number"
                  step="0.01"
                  placeholder="7000.00"
                  value={formData.salaire_brut_mensuel || ''}
                  onChange={(e) => handleChange('salaire_brut_mensuel', parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Salaire net */}
              <div className="space-y-2">
                <Label htmlFor="salaire_net">
                  Salaire net mensuel (CHF) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="salaire_net"
                  type="number"
                  step="0.01"
                  placeholder="5500.00"
                  value={formData.salaire_net_mensuel || ''}
                  onChange={(e) => handleChange('salaire_net_mensuel', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              {/* 13ème salaire */}
              <div className={`flex items-center space-x-2 md:col-span-2 p-3 rounded-lg ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <Checkbox
                  id="13eme_salaire"
                  checked={formData['13eme_salaire'] || false}
                  onCheckedChange={(checked) => handleChange('13eme_salaire', checked)}
                />
                <Label htmlFor="13eme_salaire" className="cursor-pointer">
                  Je reçois un 13ème salaire
                </Label>
              </div>

              {/* Primes variables */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="primes_variables">Primes et bonus annuels (CHF)</Label>
                <Input
                  id="primes_variables"
                  type="number"
                  step="0.01"
                  placeholder="5000.00"
                  value={formData.primes_variables || ''}
                  onChange={(e) => handleChange('primes_variables', parseFloat(e.target.value) || 0)}
                />
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Estimation des primes variables, bonus, commissions annuels</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenus indépendants */}
      {formData.statut_professionnel === 'independant' && (
        <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🚀 Revenus Indépendants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CA annuel */}
              <div className="space-y-2">
                <Label htmlFor="ca_annuel">Chiffre d'affaires annuel (CHF)</Label>
                <Input
                  id="ca_annuel"
                  type="number"
                  step="0.01"
                  placeholder="120000.00"
                  value={formData.ca_annuel_independant || ''}
                  onChange={(e) => handleChange('ca_annuel_independant', parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Charges annuelles */}
              <div className="space-y-2">
                <Label htmlFor="charges_annuelles">Charges annuelles (CHF)</Label>
                <Input
                  id="charges_annuelles"
                  type="number"
                  step="0.01"
                  placeholder="40000.00"
                  value={formData.charges_annuelles_independant || ''}
                  onChange={(e) => handleChange('charges_annuelles_independant', parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Bénéfice net */}
              <div className="space-y-2">
                <Label htmlFor="benefice_net">
                  Bénéfice net annuel (CHF) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="benefice_net"
                  type="number"
                  step="0.01"
                  placeholder="80000.00"
                  value={formData.benefice_net_independant || ''}
                  onChange={(e) => handleChange('benefice_net_independant', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Autres revenus */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <TrendingUp className="w-5 h-5" />
            Autres Sources de Revenus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenus locatifs */}
            <div className="space-y-2">
              <Label htmlFor="revenus_locatifs">Revenus locatifs mensuels (CHF)</Label>
              <Input
                id="revenus_locatifs"
                type="number"
                step="0.01"
                placeholder="1500.00"
                value={formData.revenus_locatifs || ''}
                onChange={(e) => handleChange('revenus_locatifs', parseFloat(e.target.value) || 0)}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenus nets de vos biens immobiliers locatifs</p>
            </div>

            {/* Revenus placements */}
            <div className="space-y-2">
              <Label htmlFor="revenus_placements">Revenus de placements annuels (CHF)</Label>
              <Input
                id="revenus_placements"
                type="number"
                step="0.01"
                placeholder="3000.00"
                value={formData.revenus_placements || ''}
                onChange={(e) => handleChange('revenus_placements', parseFloat(e.target.value) || 0)}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dividendes, intérêts, plus-values réalisées</p>
            </div>

            {/* Autres revenus */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="autres_revenus">Autres revenus annuels (CHF)</Label>
              <Input
                id="autres_revenus"
                type="number"
                step="0.01"
                placeholder="2000.00"
                value={formData.autres_revenus || ''}
                onChange={(e) => handleChange('autres_revenus', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Description autres revenus */}
            {formData.autres_revenus && formData.autres_revenus > 0 && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="autres_revenus_desc">Description</Label>
                <Textarea
                  id="autres_revenus_desc"
                  placeholder="Précisez la nature de ces revenus (pensions, rentes, allocations, etc.)"
                  value={formData.autres_revenus_description || ''}
                  onChange={(e) => handleChange('autres_revenus_description', e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Situation familiale */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Users className="w-5 h-5" />
            Situation Familiale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Situation familiale */}
            <div className="space-y-2">
              <Label htmlFor="situation_familiale">
                Situation familiale <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.situation_familiale || 'celibataire'}
                onValueChange={(value) => handleChange('situation_familiale', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celibataire">Célibataire</SelectItem>
                  <SelectItem value="marie">Marié(e)</SelectItem>
                  <SelectItem value="concubin">En concubinage</SelectItem>
                  <SelectItem value="divorce">Divorcé(e)</SelectItem>
                  <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Revenus conjoint */}
            {(formData.situation_familiale === 'marie' || formData.situation_familiale === 'concubin') && (
              <div className="space-y-2">
                <Label htmlFor="conjoint_revenus">Revenus net mensuels du conjoint (CHF)</Label>
                <Input
                  id="conjoint_revenus"
                  type="number"
                  step="0.01"
                  placeholder="5000.00"
                  value={formData.conjoint_revenus || ''}
                  onChange={(e) => handleChange('conjoint_revenus', parseFloat(e.target.value) || 0)}
                />
              </div>
            )}

            {/* Enfants à charge */}
            <div className="space-y-2">
              <Label htmlFor="nombre_enfants">Nombre d'enfants à charge</Label>
              <Input
                id="nombre_enfants"
                type="number"
                min="0"
                placeholder="0"
                value={formData.nombre_enfants_charge || 0}
                onChange={(e) => handleChange('nombre_enfants_charge', parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Autres personnes à charge */}
            <div className="space-y-2">
              <Label htmlFor="autres_personnes">Autres personnes à charge</Label>
              <Input
                id="autres_personnes"
                type="number"
                min="0"
                placeholder="0"
                value={formData.autres_personnes_charge || 0}
                onChange={(e) => handleChange('autres_personnes_charge', parseInt(e.target.value) || 0)}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Parents, proches dépendants financièrement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé des revenus */}
      <Card className={`border-2 ${isDarkMode ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 Résumé de Vos Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenu annuel total</div>
              <div className="text-2xl font-bold text-green-600">
                {calculateRevenuTotal().toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </div>
            </div>

            <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenu mensuel moyen</div>
              <div className="text-2xl font-bold text-blue-600">
                {revenuMensuelMoyen.toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </div>
            </div>

            {formData.conjoint_revenus && (
              <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenu du foyer</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {(calculateRevenuTotal() + (formData.conjoint_revenus * 12)).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
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
