import json
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy import Boolean, Column, Integer, String, create_engine, JSON
from sqlalchemy.orm import DeclarativeBase

import requests

from hashlib import sha256

app = Flask(__name__)
cors = CORS(app)
engine = create_engine('sqlite:///server.db')

class Base(DeclarativeBase):
    pass
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    tg_id = Column(Integer)
    coins = Column(Integer, default=0)
    energy = Column(Integer, default=500)
    max_energy = Column(Integer, default=500)
    coins_per_click = Column(Integer, default= 1)
    country = Column(String(255))
    jwt = Column(String(255))
    has_print_bot = Column(Boolean,default=False)
    multi_print_lvl = Column(Integer, default=1)
    recharging_speed_lvl = Column(Integer, default=1)
    energy_limit_lvl = Column(Integer, default=1)
    printed_notes = Column(Integer, default=0)
class Ref(Base):
    __tablename__ = 'ref'
    
    id = Column(Integer, primary_key=True)
    creator_user = Column(Integer)
    come_user = Column(Integer)
class Task(Base):
    __tablename__ = 'tasks'
    
    id = Column(Integer, primary_key=True)
    type = Column(Integer, default=0)
    data = Column(JSON)
    
    #   {'title': 'Join our socials', 'icon': TiSocialYoutube, 'money': '60 000 000', 'complited': false 'tasks': [
    #            { 'title': 'Join the Telegram chat', 'status': 'Go', 'finished': false, 'url': 'https://youtube.com' },
    #            { 'title': 'Join the Telegram chat', 'status': 'Go', 'finished': false, 'url': 'https://youtube.com' },
    #            { 'title': 'Join the Telegram chat', 'status': 'Go', 'finished': false, 'url': 'https://youtube.com' },
    #        ],
    #    }
    

countries = [
  'China',
  'India',
  'United States of America',
  'Indonesia',
  "Congo",
  'Pakistan',
  'Nigeria',
  'Brazil',
  'Bangladesh',
  'Russia',
  'Mexico',
  'Japan',
  'Philippines',
  'Ethiopia',
  'Egypt',
  'Vietnam',
  'Turkey',
  'Iran',
  'Germany',
  'France',
  'United Kingdom',
  'Thailand',
  'South Africa',
  'Tanzania',
  'Italy',
  'Myanmar',
  'Colombia',
  'Kenya',
  'South Korea',
  'Spain',
  'Argentina',
  'Uganda',
  'Algeria',
  'Iraq',
  'Sudan',
  'Canada',
  'Poland',
  'Morocco',
  'Uzbekistan',
  'Ukraine',
  'Angola',
  'Afghanistan',
  'Peru',
  'Malaysia',
  'Mozambique',
  'Saudi Arabia',
]

def get_country_ranks(session: Session):
    users = session.execute(select(User)).scalars().all()
    countries_rank = []
    for u in users:
        has_in = False
        in_obj = None
        for c in countries_rank:
            if c['country'] == u.country:
                has_in = True
                in_obj = c
                break
        if has_in:
            countries_rank.remove(in_obj)
            countries_rank.append({'country':u.country,'coins':u.coins + in_obj['coins']})
        else:
            countries_rank.append({'country':u.country,'coins':u.coins})
    countries_rank.sort(key=lambda c_r:c_r['coins'],reverse=True)
    for i in range(0,len(countries_rank)):
        countries_rank[i]['rank'] = i+1
    return countries_rank

@app.get('/')
def main_page():
    return "Hello World!"

@app.post('/user/auth')
def auth_user():
    data = request.get_json()
    print(data)
    with Session(engine) as session:
        user = session.execute(select(User).where(User.tg_id == data['tg_id'])).scalar()
        if user != None: 
            user.country = data['country']
            session.commit()
            return jsonify({'status':200,'jwt':user.jwt})
        jwt = sha256(f"{data['tg_id']}--{data['country']}".encode()).hexdigest()
        user = User(jwt = jwt, tg_id = data['tg_id'], country = data['country'])
        session.add(user)
        session.commit()
    return jsonify({'status':200,'jwt':jwt})
