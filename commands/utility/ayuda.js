const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ayuda")
    .setDescription("Obtén ayuda 📖"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Lista de Comandos 📝")
      .setDescription("Comandos de ChacodeBot")
      .addFields(
        {
          name: "» Categorías",
          value:
            "Animales Anime Clubs\nConfig Cumpleaños Diversión\nEventos Economía Gestión\nInfo Matrimonios Moderación\nMúsica NSFW Mascotas\nRoleplay Servidor Usuario\nUtilidades",
        },
        {
          name: "» Enlaces útiles",
          value:
            "[Web](https://chacode.net) | [Wiki](https://example.com) | [Privacidad](https://example.com) | [Soporte](https://example.com)",
        }
      )
      .setFooter({
        text: "© Gustavo Chacon",
        iconURL: "https://example.com/logo.png",
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("categorias")
        .setLabel("Categorías")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setLabel("Mirar en la página web")
        .setURL("https://example.com")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setCustomId("cerrar")
        .setLabel("Cerrar")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
