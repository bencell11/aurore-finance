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
import { Shield, Home as HomeIcon, Car, Scale, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BiensData } from '@/lib/types/maison-finances';

interface BiensFormProps {
  data?: Partial<BiensData>;
  onSave: (data: Partial<BiensData>) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  isDarkMode?: boolean;
}

export default function BiensForm({ data, onSave, onNext, onPrevious, isDarkMode = false }: BiensFormProps) {
  const [formData, setFormData] = useState<Partial<BiensData>>(data || { nombre_vehicules: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const handleChange = (field: keyof BiensData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File, docType: string) => {
    setUploadingDoc(docType);

    try {
      // TODO: Implémenter l'upload vers Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUrl = `https://storage.example.com/${docType}/${file.name}`;
      handleChange(`${docType}_document_url` as keyof BiensData, mockUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert("Erreur lors de l'upload du fichier");
    } finally {
      setUploadingDoc(null);
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

  // Gestion des véhicules
  const addVehicule = () => {
    const vehicules = formData.vehicules || [];
    vehicules.push({
      type: 'voiture',
      marque: '',
      valeur_estimee: 0,
      assurance_nom: '',
      assurance_type: 'rc_seule',
      prime_annuelle: 0
    });
    handleChange('vehicules', vehicules);
    handleChange('nombre_vehicules', vehicules.length);
  };

  const removeVehicule = (index: number) => {
    const vehicules = formData.vehicules || [];
    vehicules.splice(index, 1);
    handleChange('vehicules', vehicules);
    handleChange('nombre_vehicules', vehicules.length);
  };

  const updateVehicule = (index: number, field: string, value: any) => {
    const vehicules = [...(formData.vehicules || [])];
    (vehicules[index] as any)[field] = value;
    handleChange('vehicules', vehicules);
  };

  // Gestion des objets de valeur
  const addObjetValeur = () => {
    const objets = formData.objets_valeur_liste || [];
    objets.push({ type: '', valeur: 0, assure: false });
    handleChange('objets_valeur_liste', objets);
  };

  const removeObjetValeur = (index: number) => {
    const objets = formData.objets_valeur_liste || [];
    objets.splice(index, 1);
    handleChange('objets_valeur_liste', objets);
  };

  const updateObjetValeur = (index: number, field: string, value: any) => {
    const objets = [...(formData.objets_valeur_liste || [])];
    (objets[index] as any)[field] = value;
    handleChange('objets_valeur_liste', objets);
  };

  const domainesProtectionJuridique = [
    'Vie privée',
    'Circulation routière',
    'Droit du travail',
    'Droit du logement',
    'Droit des assurances',
    'Droit pénal'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <Card className={`border-l-4 border-l-blue-500 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Shield className="w-6 h-6 text-blue-600" />
            Biens & Couverture - Protection de Vos Actifs
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Assurez-vous que vos biens sont correctement couverts en cas de sinistre
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Responsabilité Civile */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🛡️ Responsabilité Civile (RC) Privée</CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Assurance indispensable couvrant les dommages causés à autrui</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
            <Checkbox
              id="rc_privee"
              checked={formData.rc_privee_existe || false}
              onCheckedChange={(checked) => handleChange('rc_privee_existe', checked)}
            />
            <Label htmlFor="rc_privee" className="cursor-pointer font-medium">
              J'ai une assurance RC privée
            </Label>
          </div>

          {formData.rc_privee_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rc_nom">Nom de l'assurance</Label>
                  <Input
                    id="rc_nom"
                    placeholder="Ex: Mobilière"
                    value={formData.rc_privee_nom || ''}
                    onChange={(e) => handleChange('rc_privee_nom', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rc_montant">Montant de couverture (CHF)</Label>
                  <Input
                    id="rc_montant"
                    type="number"
                    step="1000000"
                    placeholder="5000000"
                    value={formData.rc_privee_montant_couverture || ''}
                    onChange={(e) => handleChange('rc_privee_montant_couverture', parseFloat(e.target.value) || 0)}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recommandé: minimum 5 millions CHF</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rc_prime">Prime annuelle (CHF)</Label>
                  <Input
                    id="rc_prime"
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    value={formData.rc_privee_prime_annuelle || ''}
                    onChange={(e) => handleChange('rc_privee_prime_annuelle', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Police RC (optionnel)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'rc_privee');
                    }}
                    disabled={uploadingDoc === 'rc_privee'}
                    className="flex-1"
                  />
                  {uploadingDoc === 'rc_privee' && <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload...</div>}
                  {formData.rc_privee_document_url && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assurance Ménage */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <HomeIcon className="w-5 h-5" />
            Assurance Ménage (Mobilier)
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Couvre vos biens mobiliers en cas d'incendie, vol, dégâts d'eau, etc.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
            <Checkbox
              id="assurance_menage"
              checked={formData.assurance_menage_existe || false}
              onCheckedChange={(checked) => handleChange('assurance_menage_existe', checked)}
            />
            <Label htmlFor="assurance_menage" className="cursor-pointer font-medium">
              J'ai une assurance ménage
            </Label>
          </div>

          {formData.assurance_menage_existe && (
            <div className="space-y-4 pl-4 border-l-2 border-orange-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="menage_nom">Nom de l'assurance</Label>
                  <Input
                    id="menage_nom"
                    placeholder="Ex: AXA"
                    value={formData.assurance_menage_nom || ''}
                    onChange={(e) => handleChange('assurance_menage_nom', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="menage_somme">Somme assurée (CHF)</Label>
                  <Input
                    id="menage_somme"
                    type="number"
                    step="1000"
                    placeholder="50000"
                    value={formData.assurance_menage_somme_assuree || ''}
                    onChange={(e) => handleChange('assurance_menage_somme_assuree', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="menage_prime">Prime annuelle (CHF)</Label>
                  <Input
                    id="menage_prime"
                    type="number"
                    step="0.01"
                    placeholder="300.00"
                    value={formData.assurance_menage_prime_annuelle || ''}
                    onChange={(e) => handleChange('assurance_menage_prime_annuelle', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Police d'assurance ménage (optionnel)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'assurance_menage');
                    }}
                    disabled={uploadingDoc === 'assurance_menage'}
                    className="flex-1"
                  />
                  {uploadingDoc === 'assurance_menage' && <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload...</div>}
                  {formData.assurance_menage_document_url && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Véhicules */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Car className="w-5 h-5" />
            Véhicules & Assurances
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Nombre de véhicules: {formData.nombre_vehicules || 0}</Label>
            <Button type="button" size="sm" variant="outline" onClick={addVehicule}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </div>

          {formData.vehicules && formData.vehicules.length > 0 && (
            <div className="space-y-4">
              {formData.vehicules.map((vehicule, index) => (
                <div key={index} className={`p-4 border-2 rounded-lg space-y-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Véhicule {index + 1}</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeVehicule(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={vehicule.type}
                        onValueChange={(value) => updateVehicule(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="voiture">Voiture</SelectItem>
                          <SelectItem value="moto">Moto</SelectItem>
                          <SelectItem value="scooter">Scooter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Marque/Modèle</Label>
                      <Input
                        placeholder="Ex: VW Golf"
                        value={vehicule.marque}
                        onChange={(e) => updateVehicule(index, 'marque', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Valeur estimée (CHF)</Label>
                      <Input
                        type="number"
                        step="1000"
                        placeholder="25000"
                        value={vehicule.valeur_estimee}
                        onChange={(e) => updateVehicule(index, 'valeur_estimee', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Assurance</Label>
                      <Input
                        placeholder="Nom de l'assurance"
                        value={vehicule.assurance_nom}
                        onChange={(e) => updateVehicule(index, 'assurance_nom', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Type de couverture</Label>
                      <Select
                        value={vehicule.assurance_type}
                        onValueChange={(value) => updateVehicule(index, 'assurance_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rc_seule">RC seule (minimum légal)</SelectItem>
                          <SelectItem value="semi_casco">Semi-casco (vol, incendie, etc.)</SelectItem>
                          <SelectItem value="casco_complete">Casco complète (tous dommages)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Prime annuelle (CHF)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="800.00"
                        value={vehicule.prime_annuelle}
                        onChange={(e) => updateVehicule(index, 'prime_annuelle', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Protection Juridique */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Scale className="w-5 h-5" />
            Protection Juridique
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Couvre les frais juridiques en cas de litige</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
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
            <div className="space-y-4 pl-4 border-l-2 border-purple-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de l'assurance</Label>
                  <Input
                    placeholder="Ex: SWICA Protection juridique"
                    value={formData.protection_juridique_nom || ''}
                    onChange={(e) => handleChange('protection_juridique_nom', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prime annuelle (CHF)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="250.00"
                    value={formData.protection_juridique_prime_annuelle || ''}
                    onChange={(e) => handleChange('protection_juridique_prime_annuelle', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Domaines couverts</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {domainesProtectionJuridique.map((domaine) => (
                    <div key={domaine} className="flex items-center space-x-2">
                      <Checkbox
                        id={`domaine_${domaine}`}
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
                      <Label htmlFor={`domaine_${domaine}`} className="text-sm cursor-pointer">
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

      {/* Objets de valeur */}
      <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>💎 Objets de Valeur</CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Bijoux, œuvres d'art, collections, etc.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
            <Checkbox
              id="objets_valeur"
              checked={formData.objets_valeur_existent || false}
              onCheckedChange={(checked) => {
                handleChange('objets_valeur_existent', checked);
                if (checked && !formData.objets_valeur_liste) {
                  handleChange('objets_valeur_liste', []);
                }
              }}
            />
            <Label htmlFor="objets_valeur" className="cursor-pointer font-medium">
              Je possède des objets de valeur importants
            </Label>
          </div>

          {formData.objets_valeur_existent && (
            <div className="space-y-4">
              <Button type="button" size="sm" variant="outline" onClick={addObjetValeur}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un objet
              </Button>

              {formData.objets_valeur_liste && formData.objets_valeur_liste.map((objet, index) => (
                <div key={index} className={`p-4 border-2 rounded-lg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Objet {index + 1}</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeObjetValeur(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Type d'objet</Label>
                      <Input
                        placeholder="Ex: Montre Rolex"
                        value={objet.type}
                        onChange={(e) => updateObjetValeur(index, 'type', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Valeur estimée (CHF)</Label>
                      <Input
                        type="number"
                        step="100"
                        placeholder="10000"
                        value={objet.valeur}
                        onChange={(e) => updateObjetValeur(index, 'valeur', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox
                        id={`assure_${index}`}
                        checked={objet.assure}
                        onCheckedChange={(checked) => updateObjetValeur(index, 'assure', checked)}
                      />
                      <Label htmlFor={`assure_${index}`} className="cursor-pointer">
                        Assuré séparément
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <Button type="button" variant="outline" onClick={onPrevious} disabled={isLoading}>
          ← Précédent
        </Button>

        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <AlertCircle className="w-4 h-4 inline mr-2" />
          Toutes les informations sont optionnelles
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