@app.post('/user/update_coins')
def update_coins():
    data = request.get_json()
    with Session(engine) as session:
        user = session.execute(select(User).where(User.tg_id == data['tg_id'])).scalar()
        if user == None: return jsonify({'status':401})
        
        if user.energy>= user.coins_per_click:
            user.coins += user.coins_per_click
            user.energy -= user.coins_per_click
            user.printed_notes += user.coins_per_click
            session.commit()
        return jsonify({'status':200,'coins':user.coins,'energy':user.energy})
@app.post('/user/get_coins')
def get_coins():
    data = request.get_json()
    with Session(engine) as session:
        user = session.execute(select(User).where(User.tg_id == data['tg_id'])).scalar()
        if user == None: return jsonify({'status':401})
        
        countries_rank = get_country_ranks(session)
        country_rank = list(filter(lambda c_r: c_r['country'] == user.country,countries_rank))[0]
        print(country_rank)
        return jsonify({'status':200, 'coins':user.coins,'coins_per_click':user.coins_per_click,'energy':user.energy,'max_energy':user.max_energy,'country_rank':country_rank['rank']})
@app.get('/user/country/<name>')
def get_user_country(name):
    try:return send_file(f'./flags/{name}.png')
    except:return send_file(f'./flags/Egypt.png')

@app.post('/boost/all')
def get_all_boosts():
    data = request.get_json()
    
    with Session(engine) as session:
        user = session.execute(select(User).where(User.tg_id == data['tg_id'])).scalar()
        if user == None: return jsonify({'status':401})
        price_list = [0]
        for i in range(0,200):
            p = 200
            for _ in range(0, i):
                p *= 2
            price_list.append(p)
    return jsonify({'status':200, 'multi_print':f'{price_list[user.multi_print_lvl]} | {user.multi_print_lvl} level','has_print_bot':user.has_print_bot,'recharging_speed_lvl':f'{price_list[user.recharging_speed_lvl]} | {user.recharging_speed_lvl} level','energy_limit_lvl':f'{price_list[user.energy_limit_lvl]} | {user.energy_limit_lvl} level'})
@app.post('/boost/buy')
def buy_boost():
    data = request.get_json()
    
    with Session(engine) as session:
        user = session.execute(select(User).where(User.tg_id == data['tg_id'])).scalar()
        if user == None: return jsonify({'status':401})
    
        if data['boost_name'] == "Multiprint":
            price = 200
            for _ in range(0,user.multi_print_lvl): price *=2
            price = price / 2
            print(price)
            user.coins -= price
            user.coins_per_click +=1
            user.multi_print_lvl +=1
            session.commit()
        if data['boost_name'] == "Energy Limit":
            price = 200
            for _ in range(0,user.energy_limit_lvl): price *=2
            price = price / 2
            print(price)
            user.coins -= price
            user.max_energy += 500
            user.energy_limit_lvl +=1
            session.commit()
        if data['boost_name'] == "Recharging Speed":
            price = 200
            for _ in range(0,user.recharging_speed_lvl): price *=2
            price = price / 2
            print(price)
            user.coins -= price
            user.recharging_speed_lvl +=1
            session.commit()
        if data['boost_name'] == "Print Bot":
            price = 200_000
            print(price)
            user.coins -= price
            user.has_print_bot = True
            session.commit()
    
        return jsonify({'status':200,'coins':user.coins})

@app.get('/video/earn')
def send_earn_video():
    return send_file('./assets/earn.mp4')

@app.post('/users/all')
def all_users():
    with Session(engine) as session:
        users = session.execute(select(User.tg_id)).scalars().all()
    print(users)
    
    return jsonify({'users':users})
@app.post('/ref/has_ref')
def has_ref():
    tg_id = request.get_json()['tg_id']
    with Session(engine) as session:
        ref = session.execute(select(Ref).where(Ref.creator_user == tg_id)).scalar()
        
    if ref == None:
        return jsonify({'has_ref':False})
    return jsonify({'has_ref':True})
