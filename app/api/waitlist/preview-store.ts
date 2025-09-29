// Stockage temporaire des emails pour démonstration

interface EmailRecord {
  id: string;
  to: string;
  subject: string;
  html: string;
  sentAt: Date;
}

// Stockage en mémoire (en production, utiliser une vraie DB)
let emailStore: EmailRecord[] = [];

export async function storeEmailForPreview({ to, subject, html }: { to: string, subject: string, html: string }) {
  const emailRecord: EmailRecord = {
    id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    to,
    subject,
    html,
    sentAt: new Date()
  };
  
  emailStore.push(emailRecord);
  
  // Garder seulement les 50 derniers emails
  if (emailStore.length > 50) {
    emailStore = emailStore.slice(-50);
  }
  
  return emailRecord.id;
}

export function getStoredEmails(): EmailRecord[] {
  return emailStore.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
}

export function getEmailById(id: string): EmailRecord | undefined {
  return emailStore.find(email => email.id === id);
}

export function getEmailCount(): number {
  return emailStore.length;
}