const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Desbanea a un usuario del servidor.")
    .addStringOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a desbanear (ID).")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("razón")
        .setDescription("La razón del desbaneo.")
        .setRequired(false)
    ),
  async execute(interaction) {
    const userId = interaction.options.getString("usuario");
    const reason = interaction.options.getString("razón") || "No especificada";

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return interaction.reply({
        content: "No tienes permisos para desbanear miembros.",
        ephemeral: true,
      });
    }

    try {
      const bannedUsers = await interaction.guild.bans.fetch();
      const bannedUser = bannedUsers.find((user) => user.user.id === userId);

      if (!bannedUser) {
        return interaction.reply({
          content: "No se encontró ningún usuario baneado con ese ID.",
          ephemeral: true,
        });
      }

      await interaction.guild.members.unban(bannedUser.user, reason);

      const logChannelId = "1251180769716469812"; // Reemplaza con el ID del canal de logs
      const channel = interaction.guild.channels.cache.get(logChannelId);

      if (channel) {
        const embed = new EmbedBuilder()
          .setColor("#00ff00")
          .setTitle("Usuario Desbaneado")
          .addFields(
            {
              name: "Usuario",
              value: `${bannedUser.user.tag} (${bannedUser.user.id})`,
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
          .setThumbnail(bannedUser.user.displayAvatarURL({ dynamic: true }))
          .setTimestamp();

        channel.send({ embeds: [embed] });
      }

      await interaction.reply({
        content: `El usuario ${bannedUser.user.tag} ha sido desbaneado.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "Ocurrió un error al intentar desbanear al usuario.",
        ephemeral: true,
      });
    }
  },
};
