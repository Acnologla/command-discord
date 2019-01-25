module.exports = function (client) {
    client.on("message", function (message){
       if (message.author.bot || !message.guild) return;
       if (client.prefix.find(a => message.content.startsWith(a)) || message.content.toLowerCase().startsWith(client.user.username.toLowerCase()) || message.content.startsWith(message.guild.me.toString())){
        const prefix = client.prefix.find(a => message.content.startsWith(a)) ? client.prefix.find(a => message.content.startsWith(a)) : message.content.startsWith(client.user.username) ? client.user.username.toLowerCase() : message.guild.me.toString();
        const clientCommand = client.prefix.includes(prefix) ? message.content.split(" ")[0].slice(prefix.length) : message.content.split(" ")[1]
        if (!clientCommand) return;   
        const args = client.prefix.includes(prefix) ? message.content.split(" ").slice(1) :message.content.split(" ").slice(2)
           const command = client.commands.find(a => a.name.includes(clientCommand.toLowerCase()));   
           if (!command) return
           if (command.ob.includes(message.author.id)) return message.reply(command.cdMessage || "Wait for use this command again")
           if ((!client.prefixConfig.useUsername  && prefix == client.user.username) || (!client.prefixConfig.useMention  && prefix == message.guild.me.toString())) return;
           const oldmention = message.mentions.users
           if (message.content.startsWith(message.guild.me.toString())) message.mentions.users = message.mentions.users.filter((a) => a.id != client.user.id)
           if (args.includes(message.guild.me.toString()) && message.content.startsWith(message.guild.me.toString()) ) message.mentions.users = oldmention;
           command.runCommand(message,prefix,args)
       }
    })
}