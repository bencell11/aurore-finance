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
import { Home, TrendingUp, Plus, Trash2, AlertCircle, CheckCircle2, Calculator } from 'lucide-react';
import { ImmobilierData } from '@/lib/types/maison-finances';

interface ImmobilierFormProps {
  data?: Partial<ImmobilierData>;
  onSave: (data: Partial<ImmobilierData>) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  isDarkMode?: boolean;
}

export default function ImmobilierForm({ data, onSave, onNext, onPrevious, isDarkMode = false }: ImmobilierFormProps) {
  const [formData, setFormData] = useState<Partial<ImmobilierData>>(data || {});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingHypo, setUploadingHypo] = useState(false);

  const handleChange = (field: keyof ImmobilierData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File) => {
    setUploadingHypo(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockUrl = `https://storage.example.com/hypotheque/${file.name}`;
      handleChange('hypotheque_document_url', mockUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert("Erreur lors de l'upload du fichier");
    } finally {
      setUploadingHypo(false);
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

  // Gestion des autres biens
  const addAutreBien = () => {
    const biens = formData.autres_biens || [];
    biens.push({
      type: 'appartement',
      valeur: 0,
      hypotheque_restante: 0,
      revenus_locatifs_mensuels: 0
    });
    handleChange('autres_biens', biens);
  };

  const removeAutreBien = (index: number) => {
    const biens = formData.autres_biens || [];
    biens.splice(index, 1);
    handleChange('autres_biens', biens);
  };

  const updateAutreBien = (index: number, field: string, value: any) => {
    const biens = [...(formData.autres_biens || [])];
    (biens[index] as any)[field] = value;
    handleChange('autres_biens', biens);
  };

  // Calcul de la capacité d'emprunt (règle des 1/3)
  // On suppose un revenu mensuel de 8000 CHF (à ajuster avec les données du formulaire Revenu)
  const calculateCapaciteEmprunt = (revenuMensuel: number = 8000): number => {
    // Charge hypothécaire maximale = 1/3 du revenu brut
    const chargeMaxMensuelle = revenuMensuel / 3;
    // Taux d'intérêt théorique de 5% (calcul conservateur)
    const tauxCalcul = 5;
    // Amortissement annuel de 1%
    const amortissementAnnuel = 0.01;

    // Capacité d'emprunt = (charge max * 12) / (taux + amortissement)
    const capacite = (chargeMaxMensuelle * 12) / (tauxCalcul / 100 + amortissementAnnuel);
    return Math.floor(capacite / 1000) * 1000; // Arrondi au millier
  };

  // Calcul du taux d'endettement
  const calculateTauxEndettement = (): number => {
    if (!formData.hypotheque_montant_restant) return 0;
    const revenuAnnuel = 8000 * 12; // À ajuster avec vraies données
    const chargesAnnuelles = (formData.hypotheque_montant_restant * 0.05) +
                             (formData.hypotheque_montant_restant * 0.01);
    return (chargesAnnuelles / revenuAnnuel) * 100;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <Card className={`border-l-4 border-l-orange-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Home className="w-6 h-6 text-orange-600" />
            Immobilier - Propriété & Projets
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Situation actuelle et projets d'acquisition immobilière
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Situation actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🏠 Situation Actuelle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="statut_logement">
              Statut actuel <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.statut_logement || 'locataire'}
              onValueChange={(value) => handleChange('statut_logement', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proprietaire">Propriétaire</SelectItem>
                <SelectItem value="locataire">Locataire</SelectItem>
                <SelectItem value="loge_gratuitement">Logé gratuitement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Si locataire */}
          {formData.statut_logement === 'locataire' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4 border-l-2 border-blue-300">
              <div className="space-y-2">
                <Label htmlFor="loyer">Loyer mensuel (CHF)</Label>
                <Input
                  id="loyer"
                  type="number"
                  step="10"
                  placeholder="1800"
                  value={formData.loyer_mensuel || ''}
                  onChange={(e) => handleChange('loyer_mensuel', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="charges">Charges mensuelles (CHF)</Label>
                <Input
                  id="charges"
                  type="number"
                  step="10"
                  placeholder="200"
                  value={formData.charges_mensuelles || ''}
                  onChange={(e) => handleChange('charges_mensuelles', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surface">Surface (m²)</Label>
                <Input
                  id="surface"
                  type="number"
                  placeholder="85"
                  value={formData.surface_m2 || ''}
                  onChange={(e) => handleChange('surface_m2', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="type_logement">Type de logement</Label>
                <Input
                  id="type_logement"
                  placeholder="Ex: Appartement 3.5 pièces"
                  value={formData.type_logement || ''}
                  onChange={(e) => handleChange('type_logement', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Si propriétaire */}
          {formData.statut_logement === 'proprietaire' && (
            <div className="space-y-4 pl-4 border-l-2 border-green-300">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="residence_principale"
                  checked={formData.proprietaire_residence_principale || false}
                  onCheckedChange={(checked) => handleChange('proprietaire_residence_principale', checked)}
                />
                <Label htmlFor="residence_principale" className="cursor-pointer">
                  Il s'agit de ma résidence principale
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valeur_estimee">Valeur estimée (CHF)</Label>
                  <Input
                    id="valeur_estimee"
                    type="number"
                    step="10000"
                    placeholder="750000"
                    value={formData.proprietaire_valeur_estimee || ''}
                    onChange={(e) => handleChange('proprietaire_valeur_estimee', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annee_achat">Année d'achat</Label>
                  <Input
                    id="annee_achat"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="2018"
                    value={formData.proprietaire_annee_achat || ''}
                    onChange={(e) => handleChange('proprietaire_annee_achat', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prix_achat">Prix d'achat (CHF)</Label>
                  <Input
                    id="prix_achat"
                    type="number"
                    step="10000"
                    placeholder="650000"
                    value={formData.proprietaire_prix_achat || ''}
                    onChange={(e) => handleChange('proprietaire_prix_achat', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Plus-value potentielle */}
              {formData.proprietaire_valeur_estimee && formData.proprietaire_prix_achat && (
                <div className={`p-3 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} rounded-lg`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plus-value potentielle:</span>
                    <span className="font-bold text-green-600">
                      {(formData.proprietaire_valeur_estimee - formData.proprietaire_prix_achat).toLocaleString('fr-CH', { signDisplay: 'always' })} CHF
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hypothèque */}
      {formData.statut_logement === 'proprietaire' && (
        <Card>
          <CardHeader>
            <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>💰 Hypothèque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} rounded-lg`}>
              <Checkbox
                id="hypotheque"
                checked={formData.hypotheque_existe || false}
                onCheckedChange={(checked) => handleChange('hypotheque_existe', checked)}
              />
              <Label htmlFor="hypotheque" className="cursor-pointer font-medium">
                J'ai une hypothèque sur ce bien
              </Label>
            </div>

            {formData.hypotheque_existe && (
              <div className="space-y-4 pl-4 border-l-2 border-blue-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hypo_initial">Montant initial (CHF)</Label>
                    <Input
                      id="hypo_initial"
                      type="number"
                      step="1000"
                      placeholder="500000"
                      value={formData.hypotheque_montant_initial || ''}
                      onChange={(e) => handleChange('hypotheque_montant_initial', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hypo_restant">
                      Montant restant dû (CHF) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hypo_restant"
                      type="number"
                      step="1000"
                      placeholder="450000"
                      value={formData.hypotheque_montant_restant || ''}
                      onChange={(e) => handleChange('hypotheque_montant_restant', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hypo_taux">Taux d'intérêt (%)</Label>
                    <Input
                      id="hypo_taux"
                      type="number"
                      step="0.01"
                      placeholder="1.5"
                      value={formData.hypotheque_taux_interet || ''}
                      onChange={(e) => handleChange('hypotheque_taux_interet', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hypo_type">Type d'hypothèque</Label>
                    <Select
                      value={formData.hypotheque_type || 'fixe'}
                      onValueChange={(value) => handleChange('hypotheque_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixe">Taux fixe</SelectItem>
                        <SelectItem value="libor">LIBOR</SelectItem>
                        <SelectItem value="saron">SARON</SelectItem>
                        <SelectItem value="variable">Variable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.hypotheque_type === 'fixe' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="hypo_duree">Durée du taux fixe (années)</Label>
                        <Input
                          id="hypo_duree"
                          type="number"
                          min="1"
                          max="15"
                          placeholder="5"
                          value={formData.hypotheque_duree_fixe || ''}
                          onChange={(e) => handleChange('hypotheque_duree_fixe', parseInt(e.target.value) || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hypo_echeance">Date d'échéance</Label>
                        <Input
                          id="hypo_echeance"
                          type="date"
                          value={formData.hypotheque_echeance_fixe || ''}
                          onChange={(e) => handleChange('hypotheque_echeance_fixe', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="amortissement">Amortissement annuel (CHF)</Label>
                    <Input
                      id="amortissement"
                      type="number"
                      step="1000"
                      placeholder="5000"
                      value={formData.hypotheque_amortissement_annuel || ''}
                      onChange={(e) => handleChange('hypotheque_amortissement_annuel', parseFloat(e.target.value) || 0)}
                    />
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Montant remboursé chaque année (obligatoire: 1% par an jusqu'à 2/3 de la valeur)</p>
                  </div>
                </div>

                {/* Résumé hypothèque */}
                <div className={`p-4 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} rounded-lg space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Charges annuelles (intérêts + amortissement):</span>
                    <span className="font-bold text-blue-600">
                      {(
                        ((formData.hypotheque_montant_restant || 0) * (formData.hypotheque_taux_interet || 0) / 100) +
                        (formData.hypotheque_amortissement_annuel || 0)
                      ).toLocaleString('fr-CH', { minimumFractionDigits: 2 })} CHF
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taux d'endettement:</span>
                    <span className={`font-bold ${calculateTauxEndettement() > 33 ? 'text-red-600' : 'text-green-600'}`}>
                      {calculateTauxEndettement().toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Upload contrat */}
                <div className="space-y-2">
                  <Label>Contrat d'hypothèque (optionnel)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      disabled={uploadingHypo}
                      className="flex-1"
                    />
                    {uploadingHypo && <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload...</div>}
                    {formData.hypotheque_document_url && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Autres biens immobiliers */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🏘️ Autres Biens Immobiliers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-lg`}>
            <Checkbox
              id="autres_biens"
              checked={formData.autres_biens_existe || false}
              onCheckedChange={(checked) => {
                handleChange('autres_biens_existe', checked);
                if (checked && !formData.autres_biens) {
                  handleChange('autres_biens', []);
                }
              }}
            />
            <Label htmlFor="autres_biens" className="cursor-pointer font-medium">
              Je possède d'autres biens immobiliers
            </Label>
          </div>

          {formData.autres_biens_existe && (
            <div className="space-y-4">
              <Button type="button" size="sm" variant="outline" onClick={addAutreBien}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un bien
              </Button>

              {formData.autres_biens && formData.autres_biens.map((bien, index) => (
                <div key={index} className={`p-4 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Bien {index + 1}</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAutreBien(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={bien.type}
                        onValueChange={(value) => updateAutreBien(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appartement">Appartement</SelectItem>
                          <SelectItem value="maison">Maison</SelectItem>
                          <SelectItem value="terrain">Terrain</SelectItem>
                          <SelectItem value="commercial">Local commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Valeur estimée (CHF)</Label>
                      <Input
                        type="number"
                        step="10000"
                        placeholder="500000"
                        value={bien.valeur}
                        onChange={(e) => updateAutreBien(index, 'valeur', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hypothèque restante (CHF)</Label>
                      <Input
                        type="number"
                        step="1000"
                        placeholder="300000"
                        value={bien.hypotheque_restante}
                        onChange={(e) => updateAutreBien(index, 'hypotheque_restante', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Revenus locatifs mensuels (CHF)</Label>
                      <Input
                        type="number"
                        step="100"
                        placeholder="2000"
                        value={bien.revenus_locatifs_mensuels || 0}
                        onChange={(e) => updateAutreBien(index, 'revenus_locatifs_mensuels', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Équité */}
                  <div className={`p-3 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Équité (valeur - hypothèque):</span>
                      <span className="font-bold text-green-600">
                        {(bien.valeur - bien.hypotheque_restante).toLocaleString('fr-CH')} CHF
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projet d'achat */}
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <TrendingUp className="w-5 h-5" />
            Projet d'Achat Immobilier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} rounded-lg`}>
            <Checkbox
              id="projet_achat"
              checked={formData.projet_achat || false}
              onCheckedChange={(checked) => handleChange('projet_achat', checked)}
            />
            <Label htmlFor="projet_achat" className="cursor-pointer font-medium">
              J'ai un projet d'achat immobilier
            </Label>
          </div>

          {formData.projet_achat && (
            <div className="space-y-4 pl-4 border-l-2 border-green-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projet_budget">Budget total (CHF)</Label>
                  <Input
                    id="projet_budget"
                    type="number"
                    step="10000"
                    placeholder="800000"
                    value={formData.projet_achat_budget || ''}
                    onChange={(e) => handleChange('projet_achat_budget', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projet_fonds">Fonds propres disponibles (CHF)</Label>
                  <Input
                    id="projet_fonds"
                    type="number"
                    step="1000"
                    placeholder="160000"
                    value={formData.projet_achat_fonds_propres_disponibles || ''}
                    onChange={(e) => handleChange('projet_achat_fonds_propres_disponibles', parseFloat(e.target.value) || 0)}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Minimum requis: 20% du prix (dont 10% en fonds propres "durs")</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="projet_delai">Délai du projet</Label>
                  <Select
                    value={formData.projet_achat_delai || '1-3 ans'}
                    onValueChange={(value) => handleChange('projet_achat_delai', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="< 1 an">Moins d'un an</SelectItem>
                      <SelectItem value="1-3 ans">1 à 3 ans</SelectItem>
                      <SelectItem value="3-5 ans">3 à 5 ans</SelectItem>
                      <SelectItem value="> 5 ans">Plus de 5 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Analyse du projet */}
              {formData.projet_achat_budget && formData.projet_achat_fonds_propres_disponibles && (
                <div className={`p-4 ${isDarkMode ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50'} rounded-lg space-y-3`}>
                  <h4 className="font-medium flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Analyse de Votre Projet
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Fonds propres nécessaires (20%):</span>
                      <span className="font-medium">
                        {(formData.projet_achat_budget * 0.2).toLocaleString('fr-CH')} CHF
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Fonds propres disponibles:</span>
                      <span className="font-medium">
                        {formData.projet_achat_fonds_propres_disponibles.toLocaleString('fr-CH')} CHF
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="font-medium">Manque/Excédent:</span>
                      <span className={`font-bold ${
                        formData.projet_achat_fonds_propres_disponibles >= (formData.projet_achat_budget * 0.2)
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {(formData.projet_achat_fonds_propres_disponibles - (formData.projet_achat_budget * 0.2)).toLocaleString('fr-CH', { signDisplay: 'always' })} CHF
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Hypothèque nécessaire (80%):</span>
                      <span className="font-medium">
                        {(formData.projet_achat_budget * 0.8).toLocaleString('fr-CH')} CHF
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Capacité d'emprunt estimée:</span>
                      <span className="font-medium">
                        {calculateCapaciteEmprunt().toLocaleString('fr-CH')} CHF
                      </span>
                    </div>
                  </div>

                  {formData.projet_achat_fonds_propres_disponibles < (formData.projet_achat_budget * 0.2) && (
                    <div className={`p-3 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} border border-red-200 rounded-lg`}>
                      <p className="text-sm text-red-700">
                        ⚠️ Vos fonds propres sont insuffisants. Il vous manque{' '}
                        <span className="font-bold">
                          {((formData.projet_achat_budget * 0.2) - formData.projet_achat_fonds_propres_disponibles).toLocaleString('fr-CH')} CHF
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
