module.exports = {
    name: 'session',
    description: 'Lance une session avec un message automatique dans le salon.',
    async execute(message) {
      // Vérifie si le rôle "🏠| Résident" existe
      const roleResident = message.guild.roles.cache.find(role => role.name === '🏠| Résident');
      if (!roleResident) {
        return message.reply('Le rôle "🏠| Résident" est introuvable sur ce serveur.');
      }
  
      // Mentionne tous les membres avec le rôle "🏠| Résident"
      try {
        await message.channel.send(`
          **Lancement de session**
  
          La session est en cours de lancement,   
          Veuillez vous préparer et attendre le message de lancement. 
  
          N'oubliez pas : 
          ° Retirer vos cartes de compétences
          ° Retirer la visée automatique
          ° Mettre la boussole 
          ° Vérifier que votre chat vocal est bien actif
          ° Retirer le nom au dessus des joueurs
  
          ${roleResident.toString()}  
        `);
      } catch (error) {
        console.error(error);
        message.reply('Une erreur est survenue lors de l\'envoi du message de session.');
      }
    }
  };
  