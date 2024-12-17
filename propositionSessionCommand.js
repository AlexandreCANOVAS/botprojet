module.exports = {
    name: 'proposition session',
    description: 'Envoie un message automatique pour proposer une session avec une date et une heure spécifiées, puis supprime la commande de l\'utilisateur.',
    async execute(message) {
      // Vérifie si le rôle "🏠| Résident" existe
      const roleResident = message.guild.roles.cache.find(role => role.name === '🏠| Résident');
      if (!roleResident) {
        return message.reply('Le rôle "🏠| Résident" est introuvable sur ce serveur.');
      }
  
      // Vérifie si la commande contient une date et une heure
      const args = message.content.trim().split(/\s+/).slice(2);  // Extrait tout après la commande
      const date = args[0];  // La première partie est la date
      const time = args[1];   // La deuxième partie est l'heure
  
      // Si la date et l'heure ne sont pas fournies, retourne un message d'erreur
      if (!date || !time) {
        return message.reply('Veuillez spécifier une date et une heure pour la session (ex : `-proposition session 2024-12-20 15:00`).');
      }
  
      // Validation du format de la date (yyyy-mm-dd)
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;  // Vérifie si la date est au format yyyy-mm-dd
      if (!datePattern.test(date)) {
        return message.reply('Le format de la date est invalide. Veuillez utiliser le format `yyyy-mm-dd`.');
      }
  
      // Rassembler la date et l'heure pour obtenir un objet Date complet en UTC
      const fullDate = new Date(`${date}T${time}:00`);  // Crée un objet Date en fonction de la date et l'heure locales
      const timestamp = Math.floor(fullDate.getTime() / 1000);  // Convertit la date en timestamp UNIX (secondes)
  
      try {
        // Envoie le message avec la mention du rôle et la date/heure en format Discord
        await message.channel.send(`
          Bonjour à tous,
  
          Prochaine session le <t:${timestamp}:f>.
  
          ✅️: Présent
          ❌️: Absent
          ❔️: Peut-être
          ⏳️: En retard
  
          Merci de voter selon votre choix et modifier le vote si changement.
  
          ${roleResident}  
        `);
  
        // Supprime le message de l'utilisateur (-proposition session)
        await message.delete();
  
      } catch (error) {
        console.error(error);
        message.reply('Une erreur est survenue lors de l\'envoi du message de proposition de session.');
      }
    }
  };
  