'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FinancialGoal } from '@/types/user';
import { Target } from 'lucide-react';

interface GoalCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: Partial<FinancialGoal>) => void;
}

export default function GoalCreationWizard({ 
  isOpen, 
  onClose, 
  onCreateGoal 
}: GoalCreationWizardProps) {
  const [goalData, setGoalData] = useState<Partial<FinancialGoal>>({
    type: 'epargne',
    priorite: 'moyenne',
    status: 'actif',
    montantActuel: 0,
    rappelsActifs: true,
    frequenceRappel: 'mensuel',
    progressionPourcentage: 0
  });

  const handleSubmit = () => {
    if (!goalData.titre || !goalData.montantCible || !goalData.dateEcheance) {
      return;
    }

    const newGoal: Partial<FinancialGoal> = {
      ...goalData,
      dateEcheance: new Date(goalData.dateEcheance as any),
      createdAt: new Date(),
      updatedAt: new Date(),
      progressionPourcentage: goalData.montantCible ? Math.round((goalData.montantActuel || 0) / goalData.montantCible * 100) : 0
    };
    
    onCreateGoal(newGoal);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setGoalData({
      type: 'epargne',
      priorite: 'moyenne',
      status: 'actif',
      montantActuel: 0,
      rappelsActifs: true,
      frequenceRappel: 'mensuel',
      progressionPourcentage: 0
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Créer un nouvel objectif financier
          </DialogTitle>
          <DialogDescription>
            Définissez votre objectif financier
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="titre">Nom de l\'objectif</Label>
            <Input
              id="titre"
              placeholder="Ex: Fonds d\'urgence, Achat appartement..."
              value={goalData.titre || ''}
              onChange={(e) => setGoalData({ ...goalData, titre: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre objectif..."
              value={goalData.description || ''}
              onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="type">Type d\'objectif</Label>
            <Select 
              value={goalData.type} 
              onValueChange={(value: FinancialGoal['type']) => setGoalData({ ...goalData, type: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="epargne">Épargne</SelectItem>
                <SelectItem value="immobilier">Immobilier</SelectItem>
                <SelectItem value="retraite">Retraite</SelectItem>
                <SelectItem value="education">Éducation</SelectItem>
                <SelectItem value="voyage">Voyage</SelectItem>
                <SelectItem value="investissement">Investissement</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="montantCible">Montant cible (CHF)</Label>
              <Input
                id="montantCible"
                type="number"
                placeholder="0"
                value={goalData.montantCible || ''}
                onChange={(e) => setGoalData({ ...goalData, montantCible: Number(e.target.value) })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="montantActuel">Déjà épargné (CHF)</Label>
              <Input
                id="montantActuel"
                type="number"
                placeholder="0"
                value={goalData.montantActuel || ''}
                onChange={(e) => setGoalData({ ...goalData, montantActuel: Number(e.target.value) })}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dateEcheance">Date cible</Label>
            <Input
              id="dateEcheance"
              type="date"
              value={goalData.dateEcheance ? new Date(goalData.dateEcheance as any).toISOString().split('T')[0] : ''}
              onChange={(e) => setGoalData({ ...goalData, dateEcheance: new Date(e.target.value) })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="priorite">Priorité</Label>
            <Select 
              value={goalData.priorite} 
              onValueChange={(value: FinancialGoal['priorite']) => setGoalData({ ...goalData, priorite: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basse">Basse</SelectItem>
                <SelectItem value="moyenne">Moyenne</SelectItem>
                <SelectItem value="haute">Haute</SelectItem>
                <SelectItem value="critique">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="versementMensuelPlan">Versement mensuel planifié (CHF)</Label>
            <Input
              id="versementMensuelPlan"
              type="number"
              placeholder="0"
              value={goalData.versementMensuelPlan || ''}
              onChange={(e) => setGoalData({ ...goalData, versementMensuelPlan: Number(e.target.value) })}
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!goalData.titre || !goalData.montantCible || !goalData.dateEcheance}
          >
            Créer l'objectif
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}