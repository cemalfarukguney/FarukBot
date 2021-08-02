const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();
const Twit = require("twit");
const puppeteer = require('puppeteer');

const champNames = ["Aatrox","Ahri","Akali","Akshan","Alistar","Amumu","Anivia","Annie","Aphelios","Ashe","Aurelion Sol","Azir","Bard","Blitzcrank","Brand","Braum","Caitlyn","Camille","Cassiopeia","Cho'Gath","Corki","Darius","Diana","Dr. Mundo","Draven","Ekko","Elise","Evelynn","Ezreal","Fiddlesticks","Fiora","Fizz","Galio","Gangplank","Garen","Gnar","Gragas","Graves","Gwen","Hecarim","Heimerdinger","Illao","Irelia","Ivern","Janna","Jarvan IV","Jax","Jayce","Jhin","Jinx","Kai'Sa","Kalista","Karma","Karthus","Kassadin","Katarina","Kayle","Kayn","Kennen","Kha'Zix","Kindred","Kled","Kog'Maw","LeBlanc","Lee Sin","Leona","Lillia","Lissandra","Lucian","Lulu","Lux","Malphite","Malzahar","Maokai","Master Yi","Miss Fortune","Mordekaiser","Morgana","Nami","Nasus","Nautilus","Neeko","Nidalee","Nocturne","Nunu and Willump","Olaf","Orianna","Ornn","Pantheon","Poppy","Pyke","Qiyana","Quinn","Rakan","Rammus","Rek'Sai","Rell","Renekton","Rengar","Riven","Rumble","Ryze","Samira","Sejuani","Senna","Seraphine","Sett","Shaco","Shen","Shyvana","Singed","Sion","Sivir","Skarner","Sona","Soraka","Swain","Sylas","Syndra","Tahm Kench","Taliyah","Talon","Taric","Teemo","Thresh","Tristana","Trundle","Tryndamere","Twisted Fate","Twitch","Udyr","Urgot","Varus","Vayne","Veigar","Vel'Koz","Vi","Viego","Viktor","Vladimir","Volibear","Warwick","Wukong","Xayah","Xerath","Xin Zhao","Yasuo","Yone","Yorick","Yuumi","Zac","Zed","Ziggs","Zilean","Zoe","Zyra"]

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

client.on("ready", () => {
  console.log('Logged in as ' + client.user.tag + '!');
})

client.on("message", msg => {
  if (msg.author.bot) return;
  if (msg.content.startsWith("!build")){
    var champName = msg.content.split(' ')[1];
    if (champNames.some(word => champName.toLowerCase() === word.toLowerCase())){
      var url = "https://tr.op.gg/champion/"+champName+"/statistics";
      try {
        let channel = client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel => {
          (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            await page.setDefaultNavigationTimeout(0);
            let screenshot1 = await page.screenshot({clip:{x:0,width:720,y:730,height:345}});
            let screenshot2 = await page.screenshot({clip:{x:0,width:720,y:1090,height:670}});
            let screenshot3 = await page.screenshot({clip:{x:0,width:720,y:1760,height:640}});
            await browser.close();
            
            channel.send("", {files: [screenshot1]});
            channel.send("", {files: [screenshot2]});
            channel.send("", {files: [screenshot3]});
          })();
        })
      }
      catch (error){
        console.error(error);
      }
    }
    else{
      try {
        let channel = client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel => {
          channel.send("böyle bir şampiyon yok");
        })
      }
      catch (error){
        console.error(error);
      }
    }
  }
})

client.once('ready', () => {
  var stream = T.stream('statuses/filter', { follow: [process.env.TWITTER_USER_ID] })
  console.log("ready");
  stream.on('tweet',function(tweet) {
    if (tweet.author === stream.author){
      var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
      try {
        let channel = client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel => {
          channel.send(url);
        })
      }
      catch (error) {
        console.error(error);
      }
    }
  })
})

client.login(process.env.DISCORD_TOKEN);
