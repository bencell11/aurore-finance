'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ icon: Icon, label, value, color, delay = 0, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-md hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2.5 rounded-lg"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-300">{label}</p>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              {trend && (
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-medium ${
                      trend.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-slate-400">vs mois dernier</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface MiniStatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export function MiniStatCard({ label, value, icon, color }: MiniStatCardProps) {
  return (
    <div
      className="p-4 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="text-lg font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
