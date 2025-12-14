'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  Wallet,
  Shield,
  Calendar,
  TrendingUp,
  Home,
  Calculator,
  DollarSign,
  Scale,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle
} from 'lucide-react';
import { IndicateurSante, MaisonDesFinancesData } from '@/lib/types/maison-finances';

interface MaisonDesFinancesProps {
  data?: MaisonDesFinancesData;
  onSectionClick?: (section: string) => void;
}

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const sections: Record<string, Section> = {
  // Toiture
  fiscalite: { id: 'fiscalite', label: 'Fiscalité', icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  juridique: { id: 'juridique', label: 'Juridique', icon: <Scale className="w-5 h-5" />, color: 'text-slate-600', bgColor: 'bg-slate-100' },

  // Combles
  immobilier: { id: 'immobilier', label: 'Immobilier', icon: <Home className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  budget: { id: 'budget', label: 'Budget', icon: <Calculator className="w-5 h-5" />, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },

  // Étage 1
  vieillesse: { id: 'vieillesse', label: 'Vieillesse', icon: <Calendar className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  fortune: { id: 'fortune', label: 'Fortune', icon: <TrendingUp className="w-5 h-5" />, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },

  // Étage 0
  sante: { id: 'sante', label: 'Santé', icon: <Heart className="w-5 h-5" />, color: 'text-red-600', bgColor: 'bg-red-100' },
  revenu: { id: 'revenu', label: 'Revenu', icon: <Wallet className="w-5 h-5" />, color: 'text-green-600', bgColor: 'bg-green-100' },
  biens: { id: 'biens', label: 'Biens', icon: <Shield className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
};

export default function MaisonDesFinances({ data, onSectionClick }: MaisonDesFinancesProps) {
  const scoreGlobal = data?.score_global ?? 0;

  const getSectionStatus = (sectionId: string): 'non_commence' | 'en_cours' | 'termine' => {
    if (!data?.completion_status) return 'non_commence';
    return data.completion_status[sectionId as keyof typeof data.completion_status] || 'non_commence';
  };

  const getSectionScore = (sectionId: string): number => {
    if (!data) return 0;
    const sectionData = data[sectionId as keyof MaisonDesFinancesData];
    if (typeof sectionData === 'object' && sectionData !== null) {
      const scoreKey = `${sectionId}_score`;
      return (sectionData as any)[scoreKey] || 0;
    }
    return 0;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 86) return 'text-green-600 bg-green-100 border-green-300';
    if (score >= 66) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (score >= 41) return 'text-orange-600 bg-orange-100 border-orange-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'termine':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'en_cours':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  const SectionBox = ({ sectionId }: { sectionId: string }) => {
    const section = sections[sectionId];
    const status = getSectionStatus(sectionId);
    const score = getSectionScore(sectionId);

    return (
      <div
        onClick={() => onSectionClick?.(sectionId)}
        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${section.bgColor} border-gray-300 hover:border-blue-500`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`${section.color} flex items-center gap-2`}>
            {section.icon}
            <span className="font-medium text-sm">{section.label}</span>
          </div>
          <StatusIcon status={status} />
        </div>

        {status === 'termine' ? (
          <div className={`text-center p-2 rounded border-2 ${getScoreColor(score)}`}>
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-xs">/ 100</div>
          </div>
        ) : (
          <div className="text-center p-2 rounded bg-gray-100 border-2 border-gray-300">
            <div className="text-xs text-gray-500">
              {status === 'en_cours' ? 'En cours' : 'À compléter'}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Score Global */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">🏠 Ma Maison des Finances</CardTitle>
              <CardDescription className="text-base mt-2">
                Visualisez votre santé financière globale
              </CardDescription>
            </div>
            <div className="flex flex-col items-center">
              <div className={`text-5xl font-bold rounded-full w-24 h-24 flex items-center justify-center border-4 ${getScoreColor(scoreGlobal)}`}>
                {scoreGlobal}
              </div>
              <Badge className="mt-2" variant={scoreGlobal >= 66 ? 'default' : 'destructive'}>
                {scoreGlobal >= 86 ? 'Excellent' : scoreGlobal >= 66 ? 'Bon' : scoreGlobal >= 41 ? 'Attention' : 'Critique'}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Visualisation en forme de MAISON */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>🏛️ Architecture de Votre Patrimoine</CardTitle>
          <CardDescription>Cliquez sur chaque section pour la compléter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-4xl mx-auto">
            {/* TOITURE (Triangle) */}
            <div className="relative">
              {/* Toit visuel en SVG */}
              <svg className="w-full h-32 mb-2" viewBox="0 0 400 100" preserveAspectRatio="none">
                <polygon
                  points="200,10 380,90 20,90"
                  fill="#f0f9ff"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                <text x="200" y="55" textAnchor="middle" className="text-sm font-semibold fill-blue-700">
                  TOITURE (Optimisation)
                </text>
              </svg>

              {/* Sections du toit */}
              <div className="grid grid-cols-2 gap-3 mb-4 px-12">
                <SectionBox sectionId="fiscalite" />
                <SectionBox sectionId="juridique" />
              </div>
            </div>

            {/* COMBLES (Trapèze) */}
            <div className="relative bg-gradient-to-b from-orange-50 to-orange-100 border-4 border-orange-300 rounded-t-lg p-4 mb-2">
              <div className="text-center font-bold text-orange-700 mb-3">
                🏚️ COMBLES (Développement)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SectionBox sectionId="immobilier" />
                <SectionBox sectionId="budget" />
              </div>
            </div>

            {/* ÉTAGE 1 (Rectangle) */}
            <div className="relative bg-gradient-to-b from-purple-50 to-purple-100 border-4 border-purple-300 p-4 mb-2">
              <div className="text-center font-bold text-purple-700 mb-3">
                🏢 ÉTAGE 1 (Planification)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SectionBox sectionId="vieillesse" />
                <SectionBox sectionId="fortune" />
              </div>
            </div>

            {/* ÉTAGE 0 / FONDATIONS (Rectangle large) */}
            <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 border-4 border-blue-400 rounded-b-lg p-4">
              <div className="text-center font-bold text-blue-700 mb-3">
                🏗️ ÉTAGE 0 (Sécurité - Fondations)
              </div>
              <div className="grid grid-cols-3 gap-3">
                <SectionBox sectionId="sante" />
                <SectionBox sectionId="revenu" />
                <SectionBox sectionId="biens" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs détaillés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Indicateurs de Santé par Thème
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(sections).map((section) => {
              const score = getSectionScore(section.id);
              const status = getSectionStatus(section.id);

              return (
                <div
                  key={section.id}
                  className={`p-4 rounded-lg border-2 ${section.bgColor} hover:shadow-md transition-all cursor-pointer`}
                  onClick={() => onSectionClick?.(section.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${section.color} flex items-center gap-2`}>
                      {section.icon}
                      <span className="font-medium">{section.label}</span>
                    </div>
                    <StatusIcon status={status} />
                  </div>

                  {status === 'termine' ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold">{score}</span>
                        <span className="text-sm text-gray-600">/ 100</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </>
                  ) : (
                    <Badge variant="outline" className="w-full justify-center">
                      {status === 'en_cours' ? 'En cours' : 'À compléter'}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions prioritaires */}
      {data && scoreGlobal > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Actions Prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.values(sections)
                .filter(s => getSectionScore(s.id) < 66 && getSectionStatus(s.id) === 'termine')
                .sort((a, b) => getSectionScore(a.id) - getSectionScore(b.id))
                .slice(0, 3)
                .map((section) => (
                  <div
                    key={section.id}
                    className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => onSectionClick?.(section.id)}
                  >
                    <div className={section.color}>{section.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium">{section.label}</div>
                      <div className="text-sm text-gray-600">
                        Score actuel: {getSectionScore(section.id)} - Nécessite une attention
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}

              {Object.values(sections).filter(s => getSectionStatus(s.id) !== 'termine').length > 0 && (
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600 mb-2">
                    Sections non complétées: {Object.values(sections).filter(s => getSectionStatus(s.id) !== 'termine').length}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => {
                    const firstIncomplete = Object.values(sections).find(s => getSectionStatus(s.id) !== 'termine');
                    if (firstIncomplete) onSectionClick?.(firstIncomplete.id);
                  }}>
                    Compléter les informations manquantes
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
