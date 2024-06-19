const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const channelId = "1250928688619589682";
    const roleId = "1252424745710915604";

    const channel = member.guild.channels.cache.get(channelId);
    const role = member.guild.roles.cache.get(roleId);

    if (!channel) return;
    if (!role) return;

    try {
      await member.roles.add(role);
    } catch (error) {
      console.error(`No se pudo asignar el rol: ${error}`);
      return;
    }

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`¡Bienvenid@ al servidor, ${member.user.tag}!`)
      .setDescription(
        `¡Esperamos que disfrutes tu estancia aquí, ${member.user.username}!`
      )
      .addFields(
        {
          name: "Fecha de unión:",
          value: member.joinedAt.toLocaleDateString(),
          inline: true,
        },
        {
          name: "Miembro #:",
          value: `${member.guild.memberCount}`,
          inline: true,
        }
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({
        text: "Gracias por unirte",
        iconURL: "https://example.com/logo.png",
      });

    channel.send({ embeds: [embed] });
  },
};
