require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder} = require('discord.js');
const { sendTicketMessage } = require('./ticketSystem'); // Importer la fonction pour envoyer le message
const sessionCommand = require('./sessionCommand'); // Import de la commande session
const propositionSessionCommand = require('./propositionSessionCommand'); // Import de la commande proposition session
const lancementCommand = require('./lancementCommand.js');
const clotureCommand = require('./clotureCommand.js');
const voteTopServeur = require('./voteTopServeur');  // Importer la fonctionnalité de vote
const guildMemberEvents = require('../BOT-WOLF-V2-RDR/events/memberAddRemove.js');
const roleReaction = require('./roleReaction');
const acceptCommand = require('./accept'); // Import de la commande 'accepter' (dans le même répertoire)


const TOKEN = process.env.DISCORD_TOKEN; // Charge le token depuis les variables d'environnement
const PREFIX = '-'; // Préfixe pour les commandes

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,              // Permet d'interagir avec les serveurs
    GatewayIntentBits.GuildMessages,       // Permet de lire et répondre aux messages
    GatewayIntentBits.MessageContent,      // Permet de lire le contenu des messages
    GatewayIntentBits.GuildMembers,        // Permet de gérer les rôles et membres du serveur
    GatewayIntentBits.GuildMessageReactions  // Pour gérer les réactions
  ],
});

// Lors de la connexion du bot
client.once('ready', async () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);

  // Démarrer l'envoi récurrent des messages
  voteTopServeur.startRecurringMessages(client);  
  roleReaction.sendMessage(client);  // Envoie le message avec la réaction

   // Lorsque le bot est prêt, recherche le salon avec l'ID
   const guild = client.guilds.cache.get(process.env.GUILD_ID); // Remplacer par ton ID de serveur
   if (guild) {
     const channelId = '1060474992346791986';  // Remplacer par l'ID du salon 『🛎』𝘋𝘦𝘮𝘢𝘯𝘥𝘦𝘴
     const channel = await guild.channels.fetch(channelId);  // Récupère le salon par son ID
 
     if (channel && channel.isTextBased()) {  // Vérifie que c'est bien un salon textuel
       await sendTicketMessage(channel);  // Envoie le message dans ce salon
     } else {
       console.log('Le salon n\'a pas été trouvé ou ce n\'est pas un salon textuel.');
     }
   } else {
     console.log('Serveur non trouvé');
   }
});



