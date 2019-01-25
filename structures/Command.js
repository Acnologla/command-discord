module.exports = class Command{
   constructor(options){
       this.name = options.aliases ? options.aliases.concat(options.name).map(a => a.toLowerCase()) : [options.name.toLowerCase()]
       this.cd = options.cooldown || 0
       this.help = options.help || options.name;
       this.cdMessage = options.cdMessage 
       this.category = options.category || "noCategory"
       this.ob = []
       this.run = options.run || function(params){
          params.message.reply({
             embed:{
                 title:"Maintence",
                 description:"This command is under maintence",
                 color: params.message.client.color
             } 
          })
       };
   }
   runCommand(message,prefix,args){
       let _this = this
       try{
       this.run({
           message:message,
           args:args.map(a=> isNaN(a) ? a : parseInt(a)),
           client:message.client,
           prefix:prefix,
		   buildMessage:function(params={}){
			   params.title  = params.title ? params.title : _this.name.pop(),
               params.color = params.color || message.client.color
               params = {embed:params}
			    return {
					send(id){
						if (!id)message.channel.send(params)
						else message.client.channels.get(id.toString()).send(params)
					}
				}}
       })}
       catch(err){
           console.error(`${err.toString()} in command: ${this.name.pop()}`)
       }
       this.ob.push(message.author.id)
       setTimeout(() => this.ob.splice(this.ob.indexOf(message.authorid),1),1000*this.cd)
  }
}