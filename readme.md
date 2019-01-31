# Command Framework

A framework to easily do commands using [discord.js](https://www.npmjs.com/package/discord.js)

## Installation
Check that you have node and npm installed
- To check if you have Node.js installed, run this command in your terminal:
```
node -v
```
- To confirm that you have npm installed you can run this command in your terminal:
```
npm -v
```
- Ok, now an installation of our npm
```
npm i command-discord
```

## Usage
```js
const command = require("command-discord");
// all parameters in this object are optional, you can pass token in the start function, bellow parameters are the default
const client = command.Client({
    token:"Your bot token",
    color:"65535", //optional color for  embeds in decimal (65535 default)
    path:"./commands", // path for commands folder, (./commands default)
    prefix:"h!", // prefix can be an array if you need multiple prefix, (! default)
    // example: ['h!','!']
    logErrors:true, // true default, if you dont want to console log errors in command false
    // you can get errors using the commandError event
    commandExists:false,
    commandExistsContent:{
        embed:{ // Message using in commandExists
            color: "16711680",
            description:"We dont have this command yet"
        }
    },
    // if commmand dont exists reply with a content (in this case a embed) default is false
    prefixConfig:{
         useUsername: true,
          useMention: true,
          // if you dont want to use username or mention as an prefix put these false (default is true)
          editMessage:true // if editing a message can run a command default is true
    }, 
    external:[{key:"database",value:require("mongoose")},
    { key: "Discord", value: require("discord.js") },] 
    // external variables to use instead of doing global variables
    // Exemple: Use as client.external.Discord
    
},{
    // client options for discordjs (https://discord.js.org/#/docs/main/stable/typedef/ClientOptions)
});

client.start(); // to start the bot you can pass token here, if you dont pass options
```
- All parameters (client options) can be used in external codes
-- Example: client.prefix, client.color, client.external.Discord
- For restart your bot use in your code
```js
client.restart();
```
---
### Console Error
```js
client.on("commandError", function (command, error) {
    console.error(`Error ${error.toString()} in command ${command.name}`)
    //this log is automatic if you dont disable the logErrors option
})
```
----
### Bot Playing
```js
client.on("ready", async () => {
    console.log(`Logged as ${client.user.username} with ${client.users.size} users and ${client.guilds.size} guilds`)
    const phrases = [`Use ${client.prefix[0]}help`, `Use ${client.prefix[0]}help to view my Commands`]
    setInterval(() => {
        let selected = phrases[Math.floor(Math.random() * phrases.length)]
        client.user.setPresence({ game: { name: `${selected}` } })
    }, 5 * 60 * 1000)
    client.user.setPresence({ game: { name: phrases[0] } })
});
```
---
# Commands Examples
- Let's do a simple avatar command
```js
// commands/others/avatar.js
// we can do this command in this way

exports.name = "avatar"
exports.help = "See someone avatar"
exports.cooldown = 2 // cooldown in seconds
exports.cdMessage = "Wait 2 seconds to use this again" // message if someone try to use command in cooldown
exports.aliases = ["profilepic","picture"] 
exports.category = "others" // optional better for filters
// all params are opcional
exports.run = function(params){
     // params.message is the message for the command you can use params.message.client for the client
     //param.prefix for the prefix  and param.args for command argumentes
     const {message,args} = params;
     message.channel.send({
         embed:{
             title:"avatar",
             color:message.client.color,
             image:{
                 url:message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL : message.author.displayAvatarURL
             }
         }
     })
}

// or we can do this more "beutifull"
module.exports = new (class cmd{
  constructor(){
      this.name = "avatar";
      this.category = "others"
      this.help = "See someone avatar";
      this.cooldown = 2;
      this.cdMessage = "Wait 2 seconds to use this again";
      this.aliases = ["profilepic","picture"] 
  }
  run({message,buildMessage,args}){
      // buildMessage is used for embeds
   buildMessage({
      image:{
          url:message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL : message.author.displayAvatarURL
      }
  }).send() // you can pass an channel id to send
}
})
```
- Help Command
```js
// commands/help.js
// commands/help/help.js
module.exports = new (class cmd{
  constructor(){
      this.name = "help";
      this.category = "others"
      this.help = "See my commands";
      this.cooldown = 2;
      this.cdMessage = "Wait 2 seconds to use this again";
      this.aliases = ["cmds","commands"] 
  }
  run({message,buildMessage,client,args}){
   buildMessage({
        description:client.commands.map(a => "`"+a.name[a.name.length-1]+"("+a.help+")`").join(", ")
    }).send()
    // or we can just send a category commands
    buildMessage({
        title:"Util commands",
        description:client.commands.filter(a=>a.category == "others").map(a => "`"+a.name[a.name.length-1]+"("+a.help+")`").join(", ")
    }).send()
}
})
```
- Ping Command
```js
// commands/others/ping.js
module.exports = new (class cmd {
    constructor() {
        this.name = "ping";
        this.category = "others";
        this.help = "I show my latency";
        this.cooldown = 3;
        this.cdMessage = "Wait 3 seconds to use this again";
        this.aliases = ["pong"]
    }
    run({ message, buildMessage, client, args}){
        message.reply(`:ping_pong:Pong ${Math.floor(client.ping)}`)
    }
})
```

You can find the documentation of discord.js [Here](https://discord.js.org/#/docs/main/stable/general/welcome)
<br><br>
Example of bot using this framework [Here](https://github.com/darkwolfinho/SimpleBot)
