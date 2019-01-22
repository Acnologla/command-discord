const Client = require("./src/Client.js")
module.exports = class Main{
    static Client(...args){
       return new Client(...args);
    }
}