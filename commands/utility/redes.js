const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("redes")
    .setDescription("Muestra las redes sociales de Gustavo Chacón"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Instagram")
        .setURL("https://www.instagram.com/gustavoachaconm")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel("TikTok")
        .setURL("https://www.tiktok.com/@gustavoachaconm")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel("GitHub")
        .setURL("https://github.com/gustavoachaconm")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel("Twitter")
        .setURL("https://twitter.com/gustavoachaconm")
        .setStyle(ButtonStyle.Link)
    );

    await interaction.reply({
      content: "Sigue a Gustavo Chacón en sus redes sociales:",
      components: [row],
    });
  },
};
