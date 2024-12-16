const { Client, GatewayIntentBits } = require('discord.js');

// Remplacez par votre token de bot
const TOKEN = 'MTMxNzkyNjQ0ODE2OTg4MTYyMA.GL7_9F.qBoO-Ae05__DgUIM4_T3e7MytsBKesgFoRLD2E'; 
const PREFIX = '-'; // Préfixe pour les commandes

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,              // Permet d'interagir avec les serveurs
    GatewayIntentBits.GuildMessages,       // Permet de lire et répondre aux messages
    GatewayIntentBits.MessageContent,      // Permet de lire le contenu des messages
    GatewayIntentBits.GuildMembers         // Permet de gérer les rôles et membres du serveur
  ],
});

// Lors de la connexion du bot
client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

// Écoute des messages entrants
client.on('messageCreate', async (message) => {
  console.log("Message reçu :");
  console.log(`Auteur : ${message.author.tag}`);
  console.log(`Contenu brut : "${message.content}"`);
  console.log(`Type : ${message.type}`);
  // Ignorer les messages du bot lui-même
  if (message.author.bot) return;

  // Vérifie si le message commence par le préfixe
  if (!message.content.startsWith(PREFIX)) return;

  // Divise le message en commande et arguments
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Commande 'accepter'
  if (command === 'accepter') {
    const member = message.mentions.members.first();

    if (!member) {
      return message.reply('Veuillez mentionner un membre valide pour accepter la candidature.');
    }

    const roleImmigre = message.guild.roles.cache.find((role) => role.name === '🗺| Immigré');
    const roleResident = message.guild.roles.cache.find((role) => role.name === '🏠| Résident');

    // Vérification des rôles existants sur le serveur
    if (!roleImmigre || !roleResident) {
      return message.reply('Les rôles "immigré" ou "résident" sont introuvables sur ce serveur.');
    }

    try {
      // Retirer le rôle "immigré" et attribuer le rôle "résident"
      if (member.roles.cache.has(roleImmigre.id)) {
        await member.roles.remove(roleImmigre);
      }
      await member.roles.add(roleResident);

      // Envoi d'un message privé à l'utilisateur concerné
      await member.send(
        `Bonjour, 

Vous venez d'être accepter dans le serveur ! :grin: 
Félicitation à vous ! :partying_face: 

:page_with_curl:  - Vous pouvez dès à présent faire le tour des catégories pour prendre en compte tout son contenue. 

 :money_with_wings:  - Familiariser vous avec le bot dans la catégorie Compte et faite un !money dans le premier salon pour ouvrir votre compte en banque.

Si vous avez des questions, nous restons bien entendu disponible soit via un ticket si vous êtes timides ou bien directement dans le salon discussion :smile: 

Nous sommes tous là pour vous répondre.

:warning: Pour votre première session, pensez à vous rendre au bureau des shérifs afin de vous faire recenser. 
Passez ensuite à l'écurie ou au ranch pour recenser votre cheval. :warning: 

A bientôt en RP !${message.guild.name}**.`
      );

      // Confirmation dans le salon
      message.channel.send(`Une candidature a été acceptée. :white_check_mark: `);
    } catch (error) {
      console.error(error);
      message.reply("Une erreur est survenue lors de l'attribution des rôles.");
    }
  }
});

// Connexion du bot
client.login(TOKEN);
