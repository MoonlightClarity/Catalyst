import json, urllib.request
import websocket

targets=json.load(urllib.request.urlopen('http://127.0.0.1:9230/json/list'))
t=next(x for x in targets if x.get('url')=='chrome-extension://fnjbijbhcehgoglobkicibfpcmddlggg/service-worker-loader.js')
ws=websocket.create_connection(t['webSocketDebuggerUrl'], timeout=5, origin='http://127.0.0.1:9230')
ws.send(json.dumps({'id':1,'method':'Runtime.evaluate','params':{'expression':"chrome.storage.local.get('catalystRoutingDebug')",'awaitPromise':True,'returnByValue':True}}))
while True:
    msg=json.loads(ws.recv())
    if msg.get('id')==1:
        print(json.dumps(msg, indent=2))
        break
ws.close()
