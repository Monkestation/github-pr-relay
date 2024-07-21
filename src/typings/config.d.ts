/**
 * @file Config
 * @description Typings for a valid Hibiki config file
 * @typedef config
 */

type PrivateClientOptions = import("discord.js").ClientOptions;

interface HibikiConfig {
  // A Discord bot token to login with
  token: string;

  githubToken: string;

  githubManagerConfig: {
    guildId: string;
    forumId: string;
    // Example: blahlbah/myrepo
    repoString: string;
  };

  // The default locale to use
  defaultLocale: HibikiLocaleCode;

  // An object of Discord.js Client options
  clientOptions?: PrivateClientOptions | Record<string, unknown>;

  // An object of valid hex colours
  colours: HibikiColourOptions;
}

// Valid config.colours options
type HibikiColourOptions = {
  // Indexing type
  [key: string]: number;

  // Primary hex colour
  primary: number;

  // Secondary hex colour
  secondary: number;

  // Error hex colour
  error: number;

  // Success hex colour
  success: number;

  // Warning hex colour
  warning: number;
};
