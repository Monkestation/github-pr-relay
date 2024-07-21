/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * @file Client
 * @description Connects to Discord and handles global functions
 */

import path from "node:path";
import url from "node:url";

import { Client, Collection, GatewayIntentBits } from "discord.js";

import { loadCommands, loadEvents, registerSlashCommands } from "../utils/loader.js";
import { logger } from "../utils/logger.js";
import type { HibikiCommand } from "./Command.js";
import type { HibikiEvent } from "./Event.js";
import { GithubManager } from "./GithubManager.js";
import { HibikiLocaleSystem } from "./LocaleSystem.js";
import type { HibikiLogger } from "./Logger.js";

// Are we being sane or not?
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// __dirname replacement in ESM
const pathDirname = path.dirname(url.fileURLToPath(import.meta.url));

// Directories to crawl
const COMMANDS_DIRECTORY = path.join(pathDirname, "../commands");
const EVENTS_DIRECTORY = path.join(pathDirname, "../events");
const LOGGERS_DIRECTORY = path.join(pathDirname, "../loggers");
const LOCALES_DIRECTORY = path.join(pathDirname, "../locales");

export class HibikiClient extends Client {
  readonly config: HibikiConfig;

  // A collection of commands
  readonly commands: Collection<string, HibikiCommand> = new Collection();

  // A collection of events
  readonly events: Collection<string, HibikiEvent> = new Collection();

  // A collection of loggers
  readonly loggers: Collection<string, HibikiLogger> = new Collection();

  // Hibiki's locale system
  readonly localeSystem: HibikiLocaleSystem;

  // Github manager
  readonly githubManager: GithubManager;

  constructor(config: HibikiConfig) {
    super({ ...config.clientOptions, intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

    this.config = config;

    this.githubManager = new GithubManager(this, this.config.githubManagerConfig.repoString);

    // Creates a new Locale System engine
    this.localeSystem = new HibikiLocaleSystem(LOCALES_DIRECTORY, this.config.defaultLocale);
  }

  /**
   * Initialises Hibiki
   */

  public init() {
    try {
      // Logs into the Discord API, I guess
      void this.login(this.config.token);

      // Wait for the initial login before loading modules
      this.once("ready", async () => {
        // Loads all commands, events, and loggers
        await loadCommands(this, COMMANDS_DIRECTORY);
        await loadEvents(this, EVENTS_DIRECTORY);
        await loadEvents(this, LOGGERS_DIRECTORY, true);

        await this.githubManager.init({
          forumId: this.config.githubManagerConfig.forumId,
          guildId: this.config.githubManagerConfig.guildId,
        });

        // Registers commands
        await registerSlashCommands(this);

        logger.info(`Logged in as ${this.user?.tag} in ${this.guilds.cache.size} guilds`);
        logger.info(`${this.commands.size} commands loaded`);
        logger.info(`${this.events.size} events loaded`);
      });
    } catch (error) {
      logger.error(`An error occured while initializing Hibiki: ${error}`);
    }
  }
}
