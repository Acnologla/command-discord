# Command Framework

A framework to easily do commands using discord.js
## Usage

```js
const command = require("command-discord");
const client = command.Client({
    token:"your bot token",
    color:"65535", //optional color for  embeds in decimal (65535 default)
    path:"./commands", // path for commands folder, (./commands default)
    prefix:"h!", // prefix can be an array, (! default)
    prefixConfig:{
         useUsername: true,
          useMention true
    }, // if you dont want to use username or mention as an prefix put these false (default is true)
    external:[{
        key:"database",
        value:require("mongoose")
    }] // external variables to use instead of doing global variables
    
},{
    //client options for discordjs (https://discord.js.org/#/docs/main/stable/typedef/ClientOptions)
});

client.start("token"); // you can pass token here, if you dont want to pass options
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
// all params are opcional, just name are required
module.exports.run = function(params){
     // params.message is the message for the command you can use params.message.client for the client
     //param.prefix for the prefix  and param.args for command argumentes
     const {message} = params;
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
      this.help = "See someone avatar";
      this.cooldown = 2;
      this.cdMessage = "Wait 2 seconds to use this again";
      this.aliases = ["profilepic","picture"] 
  }
  run({message,buildMessage}){
   buildMessage({
      image:{
          url:message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL : message.author.displayAvatarURL
      }
  }).send() // you can pass an channel id to send
}
})
```

<br>

You can find the documentation of discord.js [Here](https://discord.js.org/#/docs/main/stable/general/welcome)
