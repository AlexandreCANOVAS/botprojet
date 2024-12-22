const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function sendTicketMessage(channel) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('Créer un ticket')
      .setStyle(ButtonStyle.Primary)  // Utilisation de ButtonStyle.Primary
  );

  // Envoi du message avec le bouton dans le canal
  await channel.send({
    content: 'Cliquez sur le bouton ci-dessous pour créer un ticket.',
    components: [row]  // Envoie l'ActionRow avec le bouton
  });
}

module.exports = { sendTicketMessage };
