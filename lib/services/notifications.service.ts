import { UserInsight, NotificationSettings, FinancialGoal } from '@/types/user';
import { UserProfileService } from './user-profile.service';
import { GoalsService } from './goals.service';

export interface Notification {
  id: string;
  userId: string;
  type: 'goal_reminder' | 'tax_deadline' | 'pillar3_reminder' | 'goal_milestone' | 'insight_alert' | 'system_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  scheduledFor: Date;
  delivered: boolean;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface ReminderSchedule {
  id: string;
  userId: string;
  type: 'goal_contribution' | 'tax_optimization' | 'pillar3_annual' | 'portfolio_review' | 'goal_review';
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  customCron?: string;
  isActive: boolean;
  nextScheduled: Date;
  lastTriggered?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationsService {
  private static instance: NotificationsService;
  private notifications: Map<string, Notification[]> = new Map();
  private reminders: Map<string, ReminderSchedule[]> = new Map();
  private userProfileService: UserProfileService;
  private goalsService: GoalsService;

  private constructor() {
    this.userProfileService = UserProfileService.getInstance();
    this.goalsService = GoalsService.getInstance();
  }

  public static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  // Gestion des notifications
  async createNotification(userId: string, notificationData: Omit<Notification, 'id' | 'userId' | 'delivered' | 'createdAt'>): Promise<Notification> {
    const notification: Notification = {
      id: this.generateId(),
      userId,
      ...notificationData,
      delivered: false,
      createdAt: new Date()
    };

    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.push(notification);
    this.notifications.set(userId, userNotifications);

    // Tenter la livraison immédiate si c'est prévu pour maintenant ou dans le passé
    if (notification.scheduledFor <= new Date()) {
      await this.deliverNotification(notification.id);
    }

    return notification;
  }

  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const userNotifications = this.notifications.get(userId) || [];
    
    if (unreadOnly) {
      return userNotifications.filter(n => !n.readAt);
    }
    
    return userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    for (const [userId, notifications] of this.notifications.entries()) {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.readAt = new Date();
        return true;
      }
    }
    return false;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const userNotifications = this.notifications.get(userId) || [];
    let count = 0;
    
    userNotifications.forEach(notification => {
      if (!notification.readAt) {
        notification.readAt = new Date();
        count++;
      }
    });
    
    return count;
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    for (const [userId, notifications] of this.notifications.entries()) {
      const index = notifications.findIndex(n => n.id === notificationId);
      if (index >= 0) {
        notifications.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  // Gestion des rappels programmés
  async createReminder(userId: string, reminderData: Omit<ReminderSchedule, 'id' | 'userId' | 'nextScheduled' | 'createdAt' | 'updatedAt'>): Promise<ReminderSchedule> {
    const reminder: ReminderSchedule = {
      id: this.generateId(),
      userId,
      ...reminderData,
      nextScheduled: this.calculateNextSchedule(reminderData.frequency, reminderData.dayOfWeek, reminderData.dayOfMonth, reminderData.customCron),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const userReminders = this.reminders.get(userId) || [];
    userReminders.push(reminder);
    this.reminders.set(userId, userReminders);

    return reminder;
  }

  async getUserReminders(userId: string): Promise<ReminderSchedule[]> {
    return this.reminders.get(userId) || [];
  }

  async updateReminder(reminderId: string, updates: Partial<ReminderSchedule>): Promise<ReminderSchedule | null> {
    for (const [userId, reminders] of this.reminders.entries()) {
      const reminder = reminders.find(r => r.id === reminderId);
      if (reminder) {
        Object.assign(reminder, updates, { updatedAt: new Date() });
        
        // Recalculer le prochain déclenchement si la fréquence a changé
        if (updates.frequency || updates.dayOfWeek || updates.dayOfMonth || updates.customCron) {
          reminder.nextScheduled = this.calculateNextSchedule(
            reminder.frequency, 
            reminder.dayOfWeek, 
            reminder.dayOfMonth, 
            reminder.customCron
          );
        }
        
        return reminder;
      }
    }
    return null;
  }

  async deleteReminder(reminderId: string): Promise<boolean> {
    for (const [userId, reminders] of this.reminders.entries()) {
      const index = reminders.findIndex(r => r.id === reminderId);
      if (index >= 0) {
        reminders.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  // Génération automatique de notifications intelligentes
  async generateGoalNotifications(userId: string): Promise<Notification[]> {
    const goals = await this.goalsService.getGoalsByUser(userId);
    const notifications: Notification[] = [];
    const now = new Date();

    for (const goal of goals) {
      if (goal.status !== 'actif') continue;

      // Rappel de contribution mensuelle
      if (goal.derniereContribution) {
        const daysSinceLastContribution = (now.getTime() - goal.derniereContribution.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastContribution >= 30 && goal.versementMensuelPlan > 0) {
          const notification = await this.createNotification(userId, {
            type: 'goal_reminder',
            title: `Rappel contribution - ${goal.titre}`,
            message: `Il est temps d'effectuer votre versement mensuel de ${goal.versementMensuelPlan.toLocaleString('fr-CH')} CHF.`,
            priority: 'medium',
            scheduledFor: now,
            actionUrl: `/objectifs/${goal.id}/contribute`,
            actionLabel: 'Contribuer maintenant',
            metadata: { goalId: goal.id, amount: goal.versementMensuelPlan }
          });
          notifications.push(notification);
        }
      }

      // Milestone atteint
      const milestones = [25, 50, 75, 90];
      for (const milestone of milestones) {
        if (goal.progressionPourcentage >= milestone && goal.progressionPourcentage < milestone + 5) {
          const notification = await this.createNotification(userId, {
            type: 'goal_milestone',
            title: `🎉 ${milestone}% atteint pour "${goal.titre}"`,
            message: `Félicitations ! Vous avez atteint ${milestone}% de votre objectif de ${goal.montantCible.toLocaleString('fr-CH')} CHF.`,
            priority: 'low',
            scheduledFor: now,
            actionUrl: `/objectifs/${goal.id}`,
            actionLabel: 'Voir les détails',
            metadata: { goalId: goal.id, milestone }
          });
          notifications.push(notification);
        }
      }

      // Objectif en retard
      const timeAnalysis = this.goalsService.calculateTimeToGoal(goal);
      if (!timeAnalysis.isOnTrack) {
        const notification = await this.createNotification(userId, {
          type: 'goal_reminder',
          title: `⚠️ Objectif en retard - ${goal.titre}`,
          message: `Votre objectif nécessite ${timeAnalysis.requiredMonthlyContribution.toFixed(0)} CHF/mois au lieu de ${goal.versementMensuelPlan} CHF actuels.`,
          priority: 'high',
          scheduledFor: now,
          actionUrl: `/objectifs/${goal.id}/edit`,
          actionLabel: 'Ajuster la stratégie',
          metadata: { goalId: goal.id, requiredAmount: timeAnalysis.requiredMonthlyContribution }
        });
        notifications.push(notification);
      }

      // Échéance proche (moins de 3 mois)
      const monthsToDeadline = (goal.dateEcheance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsToDeadline <= 3 && monthsToDeadline > 0 && goal.progressionPourcentage < 90) {
        const notification = await this.createNotification(userId, {
          type: 'goal_reminder',
          title: `⏰ Échéance proche - ${goal.titre}`,
          message: `Plus que ${Math.ceil(monthsToDeadline)} mois pour atteindre votre objectif. Accélérez vos contributions !`,
          priority: 'high',
          scheduledFor: now,
          actionUrl: `/objectifs/${goal.id}`,
          actionLabel: 'Revoir la stratégie',
          metadata: { goalId: goal.id, monthsLeft: monthsToDeadline }
        });
        notifications.push(notification);
      }
    }

    return notifications;
  }

  async generateTaxNotifications(userId: string): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    // Rappel déclaration d'impôts (mars)
    if (now.getMonth() === 2) { // Mars
      const notification = await this.createNotification(userId, {
        type: 'tax_deadline',
        title: 'Période de déclaration d\'impôts',
        message: 'C\'est le moment de préparer votre déclaration d\'impôts. Avez-vous optimisé toutes vos déductions ?',
        priority: 'high',
        scheduledFor: new Date(currentYear, 2, 1), // 1er mars
        actionUrl: '/simulateurs/impots',
        actionLabel: 'Simuler mes impôts',
        metadata: { year: currentYear - 1 }
      });
      notifications.push(notification);
    }

    // Optimisation 3e pilier (novembre)
    if (now.getMonth() === 10) { // Novembre
      const notification = await this.createNotification(userId, {
        type: 'pillar3_reminder',
        title: 'Optimisation 3e pilier - Fin d\'année',
        message: 'Dernière chance pour optimiser votre 3e pilier et réduire vos impôts 2024. Maximum: 7\'056 CHF.',
        priority: 'high',
        scheduledFor: new Date(currentYear, 10, 1), // 1er novembre
        actionUrl: '/simulateurs/retraite',
        actionLabel: 'Optimiser maintenant',
        metadata: { maxAmount: 7056, year: currentYear }
      });
      notifications.push(notification);
    }

    return notifications;
  }

  async generateInsightNotifications(userId: string): Promise<Notification[]> {
    const insights = await this.userProfileService.generateFinancialInsights(userId);
    const notifications: Notification[] = [];
    const now = new Date();

    for (const insight of insights) {
      if (insight.priorite === 'urgent' || insight.priorite === 'warning') {
        const notification = await this.createNotification(userId, {
          type: 'insight_alert',
          title: insight.titre,
          message: insight.message,
          priority: insight.priorite === 'urgent' ? 'urgent' : 'high',
          scheduledFor: now,
          actionUrl: insight.actionUrl,
          actionLabel: insight.actionRecommandee,
          metadata: { insightId: insight.id, insightType: insight.type }
        });
        notifications.push(notification);
      }
    }

    return notifications;
  }

  // Traitement des rappels programmés
  async processScheduledReminders(): Promise<void> {
    const now = new Date();
    
    for (const [userId, reminders] of this.reminders.entries()) {
      for (const reminder of reminders) {
        if (reminder.isActive && reminder.nextScheduled <= now) {
          await this.triggerReminder(reminder);
          
          // Programmer le prochain déclenchement
          reminder.lastTriggered = now;
          reminder.nextScheduled = this.calculateNextSchedule(
            reminder.frequency,
            reminder.dayOfWeek,
            reminder.dayOfMonth,
            reminder.customCron
          );
          reminder.updatedAt = now;
        }
      }
    }
  }

  private async triggerReminder(reminder: ReminderSchedule): Promise<void> {
    let title = '';
    let message = '';
    let actionUrl = '';
    let actionLabel = '';

    switch (reminder.type) {
      case 'goal_contribution':
        const goalId = reminder.metadata.goalId;
        const goal = await this.goalsService.getGoal(goalId);
        if (goal) {
          title = `Rappel de contribution - ${goal.titre}`;
          message = `N'oubliez pas votre versement mensuel de ${goal.versementMensuelPlan.toLocaleString('fr-CH')} CHF.`;
          actionUrl = `/objectifs/${goalId}/contribute`;
          actionLabel = 'Contribuer';
        }
        break;

      case 'tax_optimization':
        title = 'Optimisation fiscale';
        message = 'Vérifiez vos déductions et optimisations fiscales pour cette année.';
        actionUrl = '/simulateurs/impots';
        actionLabel = 'Simuler';
        break;

      case 'pillar3_annual':
        title = 'Versement 3e pilier annuel';
        message = 'Pensez à effectuer votre versement annuel au 3e pilier (max. 7\'056 CHF).';
        actionUrl = '/simulateurs/retraite';
        actionLabel = 'Optimiser';
        break;

      case 'portfolio_review':
        title = 'Révision de portefeuille';
        message = 'Il est temps de revoir et rééquilibrer votre portefeuille d\'investissement.';
        actionUrl = '/simulateurs/investissement';
        actionLabel = 'Analyser';
        break;

      case 'goal_review':
        title = 'Révision des objectifs';
        message = 'Faites le point sur vos objectifs financiers et ajustez si nécessaire.';
        actionUrl = '/objectifs';
        actionLabel = 'Réviser';
        break;
    }

    if (title && message) {
      await this.createNotification(reminder.userId, {
        type: 'goal_reminder',
        title,
        message,
        priority: 'medium',
        scheduledFor: new Date(),
        actionUrl,
        actionLabel,
        metadata: { reminderId: reminder.id, reminderType: reminder.type }
      });
    }
  }

  // Livraison des notifications
  private async deliverNotification(notificationId: string): Promise<boolean> {
    for (const [userId, notifications] of this.notifications.entries()) {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.delivered) {
        notification.delivered = true;
        notification.deliveredAt = new Date();

        // Ici, on pourrait intégrer avec des services externes (email, push, etc.)
        await this.sendNotificationToUser(userId, notification);
        
        return true;
      }
    }
    return false;
  }

  private async sendNotificationToUser(userId: string, notification: Notification): Promise<void> {
    const settings = await this.userProfileService.getNotificationSettings(userId);
    
    if (!settings) return;

    // Email notifications
    if (settings.emailNotifications && notification.priority !== 'low') {
      // TODO: Intégrer avec service email
      console.log(`Email notification to ${userId}:`, notification.title);
    }

    // Push notifications
    if (settings.pushNotifications) {
      // TODO: Intégrer avec service push
      console.log(`Push notification to ${userId}:`, notification.title);
    }

    // Log pour le suivi
    await this.userProfileService.logUserAction(userId, {
      type: 'consultation_chatbot',
      details: {
        action: 'notification_delivered',
        notificationId: notification.id,
        type: notification.type,
        priority: notification.priority
      }
    });
  }

  // Calculs de planning
  private calculateNextSchedule(
    frequency: string,
    dayOfWeek?: number,
    dayOfMonth?: number,
    customCron?: string
  ): Date {
    const now = new Date();
    const next = new Date(now);

    switch (frequency) {
      case 'weekly':
        if (dayOfWeek !== undefined) {
          const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7;
          next.setDate(now.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
        } else {
          next.setDate(now.getDate() + 7);
        }
        break;

      case 'monthly':
        if (dayOfMonth !== undefined) {
          next.setDate(dayOfMonth);
          if (next <= now) {
            next.setMonth(next.getMonth() + 1);
          }
        } else {
          next.setMonth(now.getMonth() + 1);
        }
        break;

      case 'quarterly':
        next.setMonth(now.getMonth() + 3);
        break;

      case 'yearly':
        next.setFullYear(now.getFullYear() + 1);
        break;

      case 'custom':
        if (customCron) {
          // TODO: Implémenter parser cron simple
          next.setDate(now.getDate() + 1); // Fallback
        }
        break;

      default:
        next.setDate(now.getDate() + 1);
    }

    return next;
  }

  // Utilitaires
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Statistiques
  async getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    averageReadTime: number; // en heures
  }> {
    const notifications = this.notifications.get(userId) || [];
    
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.readAt).length,
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      averageReadTime: 0
    };

    notifications.forEach(n => {
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
      stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1;
    });

    // Calculer le temps moyen de lecture
    const readNotifications = notifications.filter(n => n.readAt && n.deliveredAt);
    if (readNotifications.length > 0) {
      const totalReadTime = readNotifications.reduce((sum, n) => {
        return sum + (n.readAt!.getTime() - n.deliveredAt!.getTime());
      }, 0);
      stats.averageReadTime = totalReadTime / readNotifications.length / (1000 * 60 * 60); // en heures
    }

    return stats;
  }

  // Sauvegarde et chargement
  async saveToStorage(): Promise<void> {
    if (typeof window !== 'undefined') {
      const data = {
        notifications: Array.from(this.notifications.entries()),
        reminders: Array.from(this.reminders.entries())
      };
      localStorage.setItem('aurore_notifications', JSON.stringify(data));
    }
  }

  async loadFromStorage(): Promise<void> {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('aurore_notifications');
      if (data) {
        const parsed = JSON.parse(data);
        this.notifications = new Map(parsed.notifications || []);
        this.reminders = new Map(parsed.reminders || []);
      }
    }
  }

  // Nettoyage automatique
  async cleanupOldNotifications(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    let cleanedCount = 0;
    
    for (const [userId, notifications] of this.notifications.entries()) {
      const initialLength = notifications.length;
      
      // Garder seulement les notifications récentes ou non lues
      const filtered = notifications.filter(n => 
        n.createdAt > cutoffDate || !n.readAt
      );
      
      this.notifications.set(userId, filtered);
      cleanedCount += initialLength - filtered.length;
    }
    
    return cleanedCount;
  }
}