const Discord = require('discord.js')
const bot = new Discord.Client()
var prefixModo = ["/sm","/shopmodo"];
var prefixShop = ["/shop","/s"];
var splitAddProduct =["addProduct","add","a"];
var splitRemoveProduct =["removeproduct","remove","r"];
var splitBuy =["buy","achat","b"];
var splitListProduct =["list","l"];
var fs = require('fs');
function AddItem(ProductAddName,ProductAddPrice){
    fs.readFile('product.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        let ProductAdd={
            name:ProductAddName,
            price:ProductAddPrice
        }
        obj.Product.push(ProductAdd); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFileSync('product.json', json, 'utf8'); // write it back 
    }});
}
function RemoveItem(ProductRemove){
    fs.readFile('product.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        var items=obj.Product;
        var i=items.length;
        while (i--) {
            if(ProductRemove.indexOf(items[i].name)!=-1){
                items.splice(i,1);
            }
        }
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFileSync('product.json', json, 'utf8'); // write it back 
    }});
}
function ListItem(ProductRemove){
    fs.readFile('product.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        var items=obj.Product;
        var i=items.length;
        while (i--) {
            message.channel.send(items[i].name+" : "+items[i].price)
        }
    }});
}

bot.on('message', message => {
    var buyer = message.author;
    var split = message.content.split(' ');
    if(prefixModo.includes(split[0].toLowerCase())){
        if(message.member.hasPermission("ADMINISTRATOR") == true){
            /*if(split[1] == "SetChannelBuy"){
                const channelBuy = split[2];
                message.channel.send("Configuration du channel achat");
            }else if(split[1] == "SetChannelOrder"){
                var channelOrder = split[2];
                message.channel.send("Configuration du channel commande en préparation");
            }else if(split[1] == "SetChannelFinish"){
                const channelFinish = split[2];
                message.channel.send("Configuration du channel commande terminé");
            }else*/ if(splitAddProduct.includes(split[1].toLowerCase())){
                if(typeof(split[3].toLowerCase()) === "undefined" || typeof(split[2].toLowerCase()) === "undefined" ){
                   message.channel.send("Produit ou quantité manquante.")
                }else{
                    AddItem(split[2].toLowerCase(),split[3].toLowerCase());
                    message.channel.send("L'item "+split[2].toLowerCase()+" à été ajouté au shop à "+split[3].toLowerCase()+"$ l'unité");
                }
            }else if(splitRemoveProduct.includes(split[1].toLowerCase())){
                message.channel.send(split[2].toLowerCase());
                if(typeof split[2].toLowerCase() !== "undefined"){
                    RemoveItem(split[2].toLowerCase());
                    message.channel.send("L'item "+split[2].toLowerCase()+" à été supprimmé de la list");
                }
            }else if(split[1].toLowerCase() == "help"){
                message.channel.send('./shopmodo AddProduct Produit Prix/unité')
                message.channel.send('./shopmodo RemoveProduct Produit')
            }else if(splitListProduct.includes(split[1].toLowerCase())){
                function ListItem(){
                    fs.readFile('product.json', 'utf8', function readFileCallback(err, data){
                        if (err){
                            console.log(err);
                        } else {
                        obj = JSON.parse(data); //now it an object
                        var items=obj.Product;
                        var i=items.length;
                        while (i--) {
                            message.channel.send(items[i].name+" : "+items[i].price+"$\n")
                        }
                    }});
                }
                ListItem();
            }else{
                message.channel.send("Commande discord Invalide")
            } 
        }else{
            message.delete();
            buyer.send("Il faut une autorisation pour executé cette commande")
        }
    }else if(prefixShop.includes(split[0].toLowerCase())){
        if(splitBuy.includes(split[1].toLowerCase())){
            if(typeof(split[3].toLowerCase()) === "undefined" || typeof(split[2].toLowerCase()) === "undefined" || typeof(split[4].toLowerCase()) === "undefined" ){
                buyer.send("Produit, quantité ou pseudo manquant. /shop buy Pseudo Quantité Produit");
            }else{
                var quantity = split[3];
                var productbuy = split[4].toLowerCase();
                var Pseudo = split[2];
                fs.readFile('product.json', 'utf8', function readFileCallback(err, data){
                    if (err){
                        console.log(err);
                    } else {
                    obj = JSON.parse(data); //now it an object
                    var items=obj.Product;
                    var i=items.length-1;
                    while (i>0) {
                        console.log(i)
                        if(obj.Product[i].name != productbuy){
                            if(i===1){
                                buyer.send("Item introuvable. Merci d'utiliser l'orthographe du shop. Si l'erreur perssiste veuillez contacter un vendeur.");
                            }
                        }else{
                            var price = quantity*items[i].price;
                            buyer.send("Récapitulatif de la commande:\nProduit:"+productbuy+"\nQuantité:"+quantity+"\nPrix:"+price+"$");
                            bot.channels.get("580716757631762442").send(Pseudo+" à commandé:\n"+quantity+" "+productbuy+" pour "+price+"$")
                            .then(function (BotMsg) {
                                BotMsg.react("❌")
                                BotMsg.react("✅")
                            
                                const filter = (reaction, user) => {
                                    return ['✅'].includes(reaction.emoji.name) && user.id === buyer.id;
                                };
                                BotMsg.awaitReactions(filter, { max: 1, time: '604800000', errors: ['time'] })
                                .then(collected => {
                                    const reaction = collected.first();
                                    if (reaction.emoji.name === '✅') {
                                        var obj = Object.entries(reaction.users.last(1))[0][1];
                                        var result = Object.keys(obj).map(function(key) {
                                            return [String(key), obj[key]];
                                          }); 
                                        var UserName = result[1];
                                        buyer.send("Votre commande de l'item "+productbuy+" vient d'être commencé par "+ UserName[1]);
                                        bot.users.get('261170601140420618').send("Récapitulatif de la commande prise:\nProduit:"+productbuy+"\nQuantité:"+quantity+"\nPrix:"+price+"$\nAcheteur:"+Pseudo);
                                        BotMsg.delete();
                                    }
                                })
                                .catch(collected => {
                                    buyer.send('Commande expiré');
                                    console.log(err)
                                });
                            })
                            break; 
                        }
                        i--
                    }

                }});
            }
        }else if(split[1].toLowerCase() == "finish" && message.member.roles.some(role => role.name === 'vendeur')){
            var quantityFinish = split[3];
            var productFinish = split[4].toLowerCase();
            var PseudoBuyer = split[2];
            if(typeof(split[3].toLowerCase()) === "undefined" || typeof(split[2].toLowerCase()) === "undefined" || typeof(split[4].toLowerCase()) === "undefined" ){
                message.channel.send("Produit, quantité ou pseudo manquant. /shop finish PseudoDiscord Quantité Produit");
            }else{
                message.channel.send("@"+PseudoBuyer+" ta commande de "+quantityFinish+" "+productFinish+" est prête, mp "+message.author.username+" pour lui l'échanger !")
            }
        }else if(split[1].toLowerCase() == "help"){
            message.channel.send("Achat:\n/shop buy Pseudo Quantité Produit")
            if(message.member.roles.some(role => role.name === 'vendeur')){
                message.channel.send("Commande terminé:\n/shop finish Pseudo Quantité Produit")
            }
        }
    }
   
})
bot.login('NTgwMDkzMTQwNTg1OTM4OTY0.XOLsHw.v7l7QPRAxeRsJtKEmb9AhGLQmyo')
