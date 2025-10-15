'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserMenu from '@/components/auth/UserMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Info,
  TrendingUp,
  Calendar,
  Target,
  Settings,
  Trash2,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'fiscal' | 'objectif' | 'marche' | 'system';
}

interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  emailObjectifs: boolean;
  emailMarche: boolean;
  emailFiscal: boolean;
  emailSystem: boolean;
  pushObjectifs: boolean;
  pushMarche: boolean;
  pushFiscal: boolean;
  pushSystem: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Objectif atteint!',
      message: 'Félicitations! Vous avez atteint votre objectif "Épargne 3e pilier 2025".',
      timestamp: '2025-01-15T10:30:00',
      read: false,
      category: 'objectif',
    },
    {
      id: '2',
      type: 'info',
      title: 'Rappel fiscal',
      message: 'N\'oubliez pas de déclarer vos revenus avant le 31 mars 2025.',
      timestamp: '2025-01-14T09:00:00',
      read: false,
      category: 'fiscal',
    },
    {
      id: '3',
      type: 'warning',
      title: 'Opportunité d\'optimisation',
      message: 'Vous pourriez économiser CHF 1\'200 en maximisant votre 3e pilier cette année.',
      timestamp: '2025-01-13T15:45:00',
      read: true,
      category: 'fiscal',
    },
    {
      id: '4',
      type: 'alert',
      title: 'Action requise',
      message: 'Votre profil fiscal est incomplet. Complétez-le pour des recommandations personnalisées.',
      timestamp: '2025-01-12T11:20:00',
      read: true,
      category: 'system',
    },
    {
      id: '5',
      type: 'info',
      title: 'Mise à jour du marché',
      message: 'Les taux hypothécaires ont baissé de 0.25%. C\'est peut-être le bon moment pour renégocier.',
      timestamp: '2025-01-11T08:15:00',
      read: true,
      category: 'marche',
    },
  ]);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    pushEnabled: false,
    emailObjectifs: true,
    emailMarche: true,
    emailFiscal: true,
    emailSystem: true,
    pushObjectifs: false,
    pushMarche: false,
    pushFiscal: false,
    pushSystem: false,
    frequency: 'daily',
  });

  const [filter, setFilter] = useState<'all' | 'unread' | 'fiscal' | 'objectif' | 'marche' | 'system'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'fiscal':
        return <TrendingUp className="w-4 h-4" />;
      case 'objectif':
        return <Target className="w-4 h-4" />;
      case 'marche':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: Notification['category']) => {
    switch (category) {
      case 'fiscal':
        return 'Fiscalité';
      case 'objectif':
        return 'Objectifs';
      case 'marche':
        return 'Marché';
      default:
        return 'Système';
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'alert':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays}j`;
    } else {
      return date.toLocaleDateString('fr-CH', { day: '2-digit', month: 'short' });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.category === filter;
  });

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = () => {
    // TODO: Sauvegarder dans Supabase
    alert('Préférences sauvegardées avec succès!');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8 text-blue-600" />
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                      <p className="text-sm text-gray-600">
                        {unreadCount > 0 ? `${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''}` : 'Aucune nouvelle notification'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <UserMenu />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'outline'}
              onClick={() => setActiveTab('notifications')}
              className="flex-1 md:flex-none"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'preferences' ? 'default' : 'outline'}
              onClick={() => setActiveTab('preferences')}
              className="flex-1 md:flex-none"
            >
              <Settings className="w-4 h-4 mr-2" />
              Préférences
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {/* Filters and Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                      >
                        Toutes
                      </Button>
                      <Button
                        variant={filter === 'unread' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('unread')}
                      >
                        Non lues ({unreadCount})
                      </Button>
                      <Button
                        variant={filter === 'fiscal' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('fiscal')}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Fiscalité
                      </Button>
                      <Button
                        variant={filter === 'objectif' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('objectif')}
                      >
                        <Target className="w-3 h-3 mr-1" />
                        Objectifs
                      </Button>
                      <Button
                        variant={filter === 'marche' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('marche')}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Marché
                      </Button>
                    </div>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Tout marquer comme lu
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications List */}
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Aucune notification à afficher</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredNotifications.map(notification => (
                    <Card
                      key={notification.id}
                      className={`${getTypeColor(notification.type)} ${
                        !notification.read ? 'border-l-4 border-l-blue-600' : ''
                      } hover:shadow-md transition-shadow`}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryIcon(notification.category)}
                                  <span className="ml-1">{getCategoryLabel(notification.category)}</span>
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                            <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'} mb-3`}>
                              {notification.message}
                            </p>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Marquer comme lu
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Notifications par email
                  </CardTitle>
                  <CardDescription>
                    Recevez des notifications par email à {/* TODO: afficher l'email de l'utilisateur */}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Activer les emails</Label>
                      <p className="text-sm text-gray-600">Recevoir toutes les notifications par email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.emailEnabled}
                      onChange={(e) => handlePreferenceChange('emailEnabled', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {preferences.emailEnabled && (
                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          Objectifs financiers
                        </Label>
                        <input
                          type="checkbox"
                          checked={preferences.emailObjectifs}
                          onChange={(e) => handlePreferenceChange('emailObjectifs', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          Conseils fiscaux
                        </Label>
                        <input
                          type="checkbox"
                          checked={preferences.emailFiscal}
                          onChange={(e) => handlePreferenceChange('emailFiscal', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          Actualités du marché
                        </Label>
                        <input
                          type="checkbox"
                          checked={preferences.emailMarche}
                          onChange={(e) => handlePreferenceChange('emailMarche', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm flex items-center gap-2">
                          <Settings className="w-4 h-4 text-blue-600" />
                          Notifications système
                        </Label>
                        <input
                          type="checkbox"
                          checked={preferences.emailSystem}
                          onChange={(e) => handlePreferenceChange('emailSystem', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Push Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    Notifications push
                  </CardTitle>
                  <CardDescription>
                    Recevez des notifications instantanées dans votre navigateur
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Activer les notifications push</Label>
                      <p className="text-sm text-gray-600">Recevoir des alertes en temps réel</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.pushEnabled}
                      onChange={(e) => handlePreferenceChange('pushEnabled', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {preferences.pushEnabled && (
                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          Objectifs financiers
                        </Label>
                        <input
                          type="checkbox"
                          checked={preferences.pushObjectifs}
                          onChange={(e) => handlePreferenceChange('pushObjectifs', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          Conseils fiscaux
                        </Label>
                        <input
                          type="checkbox"
                          checked={preferences.pushFiscal}
                          onChange={(e) => handlePreferenceChange('pushFiscal', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          Actualités du marché
                        </Label>
                        <input
                          type="checkbox"
                          checked={preferences.pushMarche}
                          onChange={(e) => handlePreferenceChange('pushMarche', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm flex items-center gap-2">
                          <Settings className="w-4 h-4 text-blue-600" />
                          Notifications système
                        </Label>
                        <input
                          type="checkbox"
                          checked={preferences.pushSystem}
                          onChange={(e) => handlePreferenceChange('pushSystem', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Frequency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Fréquence des emails
                  </CardTitle>
                  <CardDescription>
                    Choisissez à quelle fréquence recevoir un résumé par email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={preferences.frequency}
                    onValueChange={(value) => handlePreferenceChange('frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immédiat (chaque notification)</SelectItem>
                      <SelectItem value="daily">Quotidien (résumé journalier)</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire (résumé le lundi)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={savePreferences}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Sauvegarder les préférences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
