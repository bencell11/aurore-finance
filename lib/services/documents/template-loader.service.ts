/**
 * Service de chargement et validation des templates
 */

import { DocumentTemplate } from '@/lib/types/document-templates';
import { promises as fs } from 'fs';
import path from 'path';
import { factureTemplate } from './facture-template';

export class TemplateLoaderService {
  private static templateCache: Map<string, DocumentTemplate> = new Map();
  private static readonly TEMPLATES_DIR = path.join(process.cwd(), 'lib', 'templates');

  /**
   * Charge un template par son ID
   */
  static async loadTemplate(templateId: string): Promise<DocumentTemplate> {
    // Vérifier le cache
    if (this.templateCache.has(templateId)) {
      return this.templateCache.get(templateId)!;
    }

    // Templates statiques importés (TypeScript)
    if (templateId === 'facture_professionnelle_suisse') {
      this.templateCache.set(templateId, factureTemplate);
      console.log(`[TemplateLoader] Template loaded from static import: ${templateId}`);
      return factureTemplate;
    }

    try {
      // Chercher dans les différents répertoires
      const categories = ['resiliation', 'reclamation', 'administratif'];

      for (const category of categories) {
        const filePath = path.join(this.TEMPLATES_DIR, category, `${templateId}.json`);

        try {
          const fileContent = await fs.readFile(filePath, 'utf-8');
          const template: DocumentTemplate = JSON.parse(fileContent);

          // Valider le template
          this.validateTemplate(template);

          // Mettre en cache
          this.templateCache.set(templateId, template);

          console.log(`[TemplateLoader] Template loaded: ${templateId}`);
          return template;
        } catch (err) {
          // Fichier non trouvé dans cette catégorie, continuer
          continue;
        }
      }

      throw new Error(`Template not found: ${templateId}`);
    } catch (error) {
      console.error(`[TemplateLoader] Error loading template ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Liste tous les templates disponibles
   */
  static async listAllTemplates(): Promise<DocumentTemplate[]> {
    try {
      const templates: DocumentTemplate[] = [];
      const categories = ['resiliation', 'reclamation', 'administratif'];

      for (const category of categories) {
        const categoryPath = path.join(this.TEMPLATES_DIR, category);

        try {
          const files = await fs.readdir(categoryPath);

          for (const file of files) {
            if (file.endsWith('.json')) {
              const filePath = path.join(categoryPath, file);
              const fileContent = await fs.readFile(filePath, 'utf-8');
              const template: DocumentTemplate = JSON.parse(fileContent);
              templates.push(template);
            }
          }
        } catch (err) {
          // Répertoire n'existe pas, continuer
          console.warn(`[TemplateLoader] Category ${category} not found`);
        }
      }

      return templates;
    } catch (error) {
      console.error('[TemplateLoader] Error listing templates:', error);
      return [];
    }
  }

  /**
   * Valide un template
   */
  private static validateTemplate(template: DocumentTemplate): void {
    if (!template.id || !template.type || !template.title) {
      throw new Error('Template missing required fields: id, type, or title');
    }

    if (!template.requiredFields || template.requiredFields.length === 0) {
      throw new Error('Template must have at least one required field');
    }

    if (!template.contentBlocks || template.contentBlocks.length === 0) {
      throw new Error('Template must have at least one content block');
    }

    // Vérifier que toutes les variables dans contentBlocks sont définies dans requiredFields ou optionalFields
    const definedFields = new Set([
      ...template.requiredFields.map(f => f.key),
      ...(template.optionalFields?.map(f => f.key) || []),
      'date_envoi' // Champ système toujours disponible
    ]);

    for (const block of template.contentBlocks) {
      const variables = this.extractVariables(block.content);

      for (const variable of variables) {
        if (!definedFields.has(variable)) {
          console.warn(`[TemplateLoader] Warning: Variable {{${variable}}} not defined in template ${template.id}`);
        }
      }
    }
  }

  /**
   * Extrait les variables d'un texte
   */
  private static extractVariables(text: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      variables.push(match[1].trim());
    }

    return variables;
  }

  /**
   * Recherche de templates par type ou catégorie
   */
  static async searchTemplates(query: {
    type?: string;
    category?: string;
    language?: string;
  }): Promise<DocumentTemplate[]> {
    const allTemplates = await this.listAllTemplates();

    return allTemplates.filter(template => {
      if (query.type && template.type !== query.type) return false;
      if (query.category && template.category !== query.category) return false;
      if (query.language && template.metadata.language !== query.language) return false;
      return true;
    });
  }

  /**
   * Vide le cache (utile pour le développement)
   */
  static clearCache(): void {
    this.templateCache.clear();
    console.log('[TemplateLoader] Cache cleared');
  }
}
