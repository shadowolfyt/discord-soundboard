const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
client.commands = new Discord.Collection();

// Reads all commands and boots them in
fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === 'js')
  if (jsfile.length <= 0) {
    console.log('Couldn\'t find commands.');
    return
  }

jsfile.forEach((files, i) => {
    let props = require(`./commands/${files}`);
    console.log(`${files} has been loaded.`);
    client.commands.set(props.help.name, props);
  })
});

client.on('ready', () => {
  let pluralnonpluralservers = (client.guilds.size > 1) ? 'Servers' : 'Server';
  let pluralnonpluralusers = (client.users.size > 1) ? 'Users' : 'User';

  console.log(`${client.user.username} is online and is operating on ${client.guilds.size} ${pluralnonpluralservers} for ${client.users.size} ${pluralnonpluralusers}.`);

  function setActivity() {
    const Gameinfo = ['Source: https://bit.ly/discordsoundboard', 'Play Me!', 'Developer: shadowolf#9212', 'Discord: http://discord.io/chillcabin', 'Invite: http://bit.ly/botinvite', `Running on ${client.guilds.size} ${pluralnonpluralservers}`, `Running for ${client.users.size} ${pluralnonpluralusers}`, `Use ${config.prefix}commands for memes`, 'My Name JEFF!'];
    const info = Gameinfo[Math.floor(Math.random() * Gameinfo.length)];

    client.user.setActivity(info);
    console.log(`[Console] Activity set to (${info})`);
  };

  setInterval(setActivity, 120000);
});

client.on('disconnect', () => {
  client.user.setStatus('away');
  client.user.setActivity('Reconnecting.. Pushing Patch..');
  console.log(`[Console] Reconnecting...`);
});

client.on('message', message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (!message.member.voiceChannel) {
    let embed = new Discord.RichEmbed()
    .setTitle('User is not in channel')
    .setColor(config.red)
    .setDescription(`${message.author}, you are not not in a voice channel dummy..`);
    message.channel.send(embed);
  };

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (!cmd.startsWith(prefix)) return;
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(client,message,args);
});

client.login(process.env.BOT_TOKEN);
