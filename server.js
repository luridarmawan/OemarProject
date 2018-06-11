process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const emoji = require('node-emoji');
const sleep = require('sleep');
const fs = require('fs');
var Promise = require('promise');
let users_list = 'database/users.txt';  
let rules_list = 'database/rules.txt';  
let emoji_list = 'database/emoji.txt';  
 
var answer_yes_list = [/ya/,/iya/,/yes/,/iyap/,/yap/];
var answer_no_list = [/tdk/,/tidak/,/gak/,/enggak/,/ngak/,/nope/,/ndak/];
var answer_gender_list = [/female/,/wanita/,/perempuan/,/cewe/,/gadis/,/male/,/laki-laki/,/pria/,/cowo/,/bujang/];


const token = "TOKEN_TELEGRAM";
const bot = new TelegramBot(token, {polling: true});

var sentences_rule = [];
var users = [];
var rules = [];
var emoticon = [];
var tmp_user = [{"chat_id":0,"step":1,"gender":null,"nickname":null}];

const setData = (fileName, type, data) =>
	new Promise((resolve, reject) => {
	fs.writeFile(fileName, JSON.stringify(data), { flag: 'w' }, function(err) {
		return err ? reject(err) : resolve(JSON.stringify(data));
	})
});

const getData = (fileName, type) =>
	new Promise((resolve, reject) => {
    fs.readFile(fileName, type, (err, data) => {
      return err ? reject(err) : resolve(JSON.parse(data));
	})
});

getData(users_list, 'utf8')
	.then(
		function(result) {
			users = result;
			console.log("get users data");
		}, function(err) {
			console.log(err);
		}
	).catch(error => console.log('Error: ', error));

getData(emoji_list, 'utf8')
	.then(
		function(result) {
			emoticon = result;
			console.log("get emoticon data");
		}, function(err) {
			console.log(err);
		}
	).catch(error => console.log('Error: ', error));

getData(rules_list, 'utf8')
.then(
	function(result) {
		rules = result;
		sentences_rule = [
			{
				"response_code":1,
				"type":"perjanjian",
				"regex_rules": new RegExp("("+rules[0].perjanjian[0].join('|')+")+[a-zA-Z\\s0-9]+("+rules[0].perjanjian[1].join('|')+")+[a-zA-Z\\s0-9]","i")
			},
			{
				"response_code":2,
				"type":"beralah",
				"regex_rules": new RegExp("("+rules[0].beralah[0].join('|')+")+[a-zA-Z\\s0-9]+("+rules[0].beralah[1].join('|')+")+[a-zA-Z\\s0-9]","i")
			},
			{
				"response_code":3,
				"type":"permintaan",
				"regex_rules": new RegExp("("+rules[0].permintaan.join('|')+")","i")
			},
			{
				"response_code":4,
				"type":"pengandaian",
				"regex_rules": new RegExp("("+rules[0].pengandaian.join('|')+")","i")
			},	
			{
				"response_code":5,
				"type":"sapaan",
				"regex_rules": new RegExp("("+rules[0].sapaan.join('|')+")","i")
			},	
			{
				"response_code":6,
				"type":"ajakan",
				"regex_rules": new RegExp("("+rules[0].ajakan.join('|')+")","i")
			},
			{
				"response_code":11,
				"type":"ekspresi",
				"regex_rules": new RegExp("("+rules[0].ekspresi.join('|')+")+[a-zA-Z\\s]*$","i")
			},
			{
				"response_code":7,
				"type":"seru",
				"regex_rules": new RegExp("("+rules[0].seru.join('|')+")+(\\!|\\.)*$","i")
			},	
			{
				"response_code":8,
				"type":"perintah",
				"regex_rules": new RegExp("("+rules[0].perintah.join('|')+")*\\!$","i")
			},	
			{
				"response_code":9,
				"type":"tanya",
				"regex_rules": new RegExp("("+rules[0].tanya.join('|')+")+[a-zA-Z\\s]*\\?$","i")
		
			},
			{
				"response_code":10,
				"type":"pernyataan",
				"regex_rules": /\.$/i
			}
		];
		console.log("get rules data and set sentence rule");
	}, function(err) {
		console.log(err);
	}
).catch(error => console.log('Error: ', error));


