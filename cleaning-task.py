#!/usr/local/bin/python3.9
#
from tinydb import TinyDB, Query
import asyncio, datetime

db = TinyDB('temporaldb.json')

async def clean_db():
  while True:
    Password = Query()
    datetimenow = datetime.datetime.now()
    db.remove(Password.expire_date < str(datetimenow))
    print(f"Last database cleaning task has been executed at {datetimenow}")
    await asyncio.sleep(3600) # 1 hour

loop = asyncio.new_event_loop()
loop.create_task(clean_db())

try:
  loop.run_forever()
except asyncio.CancelledError:
  pass