client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

  // Création du ticket
  if (interaction.customId === 'create_ticket') {
    const member = interaction.member;
    const guild = interaction.guild;

    // Créer un salon privé pour l'utilisateur
    const channel = await guild.channels.create({
      name: `ticket-${member.user.username}`,
      type: 0,  // 0 pour un canal textuel
      parent: '1060456188413747200',  // ID de la catégorie des tickets
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['ViewChannel'],  // Empêche les autres de voir le salon
        },
        {
          id: member.id,
          allow: ['ViewChannel'],  // Permet à l'utilisateur d'accéder au salon
        },
      ],
    });

    // Créer le bouton "Fermer"
    const closeButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('🔒 Fermer le ticket')  // Ajout de l'emoji :lock: avant "Fermer le ticket"
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(closeButton);

    // Créer un embed pour le message de bienvenue
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🎫 Nouveau Ticket')
      .setDescription(`**Bienvenue <@${member.id}> !** 👋\nMerci de nous indiquer la raison de votre demande (mort RP, plainte, demande de rôle...) et de mentionner le staff pour une réponse rapide.\nNous vous répondrons dès que possible ! 🤝`)
      .setTimestamp()
      .setFooter({ text: `Ticket ouvert par ${member.user.username}`, iconURL: member.user.displayAvatarURL() });

    // Envoyer le message avec l'embed et le bouton "Fermer"
    await channel.send({
      embeds: [embed],
      components: [row],
    });

    // Réponse privée à l'utilisateur
    await interaction.reply({
      content: `Votre ticket a été créé dans le salon ${channel}.`,
      ephemeral: true,
    });

  } else if (interaction.customId === 'close_ticket') {
    // Vérification des permissions de l'utilisateur (admin requis)
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      await interaction.reply({
        content: 'Vous n\'avez pas les permissions nécessaires pour fermer ce ticket.',
        ephemeral: true,
      });
      return;
    }

    const ticketChannel = interaction.channel;

    // Création d'un menu de sélection pour choisir l'action à effectuer
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_action')
      .setPlaceholder('Choisissez une option')
      .addOptions([
        {
          label: 'Supprimer la conversation',
          value: 'delete_ticket',
          description: 'Supprime le ticket après fermeture',
        },
        {
          label: 'Sauvegarder la conversation',
          value: 'save_ticket',
          description: 'Sauvegarde le ticket dans le salon log',
        },
      ]);

    // Envoi du menu de sélection à l'utilisateur
    await interaction.reply({
      content: 'Que souhaitez-vous faire avec ce ticket ?',
      components: [
        new ActionRowBuilder().addComponents(selectMenu),
      ],
      ephemeral: true,
    });

  } else if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_action') {
    const selectedAction = interaction.values[0];
    const ticketChannel = interaction.channel;

    // Vérification des permissions d'administrateur
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      await interaction.reply({
        content: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.',
        ephemeral: true,
      });
      return;
    }

    if (selectedAction === 'delete_ticket') {
      // Suppression du salon du ticket
      await ticketChannel.delete();
      await interaction.reply({
        content: 'Le ticket a été supprimé.',
        ephemeral: true,
      });
    } else if (selectedAction === 'save_ticket') {
      // Sauvegarder le ticket dans le salon logs
      const logChannel = await interaction.guild.channels.fetch('1064643459018924083');  // ID du salon logs
      const messages = await ticketChannel.messages.fetch({ limit: 100 });

      // Créer un embed pour la sauvegarde du ticket
      const saveEmbed = new EmbedBuilder()
        .setColor('#FFD700')  // Couleur or pour la sauvegarde
        .setTitle(`Ticket sauvegardé : ${ticketChannel.name}`)
        .setDescription(`Ticket sauvegardé par <@${interaction.user.id}> \nVoici la conversation complète du ticket :  `)
        .addFields(
          {
            name: 'Messages du ticket',
            value: messages.map((msg) => `**${msg.author.username}:** ${msg.content}`).join('\n'),
          }
        )
        .setTimestamp();
      

      // Envoi du message sauvegardé dans le salon logs
      await logChannel.send({
        embeds: [saveEmbed],
      });

      // Suppression du ticket après la sauvegarde
      await ticketChannel.delete();
    } else {
      await interaction.reply({
        content: 'Action inconnue.',
        ephemeral: true,
      });
    }
  }
});

// Empêcher la suppression des messages par d'autres actions
client.on('messageCreate', (message) => {
  // Ne rien faire si le message provient d'un bot
  if (message.author.bot) return;

  // Si le message n'a pas de condition de suppression, ne rien faire
  // Par exemple, ne pas supprimer les messages dans le canal des demandes si ce n'est pas nécessaire
  console.log(`Message reçu: ${message.content}`);
});

// Écoute des événements membres
client.on('guildMemberAdd', (member) => {
  guildMemberEvents.execute(member, 'add');
});

client.on('guildMemberRemove', (member) => {
  guildMemberEvents.execute(member, 'remove');
});

// Écoute des messages entrants
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(`${PREFIX}clôture`)) {
    await clotureCommand.execute(message);
  }

  if (message.content.startsWith(`${PREFIX}lancement`)) {
    await lancementCommand.execute(message);
  }

  if (message.content.startsWith(`${PREFIX}proposition session`)) {
    propositionSessionCommand.execute(message);
  }

  // Commande acceptée
  if (message.content.startsWith(`${PREFIX}accepter`)) {
    acceptCommand.execute(message); // Appelle la fonction de la commande 'accepter'
  }

  if (message.content.startsWith(`${PREFIX}session`)) {
    sessionCommand.execute(message);
  }
});



// Connexion du bot
client.login(TOKEN);
