process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '	TOKEN TELEGRAM';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
	const chatId = msg.chat.id;
	const message = msg.text.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g,'');
	var  worng_salam = /^((ass$)|(as$)|(mikum)|(asskum)|(assamu)|(samlekum)|(ha\w)|(hel\w)|(hi\w))/i;
	var  good_salam = /^assalamualaikum/g;
	var ask = /(apa)|(bagaimana)|(gimana)|(siapa)|(kapan)|(dimana)|(mana)|(berapa)|(boleh*)/g;
	var reply_smile = /(waiyyakum)|(jazakallah*)|(hebat)|(pintar)/;
	// bot.sendMessage(chatId,worng_salam.test(message));

	//logic untuk salam
	worng_salam.test(message)?bot.sendMessage(chatId, "Muslim yang baik harus mengucapkan salam dengan lengkap.\n\nSeperti \"Assalamu'alaikum\" atau \"Assalamu'alaikum Warahmatullahi Wabarakatuh\".\n\nAfwan, ukh. Bisa tolong coba di ucap lagi salamnya? :)\n"):
	good_salam.test(message)? bot.sendMessage(chatId, "Wa'alaikumussalam Warahmatullahi Wabarakatuh, ukh :)"):message.replace(ask,'').length>0?message.replace(ask,'').includes("kabar")?bot.sendMessage(chatId,"Alhamdulillah, baik ukh..."):
	message.replace(ask,'').match(/(nama*)+(kamu)?/)?bot.sendMessage(chatId,"Muhammad Oemar :)"): message.replace(ask,'').match(/(tuhan*)+(kamu)?/)?bot.sendMessage(chatId,"Allah SWT :)"):message.replace(ask,'').match(/(agama*)+(kamu)?/)?bot.sendMessage(chatId,"Islam agamaku :)"):message.replace(ask,'').match(/(rasul*)+(kamu)?/)?
	bot.sendMessage(chatId,"Nabi Muhammad SAW :)") : reply_smile.test(message.replace(ask,''))?bot.sendMessage(chatId,"Syukron, ukhti :)") : bot.sendMessage(chatId,"Iya, ukh? :)"):bot.sendMessage(chatId,"Hmm...\nAku belum mengerti itu, ukh? :)");
	// bot.sendMessage(chatId,ask.test(message));

});