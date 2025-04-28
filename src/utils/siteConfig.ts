import configData from '../config/site.config.json';

/**
 * Configuration utility for accessing site settings
 */
export class SiteConfig {
  private static instance: SiteConfig;
  private config: any;

  private constructor() {
    this.config = configData;
    this.processTemplateStrings();
  }

  /**
   * Gets the singleton instance of SiteConfig
   */
  public static getInstance(): SiteConfig {
    if (!SiteConfig.instance) {
      SiteConfig.instance = new SiteConfig();
    }
    return SiteConfig.instance;
  }

  /**
   * Process template strings in the config that reference other config values
   * e.g., "{site.companyName}" gets replaced with the actual company name
   */
  private processTemplateStrings(): void {
    const stringifyConfig = JSON.stringify(this.config);
    const processedConfig = stringifyConfig.replace(
      /{([a-zA-Z0-9._]+)}/g,
      (match, path) => {
        const value = path.split('.').reduce((obj: any, key: string) => {
          return obj?.[key];
        }, this.config);
        return value || match;
      }
    );
    this.config = JSON.parse(processedConfig);
  }

  /**
   * Get a configuration value by path
   * @param path Dot notation path to the config value (e.g., "site.title")
   * @param defaultValue Default value if path doesn't exist
   */
  public get(path: string, defaultValue: any = null): any {
    const value = path.split('.').reduce((obj: any, key: string) => {
      return obj?.[key];
    }, this.config);
    
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Get the entire configuration object
   */
  public getAll(): any {
    return this.config;
  }
}

/**
 * Helper function to get site config
 */
export const getSiteConfig = () => SiteConfig.getInstance();

export default getSiteConfig;
