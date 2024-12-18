const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberEvents', // Nom du fichier / module
  async execute(member, event) {
    console.log(`Un membre a ${event === 'add' ? 'rejoint' : 'quitté'} le serveur : ${member.user.tag}`);

    // ID du salon de bienvenue ou départ
    const channelId = '1057681686017605692'; // Remplace cet ID par le bon

    // Récupère le salon
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) {
      console.error("Le salon n'a pas été trouvé.");
      return;
    }

    // Créer l'Embed de bienvenue ou départ
    let embed;
    if (event === 'add') {
      embed = new EmbedBuilder()
        .setColor('#c04e3c') // Une couleur rouge chaude dans le style Red Dead Redemption
        .setTitle('🤠 **Bienvenue dans l’Ouest, cowboy !**')
        .setDescription(`
          **Bienvenue, aventurier <@${member.id}> !** 🌵  
          Tu viens de rejoindre notre univers western où l'aventure t'attend à chaque coin de rue. Prépare-toi à vivre une épopée épique où tes choix feront toute la différence. 🔥

          **🚨 Voici les premières étapes importantes :**  
          - Prends exemple dans le salon <#1057681687401738330> pour ta candidature.  
          - Poste ta candidature dans <#1316680611045314570>.  
          - Si tu as des questions, n'hésite pas à passer par <#1316680656662564925>.

          **⚔️ Bonne chance et à bientôt dans l’Ouest, cowboy !**
        `)
        .setThumbnail(member.user.displayAvatarURL()) // Utilisation de la photo de profil du membre
        .setFooter({
          text: 'Wolf RP - V2 | Prépare-toi à la vie sauvage',
          iconURL: 'https://example.com/icon-wolf.png', // Une icône qui pourrait être utilisée ici
        })
        .setTimestamp()
        .setAuthor({
          name: `${member.user.tag}`,
          iconURL: member.user.displayAvatarURL(),
        });
    } else if (event === 'remove') {
      embed = new EmbedBuilder()
        .setColor('#c04e3c') // Une couleur rouge chaude pour rester dans l'ambiance Red Dead Redemption
        .setTitle('🤠 **Adieu, cowboy !**')
        .setDescription(`
          **Adieu, <@${member.id}>...** 🌵  
          Tu as quitté notre communauté western. L’aventure continue, mais ton voyage se termine ici. 🔥

          **🚨 Rappels :**  
          - Tu peux toujours revenir pour recommencer l'aventure.  
          - La porte de l’Ouest est toujours ouverte pour toi.

          **⚔️ Que ton chemin soit semé de succès, cowboy !**
        `)
        .setThumbnail(member.user.displayAvatarURL()) // Utilisation de la photo de profil du membre
        .setFooter({
          text: 'Wolf RP - V2 | L’Ouest t’attend...',
          iconURL: 'https://example.com/icon-wolf.png',
        })
        .setTimestamp()
        .setAuthor({
          name: `${member.user.tag}`,
          iconURL: member.user.displayAvatarURL(),
        });
    }

    // Envoi du message de bienvenue ou départ
    try {
      await channel.send({
        content: `<@${member.id}>`, // Mention du membre
        embeds: [embed],
      });
      console.log(`${event === 'add' ? 'Message de bienvenue' : 'Message de départ'} envoyé !`);
    } catch (error) {
      console.error(`Erreur lors de l'envoi du message de ${event === 'add' ? 'bienvenue' : 'départ'} :`, error);
    }

    // Liste des rôles à ajouter (pour l'événement "add" uniquement)
    if (event === 'add') {
      const roleIds = [
        '1059794759293599754', // Rôle Immigré
        '1059816555053076560', // Rôle Couteau
        '1059817374045450240', // Rôle Lasso
        '1059817380320116756', // Rôle Lampe
        '1059794852491034636', // Rôle Cattleman
      ];

      // Vérification des rôles et ajout au membre
      roleIds.forEach(async (roleId) => {
        const role = member.guild.roles.cache.get(roleId);
        if (role) {
          try {
            // Vérification si le rôle est déjà ajouté
            if (!member.roles.cache.has(role.id)) {
              await member.roles.add(role);
              console.log(`Rôle ${role.name} ajouté à ${member.user.tag}`);
            } else {
              console.log(`Le rôle ${role.name} est déjà ajouté à ${member.user.tag}`);
            }
          } catch (error) {
            console.error(`Erreur lors de l'ajout du rôle ${role.name} :`, error);
          }
        } else {
          console.error(`Rôle avec l'ID ${roleId} introuvable`);
        }
      });
    }
  },
};
