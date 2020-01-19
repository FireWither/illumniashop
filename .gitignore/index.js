const Discord = require('discord.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('users.db3');
const bot = new Discord.Client();
var manyPseudo;

function spin(money,pseudo,taux){
    db.each('SELECT * FROM profile WHERE username=?',[pseudo], function(err,row) {
        if(err){
            console.log(err);
        }else{
            db.run("UPDATE profile SET money = ? WHERE username = ?", [row["money"]-money+(money*taux),pseudo]);
        }
    });
}
bot.on('message', message => {
    if(message.content.startsWith("<<")){
        split=message.content.split(' ')
        msgWpre = split[0].replace(/<</g,"");
        if(msgWpre == "cprofile"){
           pseudo=message.author.username;
            db.each('SELECT COUNT(*) FROM profile WHERE username=?',[pseudo], function(err,row) {
               if(err){
                   console.log(err);
               }else{
                    manyPseudo = row['COUNT(*)'];
                    if(manyPseudo<1){
                        db.run("INSERT INTO profile VALUES(?,?,?)", [null,pseudo,"0"]);
                        var Embed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle('Sucess')
                            .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                            .addField('Votre compte viens d\'etre crée','Nom du compte crée : '+pseudo);
                        message.channel.send(Embed);
                    }else{
                        var Embed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle('Error')
                            .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                            .addField('Compte déjà existant','Nom du compte existant : '+pseudo);
                        message.channel.send(Embed);
                    }
               }
            });
        }
        if(msgWpre == "dprofile"){
            pseudo=message.author.username;
            db.each('DELETE FROM profile WHERE username=?',[pseudo], function(err) {
                if(err){
                    console.log(err);
                }
            });
            var Embed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Sucess')
                .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                .addField('Compte supprimé','Nom du compte supprimé : '+pseudo);
            message.channel.send(Embed);
        }
        if(msgWpre == "profile"){
            pseudo=message.author.username;
             db.each('SELECT * FROM profile WHERE username=?',[pseudo], function(err,row) {
                if(err){
                    console.log(err);
                }else{
                    var Embed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle("Information")
                        .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                        .addField('Argent',row["money"]+'$');
                    message.channel.send(Embed);
                }
             });
        }
        if(message.member.roles.has('604741828436295700')){
            if(msgWpre == "add"){
                pseudo = split[1];
                money = split[2];
                db.each('SELECT * FROM profile WHERE username=?',[pseudo], function(err,row) {
                    if(err){
                    }else{
                        db.run("UPDATE profile SET money = ? WHERE username = ?", [row["money"]+money,pseudo]);
                        var Embed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle("Information")
                            .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                            .addField('Compte de '+pseudo+" à été crédité de",money+'$');
                        message.channel.send(Embed);
                    }
                });
            }
            if(msgWpre == "set"){
                pseudo = split[1];
                money = split[2];
                db.each('SELECT * FROM profile WHERE username=?',[pseudo], function(err,row) {
                    if(err){
                    }else{
                        db.run("UPDATE profile SET money = ? WHERE username = ?", [money,pseudo]);
                        var Embed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle("Information")
                            .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                            .addField('Compte de '+pseudo+" posséde maintenant",money+'$');
                        message.channel.send(Embed);
                    }
                });
            }
            if(msgWpre == "remove"){
                pseudo = split[1];
                money = split[2]
                db.each('SELECT * FROM profile WHERE username=?',[pseudo], function(err,row) {
                    if(err){
                    }else{
                        db.run("UPDATE profile SET money = ? WHERE username = ?", [row["money"]-money,pseudo]);
                        var Embed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle("Information")
                            .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                            .addField('Compte de '+pseudo+" à été perdu",money+'$');
                        message.channel.send(Embed);
                    }
                });
            }
        }
        if(msgWpre == "spin"){
            var money= split[1];
            var pseudo = message.author.username;
            if (money != undefined){
                if(Number(money) == parseInt(money)){
                    db.each('SELECT * FROM profile WHERE username=?',[pseudo], function(err,row) {
                        if(err){
                            console.log(err);
                        }else{
                           if((row["money"]-money)<0){
                                var Embed = new Discord.RichEmbed()
                                    .setColor('#0099ff')
                                    .setTitle("Error")
                                    .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                    .addField('Argent insuffisant','Il vous reste '+row["money"]+'$');
                                message.channel.send(Embed);
                           }else{
                                let values = [0,  0.1,   0.5,   0.75,   1,  2,  5,  10, 25];
                                let probas = [0.20, 0.15, 0.15, 0.10,0.139,0.15,0.10,0.01,0.001];
                                function pickWeightedRandomValue(values, weights) {
                                    let rand = Math.random();
                                    for(let i=0; i<weights.length; i++) {
                                        if(rand <= weights[i]) return values[i];
                                        rand -= weights[i];
                                    }
                                }
                                
                                let taux = pickWeightedRandomValue(values, probas);
                                if(taux==0){
                                    var Embed = new Discord.RichEmbed()
                                        .setColor('#0099ff')
                                        .setTitle("Sucess")
                                        .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                        .addField('Vous n\'avez rien gagné',taux*money+'$');
                                    message.channel.send(Embed);
                                    spin(money,pseudo,taux);
                                }else if(taux==0.1){
                                    var Embed = new Discord.RichEmbed()
                                        .setColor('#0099ff')
                                        .setTitle("Sucess")
                                        .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                        .addField('Tu as gagné',taux*money+'$');
                                    message.channel.send(Embed);
                                    spin(money,pseudo,taux);
                                }else if(taux==0.5){
                                    var Embed = new Discord.RichEmbed()
                                        .setColor('#0099ff')
                                        .setTitle("Sucess")
                                        .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                        .addField('Tu as gagné',taux*money+'$');
                                    message.channel.send(Embed);
                                    spin(money,pseudo,taux);
                                }else if(taux==0.75){
                                    var Embed = new Discord.RichEmbed()
                                    .setColor('#0099ff')
                                    .setTitle("Sucess")
                                    .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                    .addField('Tu as gagné',taux*money+'$');
                                    message.channel.send(Embed);
                                    spin(money,pseudo,taux);
                                }else if(taux==0.1){
                                    var Embed = new Discord.RichEmbed()
                                    .setColor('#0099ff')
                                    .setTitle("Sucess")
                                    .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                    .addField('Tu as gagné',taux*money+'$');
                                    message.channel.send(Embed);
                                    spin(money,pseudo,taux);
                                }else if(taux==2){
                                    var Embed = new Discord.RichEmbed()
                                    .setColor('#0099ff')
                                    .setTitle("Sucess")
                                    .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                    .addField('Tu as gagné',taux*money+'$');
                                    message.channel.send(Embed);
                                    spin(money,pseudo,taux);
                                }else if(taux==5){
                                    var Embed = new Discord.RichEmbed()
                                    .setColor('#0099ff')
                                    .setTitle("Sucess")
                                    .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                    .addField('Bravo tu as gagné',taux*money+'$');
                                    message.channel.send(Embed);
                                    spin(money,pseudo,taux);
                                }else if(taux==10){
                                    var Embed = new Discord.RichEmbed()
                                    .setColor('#0099ff')
                                    .setTitle("Sucess")
                                    .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                    .addField('Bravo Tu as gagné',taux*money+'$');
                                    message.channel.send(Embed);
                                    spin(money,pseudo,taux);
                                }else if(taux==25){
                                    var Embed = new Discord.RichEmbed()
                                        .setColor('#0099ff')
                                        .setTitle("Sucess")
                                        .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                                        .addField('Tu viens de faire X25 avec ta mise!',"Tu remporte "+taux*money+'$');
                                    message.channel.send(Embed);
                                    spin(money,pseudo,taux);
                                }
                           }
                        }
                    });
                }else{
                    var Embed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle("Error")
                    .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                    .addField('Notation Incorrect','Veuillez ajouter une somme d\'argent à votre spin');
                    message.channel.send(Embed);
                }
            }else{
                var Embed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle("Error")
                .setAuthor('Nexion Spin', 'https://cdn.discordapp.com/icons/464038443786174477/a_4479f213aaecbb0a57562cab7155c4e3.png?size=128')
                .addField('Notation Incorrect','Veuillez ajouter une somme d\'argent à votre spin');
                message.channel.send(Embed);
            }
        }
    }
});
bot.login(process.env.TOKEN);
