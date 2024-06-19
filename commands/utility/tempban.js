const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const ms = require("ms");
const { BannedUser } = require("../../models/bannedUsers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Banea a un miembro del servidor temporalmente.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a banear.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duración")
        .setDescription("La duración del baneo (ej. 1d, 2h, 30m).")
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
    const duration = interaction.options.getString("duración");
    const reason = interaction.options.getString("razón") || "No especificada";
    const durationMs = ms(duration);
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
          .setDescription(`Has sido baneado en **${interaction.guild.name}**.`)
          .addFields(
            { name: "Razón", value: reason, inline: false },
            { name: "Duración", value: duration || "Permanente", inline: false }
          )
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

    const unbanTime = Date.now() + durationMs;

    // Guardar el baneo temporal en la base de datos
    await BannedUser.create({
      userId: member.id,
      userName: member.user.username,
      guildId: interaction.guild.id,
      guildName: interaction.guild.name,
      banType: "TEMP",
      unbanTime,
      reason,
    });

    setTimeout(async () => {
      try {
        await interaction.guild.members.unban(member.id);
        console.log(`Usuario ${member.user.tag} desbaneado automáticamente.`);

        // Enviar mensaje privado al usuario desbaneado
        if (sendPrivateMessage) {
          try {
            const embedUnbanMessage = new EmbedBuilder()
              .setColor("#00ff00")
              .setTitle("Has sido desbaneado")
              .setDescription(
                `Has sido desbaneado en **${interaction.guild.name}**.`
              )
              .addFields({ name: "Razón", value: reason })
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
              .setTimestamp();

            const user = await interaction.client.users.fetch(member.id);
            await user.send({ embeds: [embedUnbanMessage] });
          } catch (err) {
            if (err.code === 50007) {
              console.error(
                `El bot no puede enviar mensajes privados al usuario ${member.user.tag} debido a la configuración de privacidad.`
              );
            } else {
              console.error(
                "Error al enviar mensaje privado al usuario desbaneado:",
                err
              );
            }
          }
        }

        // Eliminar el registro de la base de datos
        await BannedUser.deleteOne({
          userId: member.id,
          guildId: interaction.guild.id,
          banType: "TEMP",
        });

        // Mensaje de log en el canal de logs
        const logChannelId = "1251180769716469812"; // ID del canal de logs
        const channel = interaction.guild.channels.cache.get(logChannelId);
        if (channel) {
          const embedLog = new EmbedBuilder()
            .setColor("#00ff00")
            .setTitle("Usuario Desbaneado")
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
      } catch (err) {
        console.error("Error al desbanear automáticamente:", err);
      }
    }, durationMs);

    // Mensaje de confirmación al moderador
    await interaction.reply({
      content: `El usuario ${member.user.tag} ha sido baneado temporalmente.`,
      ephemeral: true,
    });
  },
};
