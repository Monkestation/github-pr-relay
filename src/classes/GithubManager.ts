import { Octokit } from "@octokit/rest";
import { ChannelType, ForumChannel, Guild } from "discord.js";
import { hibikiUserAgent } from "utils/constants.js";

import { HibikiClient } from "./Client.js";

export class GithubManager {
  private bot: HibikiClient;

  private octokit: Octokit;

  repoOwner: string;
  repo: string;

  forumChannel?: ForumChannel;
  guild?: Guild;

  /**
   *
   * @param bot Hibiki client
   * @param repo Repository path, example: Blahblah/my-repo
   */
  constructor(bot: HibikiClient, repo: string) {
    this.bot = bot;

    this.repoOwner = repo.split("/")[0];
    this.repo = repo.split("/")[1];

    this.octokit = new Octokit({
      userAgent: hibikiUserAgent,
    });
  }

  public init(config: { guildId: string; forumId: string }) {
    // Resolve the guild!
    const guild = this.bot.guilds.resolve(config.guildId);
    if (!guild) throw new Error("Failed to resolve guild " + config.guildId + "!");

    const forum = guild.channels.resolve(config.forumId);

    if (!forum) throw new Error("Failed to resolve forum channel " + config.forumId + "!");
    if (forum.type !== ChannelType.GuildForum) throw new Error("The channel " + forum.name + "is NOT a forum channel!");

    this.guild = guild;
    this.forumChannel = forum;
  }
}