const response = (user,response_code, sentence) =>
	new Promise((resolve, reject) => {
	var reply = "";
	var found = "";
	switch(response_code){
		case 1:
			//perjanjian
			resolve(JSON.stringify(rules[0].perjanjian));
		break;

		case 2:
			//beralah
			resolve(JSON.stringify(rules[0].beralah));
		break;
		
		case 3:
			//permintaan
			resolve(JSON.stringify(rules[0].permintaan));
		break;
		
		case 4:
			//pengandaian
			resolve(JSON.stringify(rules[0].pengandaian));
		break;
		
		case 5:
			//sapaan
			reply = "hi";
			found = rules[0].sapaan.find(element => sentence.includes(element));
			if(found=="assalamualaikum"){
				reply = "waalaikumsalam warahmatullahi wabarakatuh";
			}else if(found.includes("mar")){
				reply = "iya";
			}else if(found.includes("selamat")){
				reply = found;
			}else{
				var tmp = rules[0].sapaan.filter(word => (!word.includes("mar$") && !word.includes("selamat") && word != "assalamualaikum" ));
				reply = tmp[Math.floor(Math.random() * tmp.length)];
			}
			resolve(reply+", "+user.nickname+"... "+emoji.get(emoticon[0].happy[Math.floor(Math.random() * emoticon[0].happy.length)]));

		break;
	
		case 6:
			//ajakan
			found = rules[0].ajakan.find(element => sentence.includes(element));
			reply = found + ", "+user.nickname+"... "+emoji.get(emoticon[0].laugh[Math.floor(Math.random() * emoticon[0].laugh.length)]);
			resolve(reply);
		break;
		
		case 7:
			//seru
			resolve(JSON.stringify(rules[0].seru));
		break;
		
		case 8:
			//perintah
			resolve(JSON.stringify(rules[0].perintah));
		break;
		
		case 9:
			//tanya
			if(sentence.includes("mana") && sentence.includes("wajah")){
				if(sentence.includes("imut")){
					reply = "imut.gif";
				}else if(sentence.includes("manja")){
					reply = "manja.gif";
				}else if(sentence.includes("jelek")){
					reply = "jelek.gif";
				}
			}
			resolve(reply);
		break;
		
		case 10:
			//pernyataan
			resolve(JSON.stringify(rules[0].pernyataan));
		break;
		
		case 11:
			//ekspresi
			found = rules[0].ekspresi.find(element => sentence.includes(element));
			if(sentence.match(/haha|hoho|wkwk/g)){
				reply = found+", "+user.nickname+"... "+emoji.get(emoticon[0].laugh[Math.floor(Math.random() * emoticon[0].laugh.length)]);
			}else if(sentence.match(/hihi|hehe/g)){
				reply = found+", "+user.nickname+"... "+emoji.get(emoticon[0].shy[Math.floor(Math.random() * emoticon[0].shy.length)]);
			}else if(sentence.match(/huhu|hiks/g)){
				reply = found+",oemar jadi ikutan sedih,"+user.nickname+"... "+emoji.get(emoticon[0].sad[Math.floor(Math.random() * emoticon[0].sad.length)]);
			}else if(sentence.match(/oloh/g)){
				reply = user.nickname+", kok gitu sama oemar... "+emoji.get(emoticon[0].disappointed[Math.floor(Math.random() * emoticon[0].disappointed.length)]);
			}else if(sentence.match(/uluh|cie/g)){
				reply = "emmm, oemar jadi malu sama "+user.nickname+"... "+emoji.get(emoticon[0].shy[Math.floor(Math.random() * emoticon[0].shy.length)]);
			}
			resolve(reply);
		break;																								
	}
	reject("ada kesalahan, "+user.nickname+"... "+emoji.get(emoticon[0].sad[Math.floor(Math.random() * emoticon[0].sad.length)]));
});

