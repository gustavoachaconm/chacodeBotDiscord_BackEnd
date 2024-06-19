const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un miembro del servidor.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a expulsar.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("razón")
        .setDescription("La razón de la expulsión.")
        .setRequired(false)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("usuario");
    const reason = interaction.options.getString("razón") || "No especificada";

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return interaction.reply({
        content: "No tienes permisos para expulsar miembros.",
        ephemeral: true,
      });
    }

    if (!member) {
      return interaction.reply({
        content: "El usuario no está en el servidor.",
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: "No puedo expulsar a este usuario.",
        ephemeral: true,
      });
    }

    await member.kick(reason);

    const logChannelId = "1251180769716469812"; // Reemplaza esto con el ID del canal de logs
    const channel = interaction.guild.channels.cache.get(logChannelId);

    if (channel) {
      const embed = new EmbedBuilder()
        .setColor("#ff9900")
        .setTitle("Miembro Expulsado")
        .addFields(
          {
            name: "Usuario",
            value: `${member.user.tag} (${member.id})`,
            inline: true,
          },
          {
            name: "Moderador",
            value: `${interaction.user.tag} (${interaction.user.id})`,
            inline: true,
          },
          { name: "Razón", value: reason, inline: false },
          { name: "Fecha", value: new Date().toLocaleString(), inline: false }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }

    await interaction.reply({
      content: `El usuario ${member.user.tag} ha sido expulsado.`,
      ephemeral: true,
    });
  },
};
