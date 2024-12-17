const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');  // Pour analyser le HTML

module.exports = {
  // Fonction pour récupérer l'image du lien
  getImageFromURL: async (url) => {
    try {
      // Effectuer une requête HTTP pour récupérer les métadonnées de la page
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Extraire l'image via la balise Open Graph (og:image)
      const imageURL = $("meta[property='og:image']").attr('content');
      if (imageURL) {
        return imageURL;  // Retourne l'URL de l'image
      } else {
        console.log('Aucune image Open Graph trouvée, utilisation de l\'image par défaut');
        return 'https://top-serveurs.net/img/vote.png';  // Utiliser une image par défaut si aucune image n'est trouvée
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'image du lien:', error);
      return 'https://top-serveurs.net/img/vote.png';  // Image par défaut en cas d\'erreur
    }
  },

  // Fonction pour envoyer le message avec l'embed et le bouton
  sendVoteMessage: async (client) => {
    // URL pour le vote
    const voteURL = 'https://top-serveurs.net/rdr/vote/wolf-rp-v2';

    // Récupérer l'image associée à l'URL de vote
    const imageURL = await module.exports.getImageFromURL(voteURL);

    // Récupérer le salon "top-serveur" où le message sera envoyé
    const channel = client.channels.cache.find(ch => ch.name === '『📢』𝘛𝘰𝘱-𝘴𝘦𝘳𝘷𝘦𝘶𝘳');
    
    // Si le salon n'est pas trouvé, on log l'erreur et on retourne
    if (!channel) {
      console.error('Le salon "top-serveur" n\'a pas été trouvé.');
      return;
    }

    // Trouver le rôle "Résident" par son nom
    const role = channel.guild.roles.cache.find(r => r.name === 'Résident');

    if (!role) {
      console.error('Le rôle "Résident" n\'a pas été trouvé.');
      return;
    }

    // Mentionner le rôle via son ID
    const roleMention = `<@&${role.id}>`;  // Syntaxe pour mentionner un rôle par ID

    // Création de l'embed avec le message
    const embed = new EmbedBuilder()
      .setColor('#FF4500')
      .setTitle('VOTE POUR TON TOP SERVEUR FAVORIS')
      .setDescription(
        `Vous pouvez voter pour soutenir le serveur et notre travail !\n\n` +
        `Plus nous avons de votes et plus nous avons de membres ! ❤️\n\n` +
        `Merci à vous ! 🥳\n\n` +
        `Lien pour voter : ${voteURL}\n\n` +
        `🏠| ${roleMention}`  // Mentionner le rôle avec l'emoji devant
      )
      .setImage(imageURL)  // Ajouter l'image récupérée à l'embed
      .setTimestamp();

    // Création du bouton pour le vote
    const button = new ButtonBuilder()
      .setLabel('📋 Voter maintenant')  // Utilisation de l'emoji Unicode 📋 directement
      .setStyle(ButtonStyle.Link)
      .setURL(voteURL);

    // Création de l'ActionRow pour ajouter le bouton
    const row = new ActionRowBuilder().addComponents(button);

    try {
      // Envoi du message avec l'embed et le bouton
      await channel.send({
        embeds: [embed],
        components: [row],  // Ajouter l'ActionRow avec le bouton
        disableMentions: 'all'  // Cette option permet d'éviter que les mentions perturbent l'embed
      });
      console.log('Message envoyé dans le salon "top-serveur".');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message dans le salon "top-serveur":', error);
    }
  },

  // Fonction pour démarrer l'envoi récurrent du message toutes les 2 heures entre 08h et 22h
  startRecurringMessages: (client) => {
    setInterval(() => {
      const currentHour = new Date().getHours();  // Récupérer l'heure actuelle
      console.log(`Heure actuelle : ${currentHour}h`);

      // Vérifier si l'heure est entre 8h et 22h
      if (currentHour >= 8 && currentHour <= 22) {
        console.log('Envoi du message - Heure valide (entre 8h et 22h)');
        module.exports.sendVoteMessage(client);
      } else {
        console.log('Heure non valide - En dehors de l\'intervalle 8h-22h');
      }
    }, 2 * 60 * 60 * 1000);  // Envoi du message toutes les 2 heures (2h = 7200000 ms)
  },
};
