const Discord = require("discord.js")
const Command = require("../structures/Command.js")
const fs = require("fs")
module.exports = class Client extends Discord.Client{
   constructor(options={},clientOptions={}){
      super(clientOptions);
      this.optins = options;
      this.logErrors = options.logErrors || true;
      this.clientOptions = clientOptions;
      this.token = options.token || clientOptions.token;
      this.color = options.color || "65535";
      this.commandPath = options.path || "./commands";
      this.commands = [];
      this.initCommands();
      this.commands.get = function(command){
        return this.find(a => a.name.toLowerCase() == command.toLowerCase() || a.aliases.includes(command.toLowerCase()))
    }
      this.prefix = Array.isArray(options.prefix) ? options.prefix : [options.prefix || "!"];
      this.prefixConfig = {
          useUsername: options.prefixConfig ? options.prefixConfig.useUsername : true,
          useMention: options.prefixConfig ? options.prefixConfig.useMention : true,
          editMessage: options.prefixConfig ? options.prefixConfig.editMessage : true
      }
      this.op = clientOptions
      this.external = {}
      if (options.external) options.external.forEach(val => this.external[val.key] = val.value ); 
   }
   initCommands(path){
    const cmds =  fs.readdirSync(path || this.commandPath);
    cmds.forEach((a) =>{
        if (fs.lstatSync((path || this.commandPath)+`/${a}`).isDirectory()) return this.initCommands(this.commandPath+`/${a}`);
        if (a.split(".").pop() != "js") return;
        let cmd = require((`../../../${(path ? path.replace(/\./g,""): this.commandPath.replace(/\./g,""))}/${a}`).replace(/\/\//g,"/"))
        if (!cmd) throw new Error(`The command ${(path || this.commandPath)}/${a} dont the correct struct`);
        if (!cmd.name) cmd.name = a.split(".")[0];
        cmd.category = cmd.category || (path ? path.replace(/\./g,"").replace(/\//g,"") : this.commandPath.replace(/\./g,"").replace(/\//g,""));
        this.commands.push(new Command(cmd));
    })
   }
   restart(){
       const _token = this.token;
       this.destroy();
       this.commands = [];
       this.initCommands();
       this.start(_token);
    }
   start(token){
       this.login(this.token || token);
       require("./OnMessage.js")(this);
       this.token = this.token || token;
    }
}