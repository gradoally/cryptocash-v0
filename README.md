# CRYPTOCASH BOT
Writed on Python + Telebot

### install dependencies
Install python from https://www.python.org/downloads/ recommendation use version (3.12.3). Then install pip from https://pip.pypa.io/en/latest/installation/.
Install dependencies with command:
##### `pip install requests pyTelegramBotAPI`

### `python3 bot.py`
Run telegram bot. You need to go to /bot directory

# Answers

### how to change bakcned URL?
Go to /src/constants/BASE_URL. Paste your URL without "/"

## change, create or delete task?
At /backend/server file you find a table with name "tasks".To create task you need to add unique id field. Change that JSON object, and paste it to data:
`{"type":"special","title":"YOUR_TITLE","money":"YOUR_MONEY","icon":"ICON_NAME","tasks":[
    {"title":"TITLE_OF_TASK", "url":"LINK_OF_TASK"},
    {"title":"TITLE_OF_TASK", "url":"LINK_OF_TASK"},
    {"title":"TITLE_OF_TASK", "url":"LINK_OF_TASK"}
]}`
This is a template. You can add, or delete some tasks from "tasks" key. Example of "Binance Registration" task:
`{"type":"special","title":"Binance Registration","money":"300 000","icon":"2.png","tasks":[
{"title":"Register account", "url":"https://accounts.binance.com/en/register"}
]}`
### change flags?
Change in FRONTEND: go to /src/constants/countries file. Add name of country to a "countries" list. Then go to /public/flags direction. Add a flag with country name + ".png".
### change icons?
At /src/assets you can find all icons. Just change the file with icon.