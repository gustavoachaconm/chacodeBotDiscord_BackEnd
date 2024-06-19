const { EmbedBuilder } = require("discord.js");
const { BannedUser } = require("../models/bannedUsers");

module.exports = {
  name: "guildMemberRemove",
  execute(member) {
    const channelId = "1250929632384127057"; // Reemplaza con el ID de tu canal
    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) return;

    // Retraso de 5 segundos (5000 milisegundos)
    setTimeout(async () => {
      try {
        // Verificar si el usuario está baneado temporalmente
        const bannedUser = await BannedUser.findOne({
          userId: member.id,
          guildId: member.guild.id,
        });

        if (!bannedUser) {
          // Si no está baneado, enviar mensaje de despedida
          const embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle(`¡Adiós, ${member.user.tag}!`)
            .setDescription(`Lamentamos verte partir, ${member.user.username}.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({
              text: "Esperamos verte de nuevo",
              iconURL: "https://example.com/logo.png",
            });

          channel.send({ embeds: [embed] });
        }
      } catch (err) {
        console.error("Error al verificar usuario baneado:", err);
      }
    }, 2000); // Retraso de 5 segundos (5000 milisegundos)
  },
};