bot.on('message', (msg) => {
	const user = users.filter(function(value){ return value.chat_id==msg.chat.id;})[0];
	var message = msg.text.toString().toLowerCase().trim();
	var reply_message = "";
	message = message.replace(/[^a-zA-Z0-9\ \?\!\.]/g,'');
	//split message into each sentence
	message = message.replace(/\?\s|\?/g,"?\n").replace(/\.\s|\./g,".\n").replace(/\!\s|\!/g,"!\n").trim();

	if(user){
		var sentences = message.split(/\n/g);
		sentences = sentences.filter(x => x);
		sentences.forEach(function(sentence,key) {
			var found = sentences_rule.filter(sentence_rule=>sentence_rule.regex_rules.test(sentence))[0];
			if(found){
				response(user,found.response_code, sentence)
				.then(
					function(result) {
						if(result){
							if(result.includes(".gif")){
								bot.sendDocument(user.chat_id,"images/"+result);
							}else{
								if(result) reply_message += result;
								if(key==(sentences.length-1))bot.sendMessage(user.chat_id,reply_message);
							}
						}
					}, function(err) {
						console.log(err);
					}
				).catch(error => console.log('Error: ', error));
			}
		});
	}else{
		tmp_user[0].chat_id = msg.chat.id;
		switch(tmp_user[0].step){
			case 1 :
				if(tmp_user[0].step==1){
					bot.sendMessage(tmp_user[0].chat_id,"halo, kak.\n\nperkenalkan nama aku oemar."+emoji.get('smiley')+"\n\nkakak mau ya jawab beberapa pertanyaan dari oemar?");
					tmp_user[0].step = 2;
				}
			break;
			case 2:
				if(answer_yes_list.some(answer_yes => answer_yes.test(message))){
					bot.sendMessage(tmp_user[0].chat_id,"kakak itu laki-laki atau perempuan?"+emoji.get('thinking_face'));
					tmp_user[0].step = 3;
				}else if(answer_no_list.some(answer_no => answer_no.test(message))){
					bot.sendMessage(tmp_user[0].chat_id,"yaaah, padahal aku hanya ingin bertanya jenis kelamin dan apa nama panggilan kakak... "+emoji.get('disappointed_relieved')+"\n\nkakak mau ya jawab beberapa pertanyaan dari oemar ?");
					tmp_user[0].step = 5;
				}else{
					bot.sendMessage(tmp_user[0].chat_id,"kak, oemar tidak mengerti maksud jawaban kakak.\nkakak dapat memilih jawaban antara : "+answer_yes_list.toString().replace(/[^a-zA-Z0-9\ \-\,]/g,''));
				}
			break;
			case 3:
				if(answer_gender_list.some(answer_gender => answer_gender.test(message))){
					var found = message.match(answer_gender_list.find(answer_gender => answer_gender.test(message)));
					bot.sendMessage(tmp_user[0].chat_id,"oke, aku catat. jenis kelamin kakak adalah "+found[0].replace(/[^a-zA-Z0-9\ \-\,]/g,'')+".");
					tmp_user[0].gender = found[0].replace(/[^a-zA-Z0-9\ \-\,]/g,'');
					bot.sendMessage(tmp_user[0].chat_id,"pertanyaa selanjutnya, kakak ingin aku panggil apa? lansung tulis nama panggilan kakak aja ya.."+emoji.get('smiley'));
					tmp_user[0].step = 4;
				}
			break;
			case 4:
				tmp_user[0].nickname = message;	
				bot.sendMessage(tmp_user[0].chat_id,"mulai sekarang aku akan memanggil kakak "+tmp_user[0].nickname+". salam kenal ya "+tmp_user[0].nickname+"."+emoji.get('blush')+"\n\nkita bisa kembali mengobrol apapun.");
				tmp_user[0].step = 6;
				users.push(tmp_user[0]);
				setData(users_list, 'utf8', users)
				.then(
					function(result) {
						console.log("set users data");
						console.log(result);
					}, function(err) {
						console.log(err);
					}
				).catch(error => console.log('Error: ', error));
				tmp_user = [{"chat_id":0,"step":1,"gender":null,"nickname":null}];
			break;
			case 5:
				if(answer_yes_list.some(answer_yes => answer_yes.test(message))){
					bot.sendMessage(tmp_user[0].chat_id,"kakak itu laki-laki atau perempuan?"+emoji.get('thinking_face'));
					tmp_user[0].step = 3;
				}else if(answer_no_list.some(answer_no => answer_no.test(message))){
					bot.sendMessage(tmp_user[0].chat_id,"baiklah kalau begitu aku panggil kakak aja jenis kelaminnya laki-laki."+emoji.get('smirk')+emoji.get('stuck_out_tongue_winking_eye')+"\noke, mulai selanjutnya kita bisa bercakap-cakap seperti biasa.")+emoji.get('blush');
					tmp_user[0].step = 6;
					tmp_user[0].nickname = "kakak";	
					tmp_user[0].nickname = "laki-laki";	
					setData(users_list, 'utf8', users)
					.then(
						function(result) {
							console.log("set users data");
							console.log(result);
						}, function(err) {
							console.log(err);
						}
					).catch(error => console.log('Error: ', error));
				}else{
					bot.sendMessage(tmp_user[0].chat_id,"kak, oemar tidak mengerti maksud jawaban kakak."+emoji.get('thinking_face')+"\nkakak dapat memilih jawaban antara : "+answer_yes_list.toString().replace(/[^a-zA-Z0-9\ \-\,]/g,'')+"."+emoji.get('blush'));
				}		
			break;
		}
	}
});
