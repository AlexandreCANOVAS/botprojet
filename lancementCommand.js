// lancementCommand.js

module.exports = {
    name: 'lancement',
    description: 'Lance une session avec une mention du rôle Résident et l\'heure de lancement.',
    async execute(message) {
      try {
        // Vérifie si l'auteur du message a le rôle "🏠| Résident"
        const roleResident = message.guild.roles.cache.find(role => role.name === '🏠| Résident');
        if (!roleResident || !message.member.roles.cache.has(roleResident.id)) {
          return message.reply("Vous devez avoir le rôle `🏠| Résident` pour lancer une session.");
        }
  
        // Stocke l'heure de début de la session dans un objet global (peut être amélioré)
        const startTime = Date.now();
        global.sessionStartTime = startTime; // Enregistre l'heure de début
  
        // Mentionne le rôle et le lanceur
        const launchMessage = `**SESSION LANCÉE**
  
        La session est lancée !
  
        Vous pouvez maintenant rejoindre le lanceur : 
  
        ${message.author}
  
        Bonne session à tous ! 🏇
        
        <@&${roleResident.id}>`; // Mention du rôle globalement
        
        // Envoie le message dans le salon
        await message.channel.send(launchMessage);
  
        // Supprime le message de commande
        await message.delete(); // Efface le message contenant la commande
      } catch (error) {
        console.error(error);
        message.reply("Une erreur est survenue lors du lancement de la session.");
      }
    }
  };
  