@app.post('/ref/add')
def add_ref():
    data = request.get_json()
    with Session(engine) as session:
        if session.execute(select(Ref).where(Ref.creator_user == data['creator'], Ref.come_user == data['come'])).scalar() != None:
            return 'not ok('
        
        come_user = session.execute(select(User).where(User.tg_id == data['come'])).scalar()
        if come_user == None:
            jwt = sha256(f"{data['come']}--Not selected".encode()).hexdigest()
            come_user = User(tg_id = data['come'], country = 'Not selected', jwt = jwt)
        
            session.add(come_user)
            session.commit()
        
        ref = Ref(creator_user = data['creator'], come_user = data['come'])
        creator_user = session.execute(select(User).where(User.tg_id == data['creator'])).scalar()
        
        creator_user.coins += 5_000
        come_user.coins += 5_000
        
        print(creator_user.id)
        print(come_user.id)
        
        if data['has_tg_premium'] == True:
            creator_user.coins += 20_000
            come_user.coins += 20_000
        
        session.add(ref)
        session.add(come_user)
        session.commit()
    return 'ok'
@app.post('/ref/get')
def get_refs():
    data = request.get_json()
    
    with Session(engine) as session:
        refs = session.execute(select(Ref).where(Ref.creator_user == data['tg_id'])).scalars().all()
        
        return jsonify({'status':200,'count':len(refs)})

@app.post('/tasks/get')
def get_task():
    data = []
    json = request.get_json()
    with Session(engine) as session:
        tasks = session.execute(select(Task)).scalars().all()
        user = session.execute(select(User).where(User.tg_id == json['tg_id'])).scalar()
        
        total_leagues = user.printed_notes
        total_refs = len(session.execute(select(Ref).where(Ref.creator_user == json['tg_id'])).scalars().all())
        
        for task in tasks:
            data.append({"id":task.id,**task.data})
    return jsonify({'status':200,'data':data,"total_leagues":total_leagues,"total_refs":total_refs})
@app.get('/tasks/icons/<file>')
def send_task_icons(file):
    try:return send_file(f'./tasks/{file}')
    except:return send_file(f'./tasks/1.png')
@app.post('/tasks/finish')
def finish_task():
    data = request.get_json()
    with Session(engine) as session:
        user = session.execute(select(User).where(User.tg_id == data['tg_id'])).scalar()
        task = session.execute(select(Task).where(Task.id == data['task_id'])).scalar()
        
        if user == None: return jsonify({'status':401})
        money = int(task.data['money'].replace(" ",""))
        user.coins += money
        
        session.commit()
        
    return jsonify({'status':200})
@app.post('/tasks/claim')
def claim_task():
    data = request.get_json()
    with Session(engine) as session:
        user = session.execute(select(User).where(User.tg_id == data['tg_id'])).scalar()
        user.coins += data['prize']
        session.commit()
    return jsonify({'status':200})
@app.post('/stats/total')
def total_of_stats():
    with Session(engine) as session:
        users = session.execute(select(User)).scalars().all()
        
        total_printed_notes = 0
        for u in users: total_printed_notes += u.printed_notes
        total_users = len(users)
        ranks = get_country_ranks(session)[:3]
        total_rank_money = 0
        for r in ranks: total_rank_money += r['coins']
    
    return jsonify({'status':200, "total_users":total_users,"total_printed_notes":total_printed_notes,"ranks":ranks,"total_rank_money":total_rank_money})

if __name__ == '__main__':
    Base.metadata.create_all(engine)
    #requests.post(f"https://api.telegram.org/bot{TG_TOKEN}/deleteWebhook",headers={'Content-Type':'application/json'})
    #res = requests.post(f"https://api.telegram.org/bot{TG_TOKEN}/setWebhook",json={"url": f"{BASE_URL}/bot/"},headers={'Content-Type':'application/json'})
    #print(res.json())
    # Threaded option to enable multiple instances for multiple user access support
    app.run()
