const { SlashCommandBuilder } = require("@discordjs/builders");

// Función para obtener el emoji personalizado por su ID
function getEmoji(redSocial) {
  switch (redSocial) {
    case "instagram":
      return "<:instagram:1252436410686771243>"; // Reemplaza ID_DEL_EMOJI_INSTAGRAM con el ID real del emoji de Instagram
    case "facebook":
      return "<:facebook:1252432729467785226>"; // Reemplaza ID_DEL_EMOJI_FACEBOOK con el ID real del emoji de Facebook
    case "twitter":
      return "<:twitter:1252436232210878484>";
    case "tiktok":
      return "<:tiktok:1252433890325561375>"; // Reemplaza ID_DEL_EMOJI_TWITTER con el ID real del emoji de Twitter
    default:
      return ""; // En caso de que no haya emoji definido para la red social seleccionada
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anuncioredes")
    .setDescription("Crea un anuncio en Discord para redes sociales.")
    .addStringOption((option) =>
      option
        .setName("redsocial")
        .setDescription("Selecciona la red social para el anuncio.")
        .setRequired(true)
        .addChoices([
          { name: "Instagram", value: "instagram" },
          { name: "Facebook", value: "facebook" },
          { name: "Twitter", value: "twitter" },
          { name: "Tiktok", value: "tiktok" },
        ])
    )
    .addStringOption((option) =>
      option
        .setName("enlace")
        .setDescription("Proporciona el enlace de la publicación.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const redSocial = interaction.options.getString("redsocial");
    const enlace = interaction.options.getString("enlace");

    if (redSocial && enlace) {
      const embed = {
        color: parseInt("0099ff", 16),
        description: `${getEmoji(
          redSocial
        )} ¡He publicado en ${redSocial} nuevo contenido!\n${enlace}`,
        timestamp: new Date(),
      };

      const canal = await interaction.client.channels.fetch(
        "1250883058698162308"
      );
      await canal.send({ embeds: [embed] });

      await interaction.reply(
        "Anuncio enviado con éxito al canal especificado."
      );
    } else {
      await interaction.reply(
        "Por favor, proporciona la red social y el enlace de la publicación."
      );
    }
  },
};
