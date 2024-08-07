/**
 * @file Interaction
 * @description Handles slash command interactions
 * @module HibikiInteractionEvent
 */

import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

import { HibikiEvent } from "../classes/Event.js";
import { logger } from "../utils/logger.js";

export class HibikiInteractionEvent extends HibikiEvent {
  events: HibikiEventEmitter[] = ["interactionCreate"];

  public async run(_event: HibikiEventEmitter, interaction: ChatInputCommandInteraction) {
    if (!interaction || !interaction.isCommand() || !interaction.isChatInputCommand()) return;

    // Finds the command
    const command = this.bot.commands.find((c) => c.name === interaction.commandName);
    if (!command) return;

    // Gets the user's locale
    let locale = this.bot.config.defaultLocale;
    const userLocale = await this.bot.localeSystem.getUserLocale(interaction.user.id, this.bot);
    if (userLocale) locale = userLocale;
    else if (!userLocale) locale = this.bot.config.defaultLocale;

    // Wrapper for getLocaleFunction();
    const getStringFunction = this.bot.localeSystem.getLocaleFunction(locale);
    interaction.getString = getStringFunction;

    try {
      // Runs the command
      await interaction.deferReply({
        ephemeral: command.ephemeral,
      });
      await command.runWithInteraction?.(interaction);
    } catch (error) {
      logger.error(`An error occured running the command ${command.name}\n${(error as Error).stack}`);
      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("An error occured running the command\n```" + (error as Error).stack + "```")
            .setColor(this.bot.config.colours.error),
        ],
      });
    }
  }
}
