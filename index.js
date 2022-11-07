const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '5653674582:AAFi9A9ohBYY4yg2a7rsvZ2jQkxJv1RE3yw';

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен её отгадать!)');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    console.log(gameOptions);
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
};

const start = () => {
    bot.setMyCommands([
        {
            command: '/start',
            description: 'Начальное приветствие',
        },
        {
            command: '/info',
            description: 'Вывод информации о пользователе',
        },

        {
            command: '/game',
            description: 'Начать игру',
        },
    ]);
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(
                chatId,
                'https://tlgrm.eu/_/stickers/7e8/aa6/7e8aa67b-ad91-4d61-8f62-301bde115989/192/3.webp',
            );
            return bot.sendMessage(chatId, `Welcome in this bot, ${msg.from.first_name}`);
        }
        if (text === '/info') {
            return bot.sendMessage(
                chatId,
                `Your name is ${msg.from.first_name} ${msg.from.last_name}`,
            );
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз');
    });
    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(
                chatId,
                `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
                againOptions,
            );
        } else {
            return bot.sendMessage(
                chatId,
                `К сожалению ты не угадал, бот загадал число ${chats[chatId]}`,
                againOptions,
            );
        }
        console.log(msg);
    });
};

start();
