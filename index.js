require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const sessionCommand = require('./sessionCommand'); // Import de la commande session
const propositionSessionCommand = require('./propositionSessionCommand'); // Import de la commande proposition session
const lancementCommand = require('./lancementCommand.js');
const clotureCommand = require('./clotureCommand.js');
const voteTopServeur = require('./voteTopServeur');  // Importer la fonctionnalité de vote
const guildMemberEvents = require('../BOT-WOLF-V2-RDR/events/memberAddRemove.js');
const roleReaction = require('./roleReaction');



const TOKEN = process.env.DISCORD_TOKEN; // Charge le token depuis les variables d'environnement
const PREFIX = '-'; // Préfixe pour les commandes

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,              // Permet d'interagir avec les serveurs
    GatewayIntentBits.GuildMessages,       // Permet de lire et répondre aux messages
    GatewayIntentBits.MessageContent,      // Permet de lire le contenu des messages
    GatewayIntentBits.GuildMembers,         // Permet de gérer les rôles et membres du serveur
    GatewayIntentBits.GuildMessageReactions  // Pour gérer les réactions
  ],
});

// Lors de la connexion du bot
client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
  voteTopServeur.startRecurringMessages(client);  // Démarrer l'envoi récurrent des messages
  // Démarrer la fonctionnalité de rôle avec réaction
  roleReaction.sendMessage(client);  // Envoie le message avec la réaction
});

client.on('messageReactionAdd', async (reaction, user) => {
  try {
    // Ignorer les réactions des bots
    if (user.bot) return;

    // Vérifie si le message provient d'un serveur
    if (!reaction.message.guild) return;

    const member = await reaction.message.guild.members.fetch(user.id); // Récupère le membre dans le cache ou depuis l'API

    if (!member) {
      console.log(`Membre introuvable pour l'utilisateur ${user.tag}`);
      return;
    }


    if (reaction.emoji.name === '📝') {
      const role = reaction.message.guild.roles.cache.find(r => r.name === '📝 | RP écrit');
      if (role) {
        await member.roles.add(role); // Attribuer le rôle
        console.log(`${user.tag} a reçu le rôle 📝 | RP écrit`);

        // Envoi d'un message privé pour confirmer l'attribution du rôle
        try {
          await member.send(`🎉 Bonjour ${user.username}, vous avez reçu le rôle **📝 | RP écrit** ! 🎉\n\nVous pouvez maintenant accéder à tout le contenu RP écrit et commencer à participer pleinement au rôle-play. Merci de votre engagement sur le serveur !`);
          console.log(`Message privé envoyé à ${user.tag}`);
        } catch (error) {
          console.error(`Erreur lors de l'envoi du message privé à ${user.tag}:`, error);
        }
      } else {
        console.log("Le rôle '📝 | RP écrit' n'a pas été trouvé.");
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réaction :', error);
  }
});

client.on('guildMemberAdd', (member) => {
  guildMemberEvents.execute(member, 'add');  // Appel de l'événement "add"
});

client.on('guildMemberRemove', (member) => {
  guildMemberEvents.execute(member, 'remove');  // Appel de l'événement "remove"
});

// Écoute des messages entrants
client.on('messageCreate', async (message) => {
  console.log("Message reçu :");
  console.log(`Auteur : ${message.author.tag}`);
  console.log(`Contenu brut : "${message.content}"`);
  console.log(`Type : ${message.type}`);

  

  if (message.author.bot) return;

  // Supprime la déclaration de `prefix` ici

  if (message.content.startsWith(`${PREFIX}clôture`)) {
    await clotureCommand.execute(message);
  }

  if (message.content.startsWith(`${PREFIX}lancement`)) {
    await lancementCommand.execute(message);
  }

  // Vérifie si le message commence par le préfixe
  if (!message.content.startsWith(PREFIX)) return;

  // Divise le message en commande et arguments
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

   // Commande 'session'
   if (command === 'session') {
    // Supprime le message contenant la commande
    try {
      await message.delete(); // Cette ligne supprime le message contenant la commande
      // Après la suppression, le message est déjà traité, donc la commande est exécutée ici
      return sessionCommand.execute(message); // Exécute la commande
    } catch (error) {
      console.error("Erreur lors de la suppression du message : ", error);
    }
  }

   // Commande 'proposition session'
   if (message.content.startsWith(`${PREFIX}proposition session`)) {
    propositionSessionCommand.execute(message);
  }

  // Commande 'accepter'
  if (command === 'accepter') {
    const member = message.mentions.members.first();

    if (!member) {
      return message.reply('Veuillez mentionner un membre valide pour accepter la candidature.');
    }

    const roleImmigre = message.guild.roles.cache.find((role) => role.name === '🗺| Immigré');
    const roleResident = message.guild.roles.cache.find((role) => role.name === '🏠| Résident');
    const roleRPVocal = message.guild.roles.cache.find((role) => role.name === '🎙 | RP vocal');

    // Vérification des rôles existants sur le serveur
    if (!roleImmigre || !roleResident || !roleRPVocal) {
      return message.reply('Les rôles "immigré", "résident" ou "RP vocal" sont introuvables sur ce serveur.');
    }

    try {
      // Retirer le rôle "immigré" et attribuer les rôles "résident" et "RP vocal"
      if (member.roles.cache.has(roleImmigre.id)) {
        await member.roles.remove(roleImmigre);
      }
      await member.roles.add(roleResident);
      await member.roles.add(roleRPVocal);

      // Envoi d'un message privé à l'utilisateur concerné
      await member.send(
        `Bonjour, 

Vous venez d'être accepté dans le serveur ! :grin: 
Félicitations à vous ! :partying_face: 

:page_with_curl:  - Vous pouvez dès à présent faire le tour des catégories pour prendre en compte tout son contenu. 

:money_with_wings:  - Familiarisez-vous avec le bot dans la catégorie Compte et faites un !money dans le premier salon pour ouvrir votre compte en banque.

Si vous avez des questions, nous restons bien entendu disponibles, soit via un ticket si vous êtes timides, soit directement dans le salon discussion :smile: 

Nous sommes tous là pour vous répondre.

:warning: Pour votre première session, pensez à vous rendre au bureau des shérifs afin de vous faire recenser. 
Passez ensuite à l'écurie ou au ranch pour recenser votre cheval. :warning: 

A bientôt en RP sur **${message.guild.name}**.`
      );

      // Confirmation dans le salon
      message.channel.send(
        `Une candidature a été acceptée et les rôles \`🏠 Résident\` et \`🎙 RP vocal\` ont été attribués. :white_check_mark:`
      );
    } catch (error) {
      console.error(error);
      message.reply("Une erreur est survenue lors de l'attribution des rôles.");
    }
  }

  // Commande 'session' - Appel de la nouvelle fonctionnalité
  if (command === 'session') {
    sessionCommand.execute(message);
  }
});

// Connexion du bot
client.login(TOKEN);
