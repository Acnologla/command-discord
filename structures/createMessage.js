module.exports = function(params={}){
    params.title  = params.title ? params.title : _this.name.pop();
    params.color = params.color || message.client.color;
    params.footer = params.footer ||  {
      icon_url:message.author.displayAvatarURL,
      text:message.author.username
    }
    params = {embed:params};
     return {
         send(id){
             if (!id) message.channel.send(params)
             else message.client.channels.get(id.toString()).send(params)
         }
     }}