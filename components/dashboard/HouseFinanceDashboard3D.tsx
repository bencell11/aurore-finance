'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Wallet,
  Heart,
  Calendar,
  TrendingUp,
  Home,
  Calculator,
  DollarSign,
  Scale,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Bell,
  X,
  Info,
  AlertCircle,
  LucideIcon
} from 'lucide-react';
import { MaisonDesFinancesData } from '@/lib/types/maison-finances';

// Types
interface Notification {
  id: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  title: string;
  message: string;
  time: string;
}

interface ZoneData {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  status: 'optimal' | 'attention' | 'action';
  metrics: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
  lastUpdate: string;
  notifications: Notification[];
  score: number;
}

interface ZoneProps {
  data: ZoneData;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  color: string;
  className?: string;
  isDarkMode?: boolean;
}

interface ScoreCircleProps {
  value: number;
  label: string;
  color: string;
  delay?: number;
  isActive: boolean;
  onHover: (active: boolean) => void;
  isDarkMode?: boolean;
}

interface HouseFinanceDashboard3DProps {
  data?: MaisonDesFinancesData;
  onSectionClick?: (section: string) => void;
  isDarkMode?: boolean;
}

// Notification Panel Component
function NotificationPanel({
  notifications,
  color,
  onClose,
  isDarkMode = false
}: {
  notifications: Notification[];
  color: string;
  onClose: () => void;
  isDarkMode?: boolean;
}) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      case 'alert': return AlertCircle;
      case 'success': return CheckCircle2;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'alert': return '#ef4444';
      case 'success': return '#22c55e';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute top-full left-0 right-0 mt-2 z-50"
    >
      <div
        className={`rounded-xl overflow-hidden backdrop-blur-xl ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#14141e]/98 to-[#0a0a14]/99 border border-white/10'
            : 'bg-gradient-to-br from-white/98 to-gray-50/99 border border-gray-200'
        }`}
        style={{
          boxShadow: isDarkMode
            ? `0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${color}15`
            : `0 10px 40px rgba(0,0,0,0.15), 0 0 20px ${color}10`
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-3 py-2 border-b ${
            isDarkMode ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" style={{ color }} />
            <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Notifications ({notifications.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-3.5 h-3.5 ${isDarkMode ? 'text-neutral-400' : 'text-gray-500'}`} />
          </button>
        </div>

        {/* Notifications list */}
        <div className="max-h-48 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                Aucune notification
              </p>
            </div>
          ) : (
            notifications.map((notif, index) => {
              const Icon = getNotificationIcon(notif.type);
              const notifColor = getNotificationColor(notif.type);
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`px-3 py-2.5 border-b last:border-0 transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'border-white/5 hover:bg-white/5'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex gap-2.5">
                    <div
                      className="p-1.5 rounded-lg shrink-0"
                      style={{ backgroundColor: `${notifColor}20` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: notifColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {notif.title}
                      </p>
                      <p className={`text-[10px] line-clamp-2 ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                        {notif.message}
                      </p>
                      <span className={`text-[9px] mt-1 block ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>
                        {notif.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Status badge component
function StatusBadge({ status, isDarkMode = false }: { status: ZoneData['status']; isDarkMode?: boolean }) {
  const config = {
    optimal: { color: '#22c55e', label: 'Optimal', icon: CheckCircle2, bg: 'bg-green-500/20' },
    attention: { color: '#f59e0b', label: 'Attention', icon: AlertTriangle, bg: 'bg-amber-500/20' },
    action: { color: '#ef4444', label: 'Action', icon: AlertCircle, bg: 'bg-red-500/20' },
  };

  const { color, label, icon: Icon, bg } = config[status];

  return (
    <motion.div
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${bg}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div
        animate={{
          boxShadow: status !== 'optimal' ? [
            `0 0 0 0 ${color}40`,
            `0 0 0 3px ${color}00`,
          ] : 'none',
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
        }}
        className="rounded-full"
      >
        <Icon className="w-2.5 h-2.5" style={{ color }} />
      </motion.div>
      <span className="text-[9px] font-medium" style={{ color }}>{label}</span>
    </motion.div>
  );
}

// Enhanced zone card with notifications
function ZoneCard({ data, isSelected, isHighlighted, onClick, color, className = '', isDarkMode = false }: ZoneProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const Icon = data.icon;
  const showEffects = isHovered || isHighlighted || isSelected;
  const hasNotifications = data.notifications.length > 0;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowNotifications(false);
      }}
      className={`relative cursor-pointer ${className}`}
      animate={{
        scale: showEffects ? 1.02 : 1,
        zIndex: showEffects || showNotifications ? 30 : 1,
      }}
    >
      {/* Main card */}
      <motion.div
        onClick={onClick}
        className={`relative h-full rounded-2xl overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#191923]/95 to-[#0f0f19]/98'
            : 'bg-gradient-to-br from-white/95 to-gray-50/98'
        }`}
        animate={{
          boxShadow: showEffects
            ? isDarkMode
              ? `0 0 30px ${color}20, 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
              : `0 0 30px ${color}15, 0 10px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)`
            : isDarkMode
              ? `0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
              : `0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)`,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient border effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${color}${showEffects ? '50' : '25'} 0%, transparent 40%, transparent 60%, ${color}${showEffects ? '30' : '15'} 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative h-full p-3 md:p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <motion.div
                className="p-2 rounded-xl shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`,
                }}
                animate={{
                  boxShadow: showEffects ? `0 0 15px ${color}30` : 'none',
                }}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
              </motion.div>
              <div className="min-w-0">
                <h4 className={`text-sm md:text-base font-bold truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {data.label}
                </h4>
                <p className={`text-[10px] truncate hidden md:block ${
                  isDarkMode ? 'text-neutral-500' : 'text-gray-500'
                }`}>
                  {data.description}
                </p>
              </div>
            </div>
            <StatusBadge status={data.status} isDarkMode={isDarkMode} />
          </div>

          {/* Metrics */}
          <div className="flex-1 space-y-1.5">
            {data.metrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className={`text-[10px] ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                  {metric.label}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </span>
                  {metric.trend && (
                    <>
                      {metric.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-green-400" />}
                      {metric.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-400" />}
                      {metric.trend === 'stable' && <div className="w-2.5 h-0.5 bg-neutral-500 rounded" />}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between mt-3 pt-2 border-t ${
            isDarkMode ? 'border-white/5' : 'border-gray-200'
          }`}>
            <div className={`flex items-center gap-1.5 text-[9px] ${
              isDarkMode ? 'text-neutral-500' : 'text-gray-500'
            }`}>
              <Activity className="w-2.5 h-2.5" />
              <span>MAJ {data.lastUpdate}</span>
            </div>

            {/* Notification button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
              }}
              className={`relative p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <Bell className="w-3.5 h-3.5" style={{ color: hasNotifications ? color : '#737373' }} />
              {hasNotifications && (
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#ef4444' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-[8px] font-bold text-white">{data.notifications.length}</span>
                </motion.div>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Notification panel */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationPanel
            notifications={data.notifications}
            color={color}
            onClose={() => setShowNotifications(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Score circle with enhanced design
function ScoreCircle({ value, label, color, delay = 0, isActive, onHover, isDarkMode = false }: ScoreCircleProps) {
  const radius = 38;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center cursor-pointer"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <motion.div
        className="relative w-20 h-20 md:w-24 md:h-24"
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Outer glow */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${color}, ${color}50, ${color})`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Background */}
        <div className={`absolute inset-1 rounded-full backdrop-blur-sm ${
          isDarkMode ? 'bg-black/80' : 'bg-white/80'
        }`} />

        <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ delay: delay + 0.3, duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {value}
          </motion.span>
          <span className={`text-[7px] uppercase tracking-wider ${
            isDarkMode ? 'text-neutral-500' : 'text-gray-500'
          }`}>
            score
          </span>
        </div>
      </motion.div>

      <motion.span
        className="mt-1.5 text-[10px] md:text-xs font-medium"
        style={{ color }}
        animate={{ textShadow: isActive ? `0 0 10px ${color}` : 'none' }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

// Global health bar
function GlobalHealthBar({ scores, isDarkMode = false }: { scores: Record<string, number>; isDarkMode?: boolean }) {
  const average = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-sm border mb-6 ${
        isDarkMode
          ? 'bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 border-gray-700 shadow-lg shadow-blue-500/10'
          : 'bg-gradient-to-r from-gray-50 via-white to-gray-50 border-gray-200 shadow-sm'
      }`}
      style={isDarkMode ? {
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      } : undefined}
    >
      <Activity className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`} />
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Santé globale
      </span>
      <div className={`flex-1 h-2 rounded-full overflow-hidden ${
        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-300'
      }`}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: isDarkMode
              ? 'linear-gradient(to right, #ef4444, #f59e0b, #22c55e)'
              : 'linear-gradient(to right, #ef4444, #f59e0b, #22c55e)',
            boxShadow: isDarkMode ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${average}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>
      <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {average}%
      </span>
    </motion.div>
  );
}

export function HouseFinanceDashboard3D({ data, onSectionClick, isDarkMode = false }: HouseFinanceDashboard3DProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleRoomClick = (id: string) => {
    setSelectedRoom(id === selectedRoom ? null : id);
    onSectionClick?.(id);
  };

  const colors = {
    security: '#22c55e',
    planning: '#3b82f6',
    investment: '#a855f7',
    protection: '#f59e0b',
  };

  // Get section score
  const getSectionScore = (sectionId: string): number => {
    if (!data) return 0;
    const sectionData = data[sectionId as keyof MaisonDesFinancesData];
    if (typeof sectionData === 'object' && sectionData !== null) {
      const scoreKey = `${sectionId}_score`;
      return (sectionData as any)[scoreKey] || 0;
    }
    return 0;
  };

  // Get section status based on score
  const getSectionStatus = (sectionId: string): 'optimal' | 'attention' | 'action' => {
    const score = getSectionScore(sectionId);
    if (score >= 75) return 'optimal';
    if (score >= 50) return 'attention';
    return 'action';
  };

  // Generate mock notifications based on section status
  const generateNotifications = (sectionId: string): Notification[] => {
    const status = getSectionStatus(sectionId);
    const score = getSectionScore(sectionId);

    if (!data) return [];

    // Only show notifications for sections that need attention
    if (status === 'action') {
      return [{
        id: `${sectionId}-1`,
        type: 'alert',
        title: 'Action requise',
        message: `Score faible (${score}/100) - Veuillez compléter cette section`,
        time: 'Il y a 1h'
      }];
    } else if (status === 'attention') {
      return [{
        id: `${sectionId}-1`,
        type: 'warning',
        title: 'À améliorer',
        message: `Section partiellement remplie (${score}/100)`,
        time: 'Il y a 2h'
      }];
    }

    return [];
  };

  // Generate mock metrics based on section data
  const generateMetrics = (sectionId: string): ZoneData['metrics'] => {
    const score = getSectionScore(sectionId);
    const completionStatus = data?.completion_status?.[sectionId as keyof typeof data.completion_status];

    return [
      {
        label: 'Complétion',
        value: `${score}%`,
        trend: score > 50 ? 'up' : score > 25 ? 'stable' : 'down'
      },
      {
        label: 'Statut',
        value: completionStatus === 'termine' ? 'Terminé' : completionStatus === 'en_cours' ? 'En cours' : 'À faire',
        trend: completionStatus === 'termine' ? 'stable' : 'up'
      },
    ];
  };

  // Zone data - mapped to Aurore Finance sections
  const zones: Record<string, ZoneData> = {
    fiscalite: {
      id: 'fiscalite',
      icon: DollarSign,
      label: 'Fiscalité',
      description: 'Optimisation fiscale et calculs d\'impôts',
      status: getSectionStatus('fiscalite'),
      metrics: generateMetrics('fiscalite'),
      lastUpdate: '2h',
      notifications: generateNotifications('fiscalite'),
      score: getSectionScore('fiscalite')
    },
    juridique: {
      id: 'juridique',
      icon: Scale,
      label: 'Juridique',
      description: 'Protection juridique et documents',
      status: getSectionStatus('juridique'),
      metrics: generateMetrics('juridique'),
      lastUpdate: '1j',
      notifications: generateNotifications('juridique'),
      score: getSectionScore('juridique')
    },
    immobilier: {
      id: 'immobilier',
      icon: Home,
      label: 'Immobilier',
      description: 'Propriété et projets immobiliers',
      status: getSectionStatus('immobilier'),
      metrics: generateMetrics('immobilier'),
      lastUpdate: '3h',
      notifications: generateNotifications('immobilier'),
      score: getSectionScore('immobilier')
    },
    fortune: {
      id: 'fortune',
      icon: TrendingUp,
      label: 'Fortune',
      description: 'Patrimoine et placements',
      status: getSectionStatus('fortune'),
      metrics: generateMetrics('fortune'),
      lastUpdate: '30m',
      notifications: generateNotifications('fortune'),
      score: getSectionScore('fortune')
    },
    vieillesse: {
      id: 'vieillesse',
      icon: Calendar,
      label: 'Vieillesse',
      description: 'Prévoyance retraite (AVS, LPP, 3a/3b)',
      status: getSectionStatus('vieillesse'),
      metrics: generateMetrics('vieillesse'),
      lastUpdate: '1h',
      notifications: generateNotifications('vieillesse'),
      score: getSectionScore('vieillesse')
    },
    budget: {
      id: 'budget',
      icon: Calculator,
      label: 'Budget',
      description: 'Gestion budget et dépenses',
      status: getSectionStatus('budget'),
      metrics: generateMetrics('budget'),
      lastUpdate: '45m',
      notifications: generateNotifications('budget'),
      score: getSectionScore('budget')
    },
    biens: {
      id: 'biens',
      icon: Shield,
      label: 'Biens',
      description: 'Protection des biens et RC',
      status: getSectionStatus('biens'),
      metrics: generateMetrics('biens'),
      lastUpdate: '15m',
      notifications: generateNotifications('biens'),
      score: getSectionScore('biens')
    },
    revenu: {
      id: 'revenu',
      icon: Wallet,
      label: 'Revenu',
      description: 'Sources de revenus',
      status: getSectionStatus('revenu'),
      metrics: generateMetrics('revenu'),
      lastUpdate: '2h',
      notifications: generateNotifications('revenu'),
      score: getSectionScore('revenu')
    },
    sante: {
      id: 'sante',
      icon: Heart,
      label: 'Santé',
      description: 'Assurances santé (LAMal, LCA)',
      status: getSectionStatus('sante'),
      metrics: generateMetrics('sante'),
      lastUpdate: '4h',
      notifications: generateNotifications('sante'),
      score: getSectionScore('sante')
    },
  };

  // Calculate category scores
  const scores = {
    protection: Math.round((getSectionScore('fiscalite') + getSectionScore('juridique')) / 2),
    investissement: Math.round((getSectionScore('immobilier') + getSectionScore('fortune')) / 2),
    planification: Math.round((getSectionScore('vieillesse') + getSectionScore('budget')) / 2),
    securite: Math.round((getSectionScore('sante') + getSectionScore('revenu') + getSectionScore('biens')) / 3),
  };

  const categoryZones: Record<string, string[]> = {
    protection: ['fiscalite', 'juridique'],
    investissement: ['immobilier', 'fortune'],
    planification: ['vieillesse', 'budget'],
    securite: ['biens', 'revenu', 'sante'],
  };

  const isZoneHighlighted = (zoneId: string) => {
    if (!activeCategory) return false;
    return categoryZones[activeCategory]?.includes(zoneId) || false;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className={`text-2xl md:text-4xl font-bold bg-clip-text text-transparent ${
          isDarkMode
            ? 'bg-gradient-to-r from-white via-neutral-200 to-neutral-400'
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
        }`}>
          🏠 Votre Maison des Finances
        </h2>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-neutral-500' : 'text-gray-600'}`}>
          Vue d'ensemble de votre situation
        </p>
      </motion.div>

      {/* Global health bar */}
      <GlobalHealthBar scores={scores} isDarkMode={isDarkMode} />

      {/* Score Circles */}
      <div className="flex justify-center gap-4 md:gap-8 mb-10">
        <ScoreCircle
          value={scores.protection}
          label="Protection"
          color={colors.protection}
          delay={0}
          isActive={activeCategory === 'protection'}
          onHover={(active) => setActiveCategory(active ? 'protection' : null)}
          isDarkMode={isDarkMode}
        />
        <ScoreCircle
          value={scores.investissement}
          label="Investissement"
          color={colors.investment}
          delay={0.1}
          isActive={activeCategory === 'investissement'}
          onHover={(active) => setActiveCategory(active ? 'investissement' : null)}
          isDarkMode={isDarkMode}
        />
        <ScoreCircle
          value={scores.planification}
          label="Planification"
          color={colors.planning}
          delay={0.2}
          isActive={activeCategory === 'planification'}
          onHover={(active) => setActiveCategory(active ? 'planification' : null)}
          isDarkMode={isDarkMode}
        />
        <ScoreCircle
          value={scores.securite}
          label="Sécurité"
          color={colors.security}
          delay={0.3}
          isActive={activeCategory === 'securite'}
          onHover={(active) => setActiveCategory(active ? 'securite' : null)}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* House Structure with side labels */}
      <div className="relative flex">
        {/* Left side labels */}
        <div className="hidden lg:flex flex-col justify-start gap-0 pr-4 w-40 pt-[100px]">
          {[
            { label: 'Protection', sublabel: 'Toiture', color: colors.protection, category: 'protection', height: 'h-[118px]' },
            { label: 'Investissement', sublabel: 'Combles', color: colors.investment, category: 'investissement', height: 'h-[118px]' },
            { label: 'Planification', sublabel: 'Étage', color: colors.planning, category: 'planification', height: 'h-[118px]' },
            { label: 'Sécurité', sublabel: 'Fondations', color: colors.security, category: 'securite', height: 'h-[130px]' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`relative flex items-center justify-end ${item.height}`}
              onMouseEnter={() => setActiveCategory(item.category)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {/* Background glow */}
              <motion.div
                className="absolute inset-0 rounded-l-xl"
                style={{
                  background: `linear-gradient(to right, ${item.color}15, transparent)`,
                }}
                animate={{
                  background: activeCategory === item.category
                    ? `linear-gradient(to right, ${item.color}30, ${item.color}10)`
                    : `linear-gradient(to right, ${item.color}15, transparent)`,
                }}
              />
              {/* Label */}
              <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all">
                <div className="text-right">
                  <span className="text-xs font-bold block" style={{ color: item.color }}>
                    {item.label}
                  </span>
                  <span className={`text-[9px] ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>
                    {item.sublabel}
                  </span>
                </div>
                <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: item.color }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* House content */}
        <div className="flex-1 relative">
          {/* Roof - SVG Triangle */}
          <motion.div
            className="relative -mx-2 -mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <svg
              viewBox="0 0 720 135"
              className="w-full mx-auto"
              preserveAspectRatio="xMidYMax meet"
            >
              <defs>
                <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.protection} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={colors.protection} stopOpacity="0.15" />
                </linearGradient>
                <filter id="roofGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Roof shadow */}
              <path
                d="M 360 0 L 715 95 L 5 95 Z"
                fill="none"
                stroke={colors.protection}
                strokeWidth="3"
                strokeOpacity="0.7"
                filter="url(#roofGlow)"
              />
              {/* Roof fill */}
              <path
                d="M 360 0 L 715 95 L 5 95 Z"
                fill="url(#roofGradient)"
                stroke={colors.protection}
                strokeWidth="2"
                strokeOpacity="0.8"
              />
            </svg>
          </motion.div>

          {/* Protection floor (under roof) */}
          <motion.div
            className="relative -mt-6 px-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              background: `linear-gradient(180deg, ${colors.protection}15 0%, transparent 100%)`,
            }}
          >
            {/* Mobile label */}
            <div className="lg:hidden text-center py-1">
              <span className="text-[10px] font-medium" style={{ color: colors.protection }}>Protection</span>
            </div>
            <div className="flex justify-center gap-2 pb-2">
              <ZoneCard
                data={zones.fiscalite}
                isSelected={selectedRoom === 'fiscalite'}
                isHighlighted={isZoneHighlighted('fiscalite')}
                onClick={() => handleRoomClick('fiscalite')}
                color={colors.protection}
                className="flex-1 max-w-[320px] h-[110px]"
                isDarkMode={isDarkMode}
              />
              <ZoneCard
                data={zones.juridique}
                isSelected={selectedRoom === 'juridique'}
                isHighlighted={isZoneHighlighted('juridique')}
                onClick={() => handleRoomClick('juridique')}
                color={colors.protection}
                className="flex-1 max-w-[320px] h-[110px]"
                isDarkMode={isDarkMode}
              />
            </div>
          </motion.div>

          {/* Investment floor */}
          <motion.div
            className="relative px-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: `linear-gradient(180deg, ${colors.investment}12 0%, transparent 100%)`,
            }}
          >
            {/* Mobile label */}
            <div className="lg:hidden text-center py-1">
              <span className="text-[10px] font-medium" style={{ color: colors.investment }}>Investissement</span>
            </div>
            <div className="flex justify-center gap-2 pb-2">
              <ZoneCard
                data={zones.immobilier}
                isSelected={selectedRoom === 'immobilier'}
                isHighlighted={isZoneHighlighted('immobilier')}
                onClick={() => handleRoomClick('immobilier')}
                color={colors.investment}
                className="flex-1 max-w-[320px] h-[110px]"
                isDarkMode={isDarkMode}
              />
              <ZoneCard
                data={zones.fortune}
                isSelected={selectedRoom === 'fortune'}
                isHighlighted={isZoneHighlighted('fortune')}
                onClick={() => handleRoomClick('fortune')}
                color={colors.investment}
                className="flex-1 max-w-[320px] h-[110px]"
                isDarkMode={isDarkMode}
              />
            </div>
          </motion.div>

          {/* Planning floor */}
          <motion.div
            className="relative px-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: `linear-gradient(180deg, ${colors.planning}12 0%, transparent 100%)`,
            }}
          >
            {/* Mobile label */}
            <div className="lg:hidden text-center py-1">
              <span className="text-[10px] font-medium" style={{ color: colors.planning }}>Planification</span>
            </div>
            <div className="flex justify-center gap-2 pb-2">
              <ZoneCard
                data={zones.vieillesse}
                isSelected={selectedRoom === 'vieillesse'}
                isHighlighted={isZoneHighlighted('vieillesse')}
                onClick={() => handleRoomClick('vieillesse')}
                color={colors.planning}
                className="flex-1 max-w-[320px] h-[110px]"
                isDarkMode={isDarkMode}
              />
              <ZoneCard
                data={zones.budget}
                isSelected={selectedRoom === 'budget'}
                isHighlighted={isZoneHighlighted('budget')}
                onClick={() => handleRoomClick('budget')}
                color={colors.planning}
                className="flex-1 max-w-[320px] h-[110px]"
                isDarkMode={isDarkMode}
              />
            </div>
          </motion.div>

          {/* Foundation / Ground line */}
          <motion.div
            className="h-3 mx-2 rounded-sm overflow-hidden"
            style={{
              background: isDarkMode
                ? 'linear-gradient(90deg, transparent 0%, rgba(100,80,60,0.4) 20%, rgba(100,80,60,0.5) 50%, rgba(100,80,60,0.4) 80%, transparent 100%)'
                : 'linear-gradient(90deg, transparent 0%, rgba(139,119,101,0.3) 20%, rgba(139,119,101,0.4) 50%, rgba(139,119,101,0.3) 80%, transparent 100%)',
              borderTop: `2px solid rgba(139,119,101,${isDarkMode ? '0.6' : '0.4'})`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />

          {/* Security floor (underground/terrain) */}
          <motion.div
            className="relative px-2 -mt-1 pt-3 pb-2 rounded-b-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{
              background: `linear-gradient(180deg, ${colors.security}20 0%, ${colors.security}08 100%)`,
              borderLeft: `2px dashed ${colors.security}30`,
              borderRight: `2px dashed ${colors.security}30`,
              borderBottom: `2px dashed ${colors.security}30`,
            }}
          >
            {/* Underground texture pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 8px,
                  ${colors.security}20 8px,
                  ${colors.security}20 9px
                )`,
              }}
            />

            {/* Mobile label */}
            <div className="lg:hidden text-center pb-1">
              <span className="text-[10px] font-medium" style={{ color: colors.security }}>Sécurité (Fondations)</span>
            </div>
            <div className="relative flex justify-center gap-2">
              <ZoneCard
                data={zones.biens}
                isSelected={selectedRoom === 'biens'}
                isHighlighted={isZoneHighlighted('biens')}
                onClick={() => handleRoomClick('biens')}
                color={colors.security}
                className="flex-1 max-w-[210px] h-[110px]"
                isDarkMode={isDarkMode}
              />
              <ZoneCard
                data={zones.revenu}
                isSelected={selectedRoom === 'revenu'}
                isHighlighted={isZoneHighlighted('revenu')}
                onClick={() => handleRoomClick('revenu')}
                color={colors.security}
                className="flex-1 max-w-[210px] h-[110px]"
                isDarkMode={isDarkMode}
              />
              <ZoneCard
                data={zones.sante}
                isSelected={selectedRoom === 'sante'}
                isHighlighted={isZoneHighlighted('sante')}
                onClick={() => handleRoomClick('sante')}
                color={colors.security}
                className="flex-1 max-w-[210px] h-[110px]"
                isDarkMode={isDarkMode}
              />
            </div>
          </motion.div>

          {/* House walls - side borders */}
          <div
            className="absolute -left-1 top-[90px] bottom-0 w-1 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${colors.protection}60, ${colors.investment}50, ${colors.planning}50, ${colors.security}60)`,
              boxShadow: `0 0 8px ${colors.protection}30`
            }}
          />
          <div
            className="absolute -right-1 top-[90px] bottom-0 w-1 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${colors.protection}60, ${colors.investment}50, ${colors.planning}50, ${colors.security}60)`,
              boxShadow: `0 0 8px ${colors.protection}30`
            }}
          />
        </div>

        {/* Right side - empty for balance on desktop */}
        <div className="hidden lg:block w-36" />
      </div>

      {/* Selected zone details panel */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="mt-8 overflow-hidden"
          >
            <div className={`p-5 md:p-6 backdrop-blur-md rounded-2xl border ${
              isDarkMode
                ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
                : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = zones[selectedRoom].icon;
                    const zoneColor = ['fiscalite', 'juridique'].includes(selectedRoom) ? colors.protection :
                      ['immobilier', 'fortune'].includes(selectedRoom) ? colors.investment :
                      ['vieillesse', 'budget'].includes(selectedRoom) ? colors.planning :
                      colors.security;
                    return (
                      <>
                        <div
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${zoneColor}25` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: zoneColor }} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {zones[selectedRoom].label}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                            {zones[selectedRoom].description}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className={`w-5 h-5 ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {zones[selectedRoom].metrics.map((metric, i) => (
                  <div key={i} className={`p-3 rounded-xl ${
                    isDarkMode ? 'bg-white/5' : 'bg-white/50'
                  }`}>
                    <span className={`text-[10px] block mb-1 ${
                      isDarkMode ? 'text-neutral-500' : 'text-gray-600'
                    }`}>
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metric.value}
                      </span>
                      {metric.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-400" />}
                      {metric.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notifications section */}
              {zones[selectedRoom].notifications.length > 0 && (
                <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-300'}`}>
                  <h4 className={`text-xs font-medium mb-2 flex items-center gap-1.5 ${
                    isDarkMode ? 'text-neutral-400' : 'text-gray-600'
                  }`}>
                    <Bell className="w-3.5 h-3.5" />
                    Notifications récentes
                  </h4>
                  <div className="space-y-2">
                    {zones[selectedRoom].notifications.map((notif) => (
                      <div key={notif.id} className={`flex items-start gap-2 p-2 rounded-lg ${
                        isDarkMode ? 'bg-white/5' : 'bg-white/50'
                      }`}>
                        {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                        {notif.type === 'alert' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                        {notif.type === 'info' && <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                        <div>
                          <p className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {notif.title}
                          </p>
                          <p className={`text-[10px] ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
