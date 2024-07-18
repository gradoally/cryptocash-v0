from telebot import types
import telebot
import requests

from background import keep_alive

URL = 'https://e601b8e5.cryptocash-v0.pages.dev/'
TG_TOKEN = '7436582281:AAFJXTwMB0Q-1CubQ1dpkDfNpWn2OsWXFXU'
BASE_URL = 'https://cryptocash-atm-olympics-af4551b078cc.herokuapp.com'

def webAppKeyboard():
   keyboard = types.InlineKeyboardMarkup(row_width=1)
   webAppTest = types.WebAppInfo(URL)
   one_butt = types.InlineKeyboardButton(text="Play!", web_app=webAppTest)
   keyboard.add(one_butt)

   return keyboard
def has_referrer(user_id):
    res = requests.post(f'{BASE_URL}/ref/has_ref',json={'tg_id':user_id})
    return res.json()['has_ref']
def get_all_users():
    data = requests.post(f'{BASE_URL}/users/all')
    return data.json()['users']
def add_ref(creator, come, has_tg_premium, user_name):
    requests.post(f'{BASE_URL}/ref/add',json={'creator':creator,'come':come, 'has_tg_premium':has_tg_premium, 'user_name':user_name})

bot = telebot.TeleBot(TG_TOKEN)

@bot.message_handler(commands=['start'])
def send_welcome(message: types.Message):
    photo = open('./main_image.png', 'rb')
    bot.send_photo(message.chat.id, photo, '''
Cryptocash is the next step in the evolution of money. 
It is real cash money but with all the good traits of crypto. 
Join our official channel to learn more: https://t.me/cryptocash_atm
                     ''', reply_markup=webAppKeyboard()) 
    
    
    user_id = message.from_user.id
    if not has_referrer(user_id):
        if " " in message.text:
            referrer_candidate = message.text.split()[1]
            try:
                referrer_candidate = int(referrer_candidate)
                if user_id != referrer_candidate and referrer_candidate in get_all_users():
                    referer = referrer_candidate
                    has_tg_premium = message.from_user.is_premium
                    user_name = message.from_user.first_name
                    add_ref(referer, user_id, has_tg_premium, user_name)

            except ValueError as e:
                print('e: ',e)
                pass

if __name__ == '__main__':
    keep_alive()
    bot.infinity_polling()
