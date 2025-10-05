'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Target,
  Save,
  X,
  CalendarIcon,
  Info,
  DollarSign,
  PiggyBank,
  AlertCircle
} from 'lucide-react';
import { FinancialGoal, Priority, GoalStatus } from '@/types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface GoalEditFormProps {
  goal: FinancialGoal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedGoal: FinancialGoal) => void;
}

export default function GoalEditForm({
  goal,
  isOpen,
  onClose,
  onSave
}: GoalEditFormProps) {
  const [editedGoal, setEditedGoal] = useState<FinancialGoal>(goal);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedGoal(goal);
    setHasChanges(false);
  }, [goal]);

  const handleFieldChange = (field: keyof FinancialGoal, value: any) => {
    setEditedGoal(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const updatedGoal = {
      ...editedGoal,
      updatedAt: new Date().toISOString(),
      // Recalculer la progression
      progressPercentage: (editedGoal.currentAmount / editedGoal.targetAmount) * 100
    };
    
    onSave(updatedGoal);
    onClose();
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm('Des modifications non sauvegardées seront perdues. Continuer ?');
      if (!confirmCancel) return;
    }
    onClose();
  };

  const calculateMonthlyRequired = () => {
    if (!editedGoal.targetAmount || !editedGoal.deadline) return 0;
    
    const months = Math.max(1, 
      (new Date(editedGoal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    return Math.round((editedGoal.targetAmount - editedGoal.currentAmount) / months);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Modifier l'objectif
          </DialogTitle>
          <DialogDescription>
            Ajustez les paramètres de votre objectif financier
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Informations de base */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Nom de l'objectif</Label>
              <Input
                id="edit-title"
                value={editedGoal.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editedGoal.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="mt-2 h-20"
              />
            </div>
          </div>

          {/* Montants */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-targetAmount">Montant cible (CHF)</Label>
              <div className="relative mt-2">
                <Input
                  id="edit-targetAmount"
                  type="number"
                  value={editedGoal.targetAmount || ''}
                  onChange={(e) => handleFieldChange('targetAmount', Number(e.target.value))}
                  className="pl-10"
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-currentAmount">Montant actuel (CHF)</Label>
              <div className="relative mt-2">
                <Input
                  id="edit-currentAmount"
                  type="number"
                  value={editedGoal.currentAmount || ''}
                  onChange={(e) => handleFieldChange('currentAmount', Number(e.target.value))}
                  className="pl-10"
                />
                <PiggyBank className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Date et priorité */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Date cible</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !editedGoal.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedGoal.deadline ? 
                      format(new Date(editedGoal.deadline), 'PPP', { locale: fr }) : 
                      "Sélectionner une date"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editedGoal.deadline ? new Date(editedGoal.deadline) : undefined}
                    onSelect={(date) => handleFieldChange('deadline', date?.toISOString())}
                    initialFocus
                    locale={fr}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Priorité</Label>
              <Select 
                value={editedGoal.priority} 
                onValueChange={(value: Priority) => handleFieldChange('priority', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basse">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Basse
                    </div>
                  </SelectItem>
                  <SelectItem value="moyenne">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Moyenne
                    </div>
                  </SelectItem>
                  <SelectItem value="haute">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      Haute
                    </div>
                  </SelectItem>
                  <SelectItem value="critique">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Critique
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statut et contribution mensuelle */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Statut</Label>
              <Select 
                value={editedGoal.status} 
                onValueChange={(value: GoalStatus) => handleFieldChange('status', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                  <SelectItem value="atteint">Atteint</SelectItem>
                  <SelectItem value="abandonne">Abandonné</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-monthlyContribution">Contribution mensuelle (CHF)</Label>
              <Input
                id="edit-monthlyContribution"
                type="number"
                value={editedGoal.monthlyContribution || ''}
                onChange={(e) => handleFieldChange('monthlyContribution', Number(e.target.value))}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Requis: {calculateMonthlyRequired()} CHF/mois
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="edit-notifications" className="text-base font-medium">
                Rappels automatiques
              </Label>
              <p className="text-sm text-gray-500">
                Recevoir des notifications pour vos contributions
              </p>
            </div>
            <Switch
              id="edit-notifications"
              checked={editedGoal.notificationEnabled}
              onCheckedChange={(checked) => handleFieldChange('notificationEnabled', checked)}
            />
          </div>

          {editedGoal.notificationEnabled && (
            <div>
              <Label>Fréquence des rappels</Label>
              <Select
                value={editedGoal.notificationFrequency}
                onValueChange={(value) => handleFieldChange('notificationFrequency', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="biweekly">Bimensuel</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Alert de changements */}
          {hasChanges && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Vous avez des modifications non sauvegardées
              </AlertDescription>
            </Alert>
          )}

          {/* Informations de progression */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p>Progression actuelle: <strong>{((editedGoal.currentAmount / editedGoal.targetAmount) * 100).toFixed(1)}%</strong></p>
                <p>Montant restant: <strong>{(editedGoal.targetAmount - editedGoal.currentAmount).toLocaleString()} CHF</strong></p>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Annuler
          </Button>

          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}