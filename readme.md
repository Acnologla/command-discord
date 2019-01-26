# Command Framework

A framework to easily do commands using discord.js
## Usage

```js
const command = require("command-discord");
const client = command.Client({
    token:"your bot token",
    color:"65535", //optional color for  embeds in decimal (65535 default)
    path:"./commands", // path for commands folder, (./commands default)
    prefix:"h!",
    logErrors:true, // true default, if you dont want to console log errors in command false
    // you can get errors using the commandError event
     // prefix can be an array if you need multiple prefix, (! default)
    prefixConfig:{
         useUsername: true,
          useMention: true,
          // if you dont want to use username or mention as an prefix put these false (default is true)
          editMessage:true // if editing a message can run a command default is true
    }, 
    external:[{
        key:"database",
        value:require("mongoose")
    }] // external variables to use instead of doing global variables
    
},{
    //client options for discordjs (https://discord.js.org/#/docs/main/stable/typedef/ClientOptions)
});

client.on("commandError",function(command,error){
    console.error(`Error ${error.toString()} in command ${command.name}`) 
    //this log is automatic if you dont disable the logErrors option
})

client.start("token"); // you can pass token here, if you dont want to pass options
// you can restart the bot using client.restart()
```

##Commands Examples

```js
//lets do a simple avatar command
// commands/avatar.js

module.exports.name = "avatar"
module.exports.help = "See someone avatar"
module.exports.cooldown = 2 // cooldown in seconds
module.exports.cdMessage = "Wait 2 seconds to use this again" // message if someone try to use command in cooldown
module.exports.aliases = ["profilepic","picture"] 
module.exports.category = "util" // optional better for filters
// all params are opcional
module.exports.run = function(params){
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
      this.category = "util"
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

//lets do a help command

module.exports = new (class cmd{
  constructor(){
      this.name = "help";
      this.category = "util"
      this.help = "see my commands";
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
        description:client.commands.filter(a=>a.category == "util").map(a => "`"+a.name[a.name.length-1]+"("+a.help+")`").join(", ")
    }).send()
}
})
```

<br>

Example of bot using this framework [Here](https://github.com/darkwolfinho/SimpleBot)

You can find the documentation of discord.js [Here](https://discord.js.org/#/docs/main/stable/general/welcome)
