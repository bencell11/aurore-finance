'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calculator, Home, ShoppingCart, Car, Heart, PiggyBank, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { BudgetData } from '@/lib/types/maison-finances';

interface BudgetFormProps {
  data?: Partial<BudgetData>;
  onSave: (data: Partial<BudgetData>) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  isDarkMode?: boolean;
}

export default function BudgetForm({ data, onSave, onNext, onPrevious, isDarkMode = false }: BudgetFormProps) {
  const [formData, setFormData] = useState<Partial<BudgetData>>(data || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof BudgetData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calcul automatique des totaux et pourcentages
  useEffect(() => {
    // Catégorie 1: Logement
    const logementTotal = (formData.logement_loyer_hypotheque || 0) +
                          (formData.logement_charges || 0) +
                          (formData.logement_electricite || 0) +
                          (formData.logement_chauffage || 0) +
                          (formData.logement_eau || 0) +
                          (formData.logement_internet_tv || 0) +
                          (formData.logement_telephone || 0) +
                          (formData.logement_entretien || 0) +
                          (formData.logement_assurances || 0);

    // Catégorie 2: Vie courante
    const vieTotal = (formData.vie_alimentation || 0) +
                     (formData.vie_restaurants || 0) +
                     (formData.vie_vetements || 0) +
                     (formData.vie_coiffeur_beaute || 0) +
                     (formData.vie_loisirs_sorties || 0) +
                     (formData.vie_sport_abonnements || 0) +
                     (formData.vie_animaux || 0) +
                     (formData.vie_divers || 0);

    // Catégorie 3: Transports
    const transportTotal = (formData.transport_voiture_leasing || 0) +
                           (formData.transport_essence || 0) +
                           (formData.transport_entretien_voiture || 0) +
                           (formData.transport_parking || 0) +
                           (formData.transport_transports_publics || 0);

    // Catégorie 4: Santé & Assurances
    const santeTotal = (formData.sante_lamal || 0) +
                       (formData.sante_lca || 0) +
                       (formData.sante_franchise_quote_part || 0) +
                       (formData.sante_medicaments || 0) +
                       (formData.sante_dentiste || 0) +
                       (formData.sante_rc_menage || 0) +
                       (formData.sante_protection_juridique || 0) +
                       (formData.sante_autres_assurances || 0);

    // Catégorie 5: Épargne & Prévoyance
    const epargneTotal = (formData.epargne_pilier3a || 0) +
                         (formData.epargne_epargne_libre || 0) +
                         (formData.epargne_placements || 0) +
                         (formData.epargne_remboursement_dettes || 0);

    const depensesTotal = logementTotal + vieTotal + transportTotal + santeTotal + epargneTotal;
    const revenuTotal = formData.revenus_mensuels_nets_total || 1;
    const solde = revenuTotal - depensesTotal;

    setFormData(prev => ({
      ...prev,
      logement_total: logementTotal,
      logement_pourcentage: (logementTotal / revenuTotal) * 100,
      vie_total: vieTotal,
      vie_pourcentage: (vieTotal / revenuTotal) * 100,
      transport_total: transportTotal,
      transport_pourcentage: (transportTotal / revenuTotal) * 100,
      sante_total: santeTotal,
      sante_pourcentage: (santeTotal / revenuTotal) * 100,
      epargne_total: epargneTotal,
      epargne_pourcentage: (epargneTotal / revenuTotal) * 100,
      depenses_mensuelles_total: depensesTotal,
      solde_mensuel: solde,
      taux_epargne: (epargneTotal / revenuTotal) * 100
    }));
  }, [
    formData.revenus_mensuels_nets_total,
    formData.logement_loyer_hypotheque, formData.logement_charges, formData.logement_electricite,
    formData.logement_chauffage, formData.logement_eau, formData.logement_internet_tv,
    formData.logement_telephone, formData.logement_entretien, formData.logement_assurances,
    formData.vie_alimentation, formData.vie_restaurants, formData.vie_vetements,
    formData.vie_coiffeur_beaute, formData.vie_loisirs_sorties, formData.vie_sport_abonnements,
    formData.vie_animaux, formData.vie_divers,
    formData.transport_voiture_leasing, formData.transport_essence, formData.transport_entretien_voiture,
    formData.transport_parking, formData.transport_transports_publics,
    formData.sante_lamal, formData.sante_lca, formData.sante_franchise_quote_part,
    formData.sante_medicaments, formData.sante_dentiste, formData.sante_rc_menage,
    formData.sante_protection_juridique, formData.sante_autres_assurances,
    formData.epargne_pilier3a, formData.epargne_epargne_libre, formData.epargne_placements,
    formData.epargne_remboursement_dettes
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

  // Helper pour la couleur du pourcentage
  const getPercentageColor = (actual: number, min: number, max: number): string => {
    if (actual < min) return 'text-green-600';
    if (actual > max) return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <Card className={`border-l-4 border-l-yellow-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Calculator className="w-6 h-6 text-yellow-600" />
            Budget - Revenus & Dépenses Mensuels
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Détaillez votre budget mensuel pour identifier les opportunités d'optimisation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Revenus */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>💰 Revenus Mensuels Nets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="revenus_total">
              Total des revenus nets mensuels (CHF) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="revenus_total"
              type="number"
              step="0.01"
              placeholder="8000.00"
              value={formData.revenus_mensuels_nets_total || ''}
              onChange={(e) => handleChange('revenus_mensuels_nets_total', parseFloat(e.target.value) || 0)}
              required
            />
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total de tous vos revenus nets après impôts (salaires, rentes, revenus locatifs, etc.)</p>
          </div>
        </CardContent>
      </Card>

      {/* Catégorie 1: Logement */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Home className="w-5 h-5 text-blue-600" />
              1. Logement
            </CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {(formData.logement_total || 0).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </div>
              <div className={`text-sm font-medium ${getPercentageColor(formData.logement_pourcentage || 0, 25, 35)}`}>
                {(formData.logement_pourcentage || 0).toFixed(1)}% (recommandé: 25-35%)
              </div>
            </div>
          </div>
          <Progress value={formData.logement_pourcentage || 0} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loyer">Loyer / Hypothèque</Label>
              <Input
                id="loyer"
                type="number"
                step="0.01"
                placeholder="1800.00"
                value={formData.logement_loyer_hypotheque || ''}
                onChange={(e) => handleChange('logement_loyer_hypotheque', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="charges">Charges</Label>
              <Input
                id="charges"
                type="number"
                step="0.01"
                placeholder="200.00"
                value={formData.logement_charges || ''}
                onChange={(e) => handleChange('logement_charges', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="electricite">Électricité</Label>
              <Input
                id="electricite"
                type="number"
                step="0.01"
                placeholder="80.00"
                value={formData.logement_electricite || ''}
                onChange={(e) => handleChange('logement_electricite', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chauffage">Chauffage</Label>
              <Input
                id="chauffage"
                type="number"
                step="0.01"
                placeholder="120.00"
                value={formData.logement_chauffage || ''}
                onChange={(e) => handleChange('logement_chauffage', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eau">Eau</Label>
              <Input
                id="eau"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={formData.logement_eau || ''}
                onChange={(e) => handleChange('logement_eau', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="internet">Internet / TV</Label>
              <Input
                id="internet"
                type="number"
                step="0.01"
                placeholder="100.00"
                value={formData.logement_internet_tv || ''}
                onChange={(e) => handleChange('logement_internet_tv', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone mobile</Label>
              <Input
                id="telephone"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={formData.logement_telephone || ''}
                onChange={(e) => handleChange('logement_telephone', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entretien">Entretien logement</Label>
              <Input
                id="entretien"
                type="number"
                step="0.01"
                placeholder="100.00"
                value={formData.logement_entretien || ''}
                onChange={(e) => handleChange('logement_entretien', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assurances_logement">Assurances logement</Label>
              <Input
                id="assurances_logement"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={formData.logement_assurances || ''}
                onChange={(e) => handleChange('logement_assurances', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catégorie 2: Vie courante */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <ShoppingCart className="w-5 h-5 text-green-600" />
              2. Vie Courante
            </CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {(formData.vie_total || 0).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </div>
              <div className={`text-sm font-medium ${getPercentageColor(formData.vie_pourcentage || 0, 15, 25)}`}>
                {(formData.vie_pourcentage || 0).toFixed(1)}% (recommandé: 15-25%)
              </div>
            </div>
          </div>
          <Progress value={formData.vie_pourcentage || 0} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alimentation">Alimentation</Label>
              <Input
                id="alimentation"
                type="number"
                step="0.01"
                placeholder="600.00"
                value={formData.vie_alimentation || ''}
                onChange={(e) => handleChange('vie_alimentation', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurants">Restaurants</Label>
              <Input
                id="restaurants"
                type="number"
                step="0.01"
                placeholder="200.00"
                value={formData.vie_restaurants || ''}
                onChange={(e) => handleChange('vie_restaurants', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vetements">Vêtements</Label>
              <Input
                id="vetements"
                type="number"
                step="0.01"
                placeholder="150.00"
                value={formData.vie_vetements || ''}
                onChange={(e) => handleChange('vie_vetements', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coiffeur">Coiffeur / Beauté</Label>
              <Input
                id="coiffeur"
                type="number"
                step="0.01"
                placeholder="80.00"
                value={formData.vie_coiffeur_beaute || ''}
                onChange={(e) => handleChange('vie_coiffeur_beaute', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loisirs">Loisirs / Sorties</Label>
              <Input
                id="loisirs"
                type="number"
                step="0.01"
                placeholder="200.00"
                value={formData.vie_loisirs_sorties || ''}
                onChange={(e) => handleChange('vie_loisirs_sorties', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sport">Sport / Abonnements</Label>
              <Input
                id="sport"
                type="number"
                step="0.01"
                placeholder="100.00"
                value={formData.vie_sport_abonnements || ''}
                onChange={(e) => handleChange('vie_sport_abonnements', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="animaux">Animaux</Label>
              <Input
                id="animaux"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={formData.vie_animaux || ''}
                onChange={(e) => handleChange('vie_animaux', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="divers_vie">Divers</Label>
              <Input
                id="divers_vie"
                type="number"
                step="0.01"
                placeholder="100.00"
                value={formData.vie_divers || ''}
                onChange={(e) => handleChange('vie_divers', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catégorie 3: Transports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Car className="w-5 h-5 text-purple-600" />
              3. Transports
            </CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {(formData.transport_total || 0).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </div>
              <div className={`text-sm font-medium ${getPercentageColor(formData.transport_pourcentage || 0, 5, 15)}`}>
                {(formData.transport_pourcentage || 0).toFixed(1)}% (recommandé: 5-15%)
              </div>
            </div>
          </div>
          <Progress value={formData.transport_pourcentage || 0} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voiture_leasing">Voiture / Leasing</Label>
              <Input
                id="voiture_leasing"
                type="number"
                step="0.01"
                placeholder="400.00"
                value={formData.transport_voiture_leasing || ''}
                onChange={(e) => handleChange('transport_voiture_leasing', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="essence">Essence</Label>
              <Input
                id="essence"
                type="number"
                step="0.01"
                placeholder="200.00"
                value={formData.transport_essence || ''}
                onChange={(e) => handleChange('transport_essence', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entretien_voiture">Entretien voiture</Label>
              <Input
                id="entretien_voiture"
                type="number"
                step="0.01"
                placeholder="100.00"
                value={formData.transport_entretien_voiture || ''}
                onChange={(e) => handleChange('transport_entretien_voiture', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking">Parking</Label>
              <Input
                id="parking"
                type="number"
                step="0.01"
                placeholder="150.00"
                value={formData.transport_parking || ''}
                onChange={(e) => handleChange('transport_parking', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transports_publics">Transports publics</Label>
              <Input
                id="transports_publics"
                type="number"
                step="0.01"
                placeholder="90.00"
                value={formData.transport_transports_publics || ''}
                onChange={(e) => handleChange('transport_transports_publics', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catégorie 4: Santé & Assurances */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Heart className="w-5 h-5 text-red-600" />
              4. Santé & Assurances
            </CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {(formData.sante_total || 0).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </div>
              <div className={`text-sm font-medium ${getPercentageColor(formData.sante_pourcentage || 0, 10, 20)}`}>
                {(formData.sante_pourcentage || 0).toFixed(1)}% (recommandé: 10-20%)
              </div>
            </div>
          </div>
          <Progress value={formData.sante_pourcentage || 0} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lamal">Assurance LAMal</Label>
              <Input
                id="lamal"
                type="number"
                step="0.01"
                placeholder="350.00"
                value={formData.sante_lamal || ''}
                onChange={(e) => handleChange('sante_lamal', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lca">Assurance LCA</Label>
              <Input
                id="lca"
                type="number"
                step="0.01"
                placeholder="80.00"
                value={formData.sante_lca || ''}
                onChange={(e) => handleChange('sante_lca', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="franchise">Franchise / Quote-part</Label>
              <Input
                id="franchise"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={formData.sante_franchise_quote_part || ''}
                onChange={(e) => handleChange('sante_franchise_quote_part', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicaments">Médicaments</Label>
              <Input
                id="medicaments"
                type="number"
                step="0.01"
                placeholder="30.00"
                value={formData.sante_medicaments || ''}
                onChange={(e) => handleChange('sante_medicaments', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dentiste">Dentiste</Label>
              <Input
                id="dentiste"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={formData.sante_dentiste || ''}
                onChange={(e) => handleChange('sante_dentiste', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rc_menage_budget">RC / Ménage</Label>
              <Input
                id="rc_menage_budget"
                type="number"
                step="0.01"
                placeholder="40.00"
                value={formData.sante_rc_menage || ''}
                onChange={(e) => handleChange('sante_rc_menage', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protection_juridique_budget">Protection juridique</Label>
              <Input
                id="protection_juridique_budget"
                type="number"
                step="0.01"
                placeholder="20.00"
                value={formData.sante_protection_juridique || ''}
                onChange={(e) => handleChange('sante_protection_juridique', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="autres_assurances">Autres assurances</Label>
              <Input
                id="autres_assurances"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={formData.sante_autres_assurances || ''}
                onChange={(e) => handleChange('sante_autres_assurances', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catégorie 5: Épargne & Prévoyance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <PiggyBank className="w-5 h-5 text-indigo-600" />
              5. Épargne & Prévoyance
            </CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {(formData.epargne_total || 0).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </div>
              <div className={`text-sm font-medium ${getPercentageColor(formData.epargne_pourcentage || 0, 10, 20)}`}>
                {(formData.epargne_pourcentage || 0).toFixed(1)}% (recommandé: 10-20%)
              </div>
            </div>
          </div>
          <Progress value={formData.epargne_pourcentage || 0} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pilier3a_budget">3e pilier A</Label>
              <Input
                id="pilier3a_budget"
                type="number"
                step="0.01"
                placeholder="588.00"
                value={formData.epargne_pilier3a || ''}
                onChange={(e) => handleChange('epargne_pilier3a', parseFloat(e.target.value) || 0)}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>7'056 CHF/an = 588 CHF/mois</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="epargne_libre">Épargne libre</Label>
              <Input
                id="epargne_libre"
                type="number"
                step="0.01"
                placeholder="300.00"
                value={formData.epargne_epargne_libre || ''}
                onChange={(e) => handleChange('epargne_epargne_libre', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placements_budget">Placements (actions, fonds, etc.)</Label>
              <Input
                id="placements_budget"
                type="number"
                step="0.01"
                placeholder="200.00"
                value={formData.epargne_placements || ''}
                onChange={(e) => handleChange('epargne_placements', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remboursement_dettes">Remboursement de dettes</Label>
              <Input
                id="remboursement_dettes"
                type="number"
                step="0.01"
                placeholder="100.00"
                value={formData.epargne_remboursement_dettes || ''}
                onChange={(e) => handleChange('epargne_remboursement_dettes', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé Budget */}
      <Card className="border-2 ${isDarkMode ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-700' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'}`">
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 Résumé de Votre Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="font-medium">Revenus mensuels</span>
              <span className="text-xl font-bold text-green-600">
                {(formData.revenus_mensuels_nets_total || 0).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span className="font-medium">Dépenses mensuelles</span>
              <span className="text-xl font-bold text-orange-600">
                {(formData.depenses_mensuelles_total || 0).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-700' : 'bg-gradient-to-r from-yellow-100 to-orange-100'} rounded-lg border-2 border-yellow-300`}>
              <span className="text-lg font-medium flex items-center gap-2">
                {(formData.solde_mensuel || 0) >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                Solde mensuel
              </span>
              <span className={`text-3xl font-bold ${(formData.solde_mensuel || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(formData.solde_mensuel || 0).toLocaleString('fr-CH', { minimumFractionDigits: 2, signDisplay: 'always' })} CHF
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
              <span>Taux d'épargne</span>
              <span className={`font-bold ${(formData.taux_epargne || 0) >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                {(formData.taux_epargne || 0).toFixed(1)}%
              </span>
            </div>

            {(formData.solde_mensuel || 0) < 0 && (
              <div className={`p-4 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} border-2 border-red-200 rounded-lg`}>
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ Attention: Vos dépenses dépassent vos revenus de{' '}
                  <span className="font-bold">
                    {Math.abs(formData.solde_mensuel || 0).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF/mois
                  </span>
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
