'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calculator,
  Lightbulb,
  Sparkles,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';

interface TaxSimulator2025Props {
  autoFill?: boolean;
}

export default function TaxSimulator2025({ autoFill = false }: TaxSimulator2025Props) {
  const [income, setIncome] = useState(80000);
  const [canton, setCanton] = useState('VD');
  const [maritalStatus, setMaritalStatus] = useState('celibataire');
  const [children, setChildren] = useState(0);
  const [thirdPillar, setThirdPillar] = useState(7258); // Max 2025
  const [loading, setLoading] = useState(false);

  // Auto-remplissage depuis le profil utilisateur si activé
  useEffect(() => {
    if (autoFill) {
      loadUserProfile();
    }
  }, [autoFill]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await UserProfileSupabaseService.getProfile();

      if (profile) {
        if (profile.revenu_annuel) setIncome(profile.revenu_annuel);
        if (profile.canton) setCanton(profile.canton);
        if (profile.situation_familiale) setMaritalStatus(profile.situation_familiale);
        if (profile.nombre_enfants) setChildren(profile.nombre_enfants);
        console.log('✅ Simulateur auto-rempli depuis le profil');
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil pour simulateur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Taux par canton mis à jour pour 2025
  const cantonRates: Record<string, { federal: number; cantonal: number; communal: number }> = {
    VD: { federal: 0.11, cantonal: 0.08, communal: 0.045 },
    GE: { federal: 0.11, cantonal: 0.09, communal: 0.05 },
    ZH: { federal: 0.11, cantonal: 0.065, communal: 0.035 },
    BE: { federal: 0.11, cantonal: 0.075, communal: 0.04 },
    FR: { federal: 0.11, cantonal: 0.077, communal: 0.042 },
    VS: { federal: 0.11, cantonal: 0.074, communal: 0.038 },
    NE: { federal: 0.11, cantonal: 0.086, communal: 0.048 },
    JU: { federal: 0.11, cantonal: 0.082, communal: 0.046 },
    TI: { federal: 0.11, cantonal: 0.07, communal: 0.037 },
    AG: { federal: 0.11, cantonal: 0.068, communal: 0.034 },
    ZG: { federal: 0.11, cantonal: 0.045, communal: 0.025 },
    SZ: { federal: 0.11, cantonal: 0.048, communal: 0.027 },
    LU: { federal: 0.11, cantonal: 0.062, communal: 0.032 },
    SG: { federal: 0.11, cantonal: 0.066, communal: 0.035 },
    BL: { federal: 0.11, cantonal: 0.069, communal: 0.036 },
    BS: { federal: 0.11, cantonal: 0.088, communal: 0.048 },
  };

  // Calculs fiscaux 2025
  const deductions = 2000 + (children * 6700) + thirdPillar + (maritalStatus === 'marie' ? 2600 : 0);
  const taxableIncome = Math.max(0, income - deductions);
  const rates = cantonRates[canton] || cantonRates['VD'];

  const federalTax = Math.round(taxableIncome * rates.federal);
  const cantonalTax = Math.round(taxableIncome * rates.cantonal);
  const communalTax = Math.round(taxableIncome * rates.communal);
  const totalTax = federalTax + cantonalTax + communalTax;
  const netIncome = income - totalTax;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <TooltipProvider>
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Simulateur d'Impôts 2025
            {autoFill && <Sparkles className="h-4 w-4 text-green-600" />}
          </CardTitle>
          <CardDescription>
            Calculez vos impôts avec précision selon votre situation
            {autoFill && ' (pré-rempli depuis votre profil)'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Paramètres */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1">
                Revenu annuel brut
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Votre salaire brut annuel total</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="pr-12"
                  disabled={loading}
                />
                <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
              </div>
            </div>

            <div>
              <Label>Canton de résidence</Label>
              <Select value={canton} onValueChange={setCanton} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VD">Vaud</SelectItem>
                  <SelectItem value="GE">Genève</SelectItem>
                  <SelectItem value="ZH">Zurich</SelectItem>
                  <SelectItem value="BE">Berne</SelectItem>
                  <SelectItem value="FR">Fribourg</SelectItem>
                  <SelectItem value="VS">Valais</SelectItem>
                  <SelectItem value="NE">Neuchâtel</SelectItem>
                  <SelectItem value="JU">Jura</SelectItem>
                  <SelectItem value="TI">Tessin</SelectItem>
                  <SelectItem value="ZG">Zoug</SelectItem>
                  <SelectItem value="SZ">Schwyz</SelectItem>
                  <SelectItem value="LU">Lucerne</SelectItem>
                  <SelectItem value="AG">Argovie</SelectItem>
                  <SelectItem value="SG">Saint-Gall</SelectItem>
                  <SelectItem value="BL">Bâle-Campagne</SelectItem>
                  <SelectItem value="BS">Bâle-Ville</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Situation familiale</Label>
              <Select value={maritalStatus} onValueChange={setMaritalStatus} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celibataire">Célibataire</SelectItem>
                  <SelectItem value="marie">Marié(e)</SelectItem>
                  <SelectItem value="divorce">Divorcé(e)</SelectItem>
                  <SelectItem value="veuf">Veuf(ve)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Nombre d'enfants</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                disabled={loading}
              />
            </div>

            <div>
              <Label className="flex items-center gap-1">
                3e pilier (max 7'258 CHF)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Montant maximum déductible en 2025</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="7258"
                  value={thirdPillar}
                  onChange={(e) => setThirdPillar(Number(e.target.value))}
                  className="pr-12"
                  disabled={loading}
                />
                <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">Calcul des impôts 2025</h4>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    <Info className="w-4 h-4 mr-1" />
                    Voir le détail des calculs
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-md p-4">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold">Calcul du revenu imposable:</p>
                    <div className="text-xs space-y-1 pl-2 border-l-2 border-blue-200">
                      <p>1. Revenu brut: {formatCurrency(income)}</p>
                      <p>2. Déductions:</p>
                      <p className="pl-3">- Déduction de base: CHF 2'000</p>
                      {maritalStatus === 'marie' && <p className="pl-3">- Couple marié: CHF 2'600</p>}
                      {children > 0 && <p className="pl-3">- Enfants ({children}×): {formatCurrency(children * 6700)}</p>}
                      {thirdPillar > 0 && <p className="pl-3">- 3e pilier: {formatCurrency(thirdPillar)}</p>}
                      <p className="font-semibold border-t pt-1 mt-1">Total déductions: {formatCurrency(deductions)}</p>
                      <p className="font-semibold">Revenu imposable: {formatCurrency(taxableIncome)}</p>
                    </div>
                    <p className="text-xs font-semibold mt-3">Application des taux ({canton}):</p>
                    <div className="text-xs space-y-1 pl-2 border-l-2 border-green-200">
                      <p>• Fédéral {(rates.federal * 100).toFixed(1)}%: {formatCurrency(federalTax)}</p>
                      <p>• Cantonal {(rates.cantonal * 100).toFixed(1)}%: {formatCurrency(cantonalTax)}</p>
                      <p>• Communal {(rates.communal * 100).toFixed(1)}%: {formatCurrency(communalTax)}</p>
                      <p className="font-semibold border-t pt-1 mt-1">Total: {formatCurrency(totalTax)}</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-lg font-bold text-red-600">{formatCurrency(federalTax)}</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  Impôt fédéral
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="focus:outline-none">
                        <Info className="w-3 h-3 text-gray-400 hover:text-blue-600 transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="top">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-blue-600">💰 Impôt Fédéral Direct (IFD)</p>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Taux appliqué:</p>
                          <p className="text-xs text-gray-700 mb-2">
                            {(rates.federal * 100).toFixed(1)}% - Taux progressif fédéral Suisse 2025
                            (barème simplifié pour revenu {formatCurrency(taxableIncome)})
                          </p>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Calcul:</p>
                          <p className="text-xs text-gray-700">Revenu imposable × Taux fédéral</p>
                          <p className="text-xs text-gray-700">= {formatCurrency(taxableIncome)} × {(rates.federal * 100).toFixed(1)}%</p>
                          <p className="text-xs font-bold text-red-600 mt-1">= {formatCurrency(federalTax)}</p>
                        </div>
                        <div className="bg-blue-50 rounded p-2 mt-2">
                          <p className="text-xs text-blue-700">
                            ℹ️ Le taux fédéral est identique dans toute la Suisse et varie selon le revenu (barème progressif)
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-lg font-bold text-orange-600">{formatCurrency(cantonalTax)}</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  Impôt cantonal
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="focus:outline-none">
                        <Info className="w-3 h-3 text-gray-400 hover:text-orange-600 transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="top">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-orange-600">🏛️ Impôt Cantonal ({canton})</p>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Taux appliqué:</p>
                          <p className="text-xs text-gray-700 mb-2">
                            {(rates.cantonal * 100).toFixed(1)}% - Taux du canton {canton} (2025)
                          </p>
                          <p className="text-xs text-gray-600">
                            Chaque canton fixe son propre taux d'imposition.
                            {canton === 'ZG' && ' Zoug a le taux le plus bas de Suisse!'}
                            {canton === 'GE' && ' Genève a un taux élevé en raison de services publics étendus.'}
                            {canton === 'VD' && ' Vaud applique un taux moyen-élevé.'}
                          </p>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Calcul:</p>
                          <p className="text-xs text-gray-700">Revenu imposable × Taux cantonal</p>
                          <p className="text-xs text-gray-700">= {formatCurrency(taxableIncome)} × {(rates.cantonal * 100).toFixed(1)}%</p>
                          <p className="text-xs font-bold text-orange-600 mt-1">= {formatCurrency(cantonalTax)}</p>
                        </div>
                        <div className="bg-orange-50 rounded p-2 mt-2">
                          <p className="text-xs text-orange-700">
                            💡 Le taux varie de 4.5% (ZG) à 9.0% (GE) selon les cantons
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-lg font-bold text-purple-600">{formatCurrency(communalTax)}</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  Impôt communal
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="focus:outline-none">
                        <Info className="w-3 h-3 text-gray-400 hover:text-purple-600 transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="top">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-purple-600">🏘️ Impôt Communal</p>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Taux appliqué:</p>
                          <p className="text-xs text-gray-700 mb-2">
                            {(rates.communal * 100).toFixed(1)}% - Moyenne des communes du canton {canton}
                          </p>
                          <p className="text-xs text-gray-600">
                            L'impôt communal varie selon votre commune de résidence.
                            Ce taux est une moyenne cantonale (certaines communes peuvent être plus/moins chères).
                          </p>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Calcul:</p>
                          <p className="text-xs text-gray-700">Revenu imposable × Taux communal</p>
                          <p className="text-xs text-gray-700">= {formatCurrency(taxableIncome)} × {(rates.communal * 100).toFixed(1)}%</p>
                          <p className="text-xs font-bold text-purple-600 mt-1">= {formatCurrency(communalTax)}</p>
                        </div>
                        <div className="bg-purple-50 rounded p-2 mt-2">
                          <p className="text-xs text-purple-700">
                            📍 Le taux réel dépend de votre commune spécifique (peut varier de ±1-2%)
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                <div className="text-lg font-bold text-blue-600">{formatCurrency(totalTax)}</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  Total impôts
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="focus:outline-none">
                        <Info className="w-3 h-3 text-gray-400 hover:text-blue-600 transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="top">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-blue-600">💳 Total Impôts 2025</p>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Composition:</p>
                          <p className="text-xs text-gray-700">Somme des 3 niveaux d'imposition suisses</p>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Calcul:</p>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-700">Impôt fédéral: {formatCurrency(federalTax)}</p>
                            <p className="text-xs text-gray-700">+ Impôt cantonal: {formatCurrency(cantonalTax)}</p>
                            <p className="text-xs text-gray-700">+ Impôt communal: {formatCurrency(communalTax)}</p>
                            <div className="border-t border-blue-200 mt-1 pt-1">
                              <p className="text-xs font-bold text-blue-600">= Total: {formatCurrency(totalTax)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded p-2 mt-2">
                          <p className="text-xs text-blue-700">
                            🇨🇭 Système fiscal suisse à 3 niveaux (Confédération, Canton, Commune)
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{formatCurrency(netIncome)}</div>
                <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                  Revenu net après impôts
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="focus:outline-none">
                        <Info className="w-3 h-3 text-gray-400 hover:text-green-600 transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="top">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-green-600">💰 Revenu Net Disponible</p>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Ce qui vous reste:</p>
                          <p className="text-xs text-gray-700 mb-2">
                            Votre revenu après déduction de tous les impôts (fédéral, cantonal, communal)
                          </p>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Calcul:</p>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-700">Revenu brut annuel: {formatCurrency(income)}</p>
                            <p className="text-xs text-gray-700">- Total impôts: {formatCurrency(totalTax)}</p>
                            <div className="border-t border-green-200 mt-1 pt-1">
                              <p className="text-xs font-bold text-green-600">= Revenu net: {formatCurrency(netIncome)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded p-2 mt-2">
                          <p className="text-xs text-green-700">
                            ✅ C'est votre pouvoir d'achat réel après impôts (sans AVS/LPP/assurances)
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{effectiveRate.toFixed(1)}%</div>
                <div className="text-sm text-blue-600 flex items-center justify-center gap-1">
                  Taux d'imposition effectif
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="focus:outline-none">
                        <Info className="w-3 h-3 text-gray-400 hover:text-blue-600 transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="top">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-blue-600">📊 Taux d'Imposition Effectif</p>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Définition:</p>
                          <p className="text-xs text-gray-700 mb-2">
                            Pourcentage réel de votre revenu brut qui part en impôts (tous niveaux confondus)
                          </p>
                          <p className="text-xs text-gray-600">
                            Différent du taux marginal car il inclut les déductions et le barème progressif.
                          </p>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <p className="text-xs font-semibold mb-1">Calcul:</p>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-700">(Total impôts ÷ Revenu brut) × 100</p>
                            <p className="text-xs text-gray-700">= ({formatCurrency(totalTax)} ÷ {formatCurrency(income)}) × 100</p>
                            <div className="border-t border-blue-200 mt-1 pt-1">
                              <p className="text-xs font-bold text-blue-600">= {effectiveRate.toFixed(1)}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded p-2 mt-2">
                          <p className="text-xs text-blue-700">
                            📈 Indicateur clé pour comparer différents scénarios fiscaux
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center pt-2">
              <Info className="w-3 h-3 inline mr-1" />
              Calcul simplifié basé sur les barèmes 2025. Pour un calcul précis, consultez l'assistant fiscal.
            </div>
          </div>

          {/* Optimisations suggérées */}
          {(thirdPillar < 7258 || canton === 'GE' || canton === 'BS' || canton === 'NE') && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h5 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800">
                <Lightbulb className="h-4 w-4" />
                Optimisations suggérées
              </h5>
              <ul className="space-y-1 text-sm text-yellow-700">
                {thirdPillar < 7258 && (
                  <li>• Maximisez votre 3e pilier pour économiser {formatCurrency((7258 - thirdPillar) * 0.25)}</li>
                )}
                <li>• Vérifiez vos frais professionnels (transport, repas, formation)</li>
                <li>• Considérez un rachat LPP si possible</li>
                {(canton === 'GE' || canton === 'BS' || canton === 'NE') && (
                  <li>• Votre canton a une fiscalité élevée - consultez notre comparateur cantonal</li>
                )}
              </ul>
            </div>
          )}

          {autoFill && (
            <Button
              onClick={loadUserProfile}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? 'Chargement...' : 'Recharger depuis le profil'}
            </Button>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
