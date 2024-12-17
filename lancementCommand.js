module.exports = {
    name: 'lancement',
    description: 'Envoie un message automatique pour annoncer le lancement de la session avec mention du rôle "🏠| Résident" et mentionne la personne qui lance la session.',
    async execute(message) {
      // Vérifie si le rôle "🏠| Résident" existe
      const roleResident = message.guild.roles.cache.find(role => role.name === '🏠| Résident');
      if (!roleResident) {
        return message.reply('Le rôle "🏠| Résident" est introuvable sur ce serveur.');
      }
  
      // Vérifie si la commande contient un mention de l'utilisateur
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser) {
        return message.reply('Veuillez mentionner l\'utilisateur qui lance la session.');
      }
  
      try {
        // Envoie le message avec la mention du rôle et de l'utilisateur
        await message.channel.send(`
          **SESSION LANCÉE**
  
          La session est lancée !
  
          Vous pouvez maintenant rejoindre le lanceur : 
  
          ${mentionedUser}
  
          Bonne session à tous ! 🏇
  
          ${roleResident}  
        `);
  
        // Supprime le message de l'utilisateur (-lancement)
        await message.delete();
        
      } catch (error) {
        console.error(error);
        message.reply('Une erreur est survenue lors de l\'envoi du message de lancement de session.');
      }
    }
  };
  