import { UserProfile } from '@/types/user';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  dateCreation: Date;
  dernierConnexion?: Date;
  profil?: UserProfile;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
}

class AuthService {
  private readonly STORAGE_KEY = 'aurore_auth_user';
  private readonly TOKEN_KEY = 'aurore_auth_token';

  // Simulation d'une base de données utilisateurs (à remplacer par une vraie DB)
  private users: Map<string, User & { password: string }> = new Map();

  constructor() {
    // Charger les utilisateurs depuis le localStorage au démarrage
    this.loadUsersFromStorage();
  }

  private loadUsersFromStorage() {
    if (typeof window !== 'undefined') {
      const savedUsers = localStorage.getItem('aurore_users');
      if (savedUsers) {
        try {
          const userArray = JSON.parse(savedUsers);
          this.users = new Map(userArray.map((user: any) => [user.email, user]));
        } catch (error) {
          console.error('Erreur lors du chargement des utilisateurs:', error);
        }
      }
    }
  }

  private saveUsersToStorage() {
    if (typeof window !== 'undefined') {
      const userArray = Array.from(this.users.values());
      localStorage.setItem('aurore_users', JSON.stringify(userArray));
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Vérifier si l'utilisateur existe déjà
      if (this.users.has(data.email)) {
        return {
          success: false,
          error: 'Un compte avec cette adresse email existe déjà'
        };
      }

      // Validation basique
      if (!data.email || !data.password || !data.nom || !data.prenom) {
        return {
          success: false,
          error: 'Tous les champs sont requis'
        };
      }

      if (data.password.length < 6) {
        return {
          success: false,
          error: 'Le mot de passe doit contenir au moins 6 caractères'
        };
      }

      if (!this.isValidEmail(data.email)) {
        return {
          success: false,
          error: 'Adresse email invalide'
        };
      }

      // Créer le nouvel utilisateur
      const userId = this.generateId();
      const newUser: User & { password: string } = {
        id: userId,
        email: data.email,
        password: this.hashPassword(data.password), // En production, utiliser bcrypt
        nom: data.nom,
        prenom: data.prenom,
        dateCreation: new Date(),
        dernierConnexion: new Date()
      };

      this.users.set(data.email, newUser);
      this.saveUsersToStorage();

      // Générer un token et connecter l'utilisateur
      const token = this.generateToken(userId);
      const userResponse = { ...newUser };
      delete (userResponse as any).password;

      this.saveAuthState(userResponse, token);

      return {
        success: true,
        user: userResponse,
        token
      };

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur'
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const user = this.users.get(credentials.email);
      
      if (!user || !this.verifyPassword(credentials.password, user.password)) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect'
        };
      }

      // Mettre à jour la dernière connexion
      user.dernierConnexion = new Date();
      this.users.set(credentials.email, user);
      this.saveUsersToStorage();

      // Générer un token
      const token = this.generateToken(user.id);
      const userResponse = { ...user };
      delete (userResponse as any).password;

      this.saveAuthState(userResponse, token);

      return {
        success: true,
        user: userResponse,
        token
      };

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur'
      };
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const savedUser = localStorage.getItem(this.STORAGE_KEY);
      const savedToken = localStorage.getItem(this.TOKEN_KEY);
      
      if (!savedUser || !savedToken) return null;
      
      const user = JSON.parse(savedUser);
      
      // Vérifier si le token est valide (simplification pour le demo)
      if (this.isTokenValid(savedToken)) {
        return user;
      } else {
        this.logout();
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  async updateUserProfile(userId: string, profile: UserProfile): Promise<boolean> {
    try {
      // Trouver l'utilisateur
      const userEntry = Array.from(this.users.entries()).find(([_, user]) => user.id === userId);
      
      if (!userEntry) {
        return false;
      }

      const [email, user] = userEntry;
      user.profil = profile;
      
      this.users.set(email, user);
      this.saveUsersToStorage();

      // Mettre à jour aussi dans le localStorage de l'utilisateur connecté
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.profil = profile;
        this.saveAuthState(currentUser, localStorage.getItem(this.TOKEN_KEY) || '');
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return false;
    }
  }

  // Méthodes utilitaires privées

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateToken(userId: string): string {
    // En production, utiliser JWT avec une clé secrète
    const payload = { userId, timestamp: Date.now() };
    return btoa(JSON.stringify(payload));
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token));
      // Token valide pendant 7 jours (pour le demo)
      const isExpired = Date.now() - payload.timestamp > 7 * 24 * 60 * 60 * 1000;
      return !isExpired;
    } catch {
      return false;
    }
  }

  private hashPassword(password: string): string {
    // En production, utiliser bcrypt ou argon2
    // Ici c'est juste pour le demo
    return btoa(password + 'salt_demo');
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private saveAuthState(user: User, token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Méthodes d'administration (pour le développement)
  getAllUsers(): User[] {
    return Array.from(this.users.values()).map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  resetPassword(email: string, newPassword: string): boolean {
    const user = this.users.get(email);
    if (!user) return false;

    user.password = this.hashPassword(newPassword);
    this.users.set(email, user);
    this.saveUsersToStorage();
    return true;
  }
}

// Instance singleton
export const authService = new AuthService();