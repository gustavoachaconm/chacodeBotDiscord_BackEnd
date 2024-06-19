const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { BannedUser } = require("../../models/bannedUsers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un miembro del servidor permanentemente.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a banear.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("razón")
        .setDescription("La razón del baneo.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("enviar-mensaje")
        .setDescription("Enviar un mensaje privado al usuario baneado.")
        .setRequired(false)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("usuario");
    const reason = interaction.options.getString("razón") || "No especificada";
    const sendPrivateMessage = interaction.options.getBoolean("enviar-mensaje");

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return interaction.reply({
        content: "No tienes permisos para banear miembros.",
        ephemeral: true,
      });
    }

    if (!member) {
      return interaction.reply({
        content: "El usuario no está en el servidor.",
        ephemeral: true,
      });
    }

    if (!member.bannable) {
      return interaction.reply({
        content: "No puedo banear a este usuario.",
        ephemeral: true,
      });
    }

    // Enviar mensaje privado al usuario baneado
    if (sendPrivateMessage) {
      try {
        const embedPrivateMessage = new EmbedBuilder()
          .setColor("#ff0000")
          .setTitle("Has sido baneado")
          .setDescription(
            `Has sido baneado permanentemente en **${interaction.guild.name}**.`
          )
          .addFields({ name: "Razón", value: reason, inline: false })
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setTimestamp();

        await member.send({ embeds: [embedPrivateMessage] });
      } catch (err) {
        console.error(
          "Error al enviar mensaje privado al usuario baneado:",
          err
        );
      }
    }

    await member.ban({ reason });

    // Guardar el baneo en la base de datos
    await BannedUser.create({
      userId: member.id,
      userName: member.user.username,
      guildId: interaction.guild.id,
      guildName: interaction.guild.name,
      banType: "PERM",
      reason,
    });

    // Mensaje de log en el canal de logs
    const logChannelId = "1251180769716469812"; // ID del canal de logs
    const channel = interaction.guild.channels.cache.get(logChannelId);
    if (channel) {
      const embedLog = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Usuario Baneado Permanentemente")
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
          {
            name: "Fecha",
            value: new Date().toLocaleString(),
            inline: false,
          }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      await channel.send({ embeds: [embedLog] });
    }

    // Mensaje de confirmación al moderador
    await interaction.reply({
      content: `El usuario ${member.user.tag} ha sido baneado permanentemente.`,
      ephemeral: true,
    });
  },
};
