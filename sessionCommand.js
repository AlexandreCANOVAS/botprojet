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
          **:rotating_light: Lancement de session :rotating_light: **
  
          La session est en cours de lancement :battery: ,   
          Veuillez vous préparer et attendre le message de lancement. 
  
          :warning: N'oubliez pas : 
          ° Retirer vos cartes de compétences :name_badge: :map:
          ° Retirer la visée automatique :name_badge: :dart: 
          ° Mettre la boussole :white_check_mark: :compass: 
          ° Vérifier que votre chat vocal est bien actif :white_check_mark: :microphone2: 
          ° Retirer le nom au dessus des joueurs :name_badge: :video_game: 
  
          ${roleResident.toString()}  
        `);
      } catch (error) {
        console.error(error);
        message.reply('Une erreur est survenue lors de l\'envoi du message de session.');
      }
    }
  };
  