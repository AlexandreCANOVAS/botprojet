// clotureCommand.js

module.exports = {
    name: 'clôture',
    description: 'Clôture une session et affiche la durée.',
    async execute(message) {
      try {
        // Vérifie si l'auteur du message a le rôle "🏠| Résident"
        const roleResident = message.guild.roles.cache.find(role => role.name === '🏠| Résident');
        if (!roleResident || !message.member.roles.cache.has(roleResident.id)) {
          return message.reply("Vous devez avoir le rôle `🏠| Résident` pour clôturer une session.");
        }
  
        // Vérifie si l'heure de début est disponible
        if (!global.sessionStartTime) {
          return message.reply("Aucune session n'a été lancée.");
        }
  
        const endTime = Date.now();
        const durationMs = endTime - global.sessionStartTime; // Différence en millisecondes
  
        // Calcule la durée en heures, minutes, secondes
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  
        // Formate la durée
        const durationString = `${durationHours}h ${durationMinutes}m ${durationSeconds}s`;
  
        // Message de clôture avec la durée de la session
        const closureMessage = `**FIN DE SESSION**
  
        Durée de la session : **${durationString}**
  
        Veuillez terminer vos scènes en cours. ❤️
  
        Merci d'avoir été présent ! On se retrouve vite demain ou derrière vos claviers ! 📝
  
        <@&${roleResident.id}>`; // Mention du rôle globalement
        
        // Envoie le message dans le salon
        await message.channel.send(closureMessage);
  
        // Supprime le message de commande
        await message.delete(); // Efface le message contenant la commande
  
        // Supprime la variable de début de session après la clôture
        delete global.sessionStartTime;
      } catch (error) {
        console.error(error);
        message.reply("Une erreur est survenue lors de la clôture de la session.");
      }
    }
  };
  