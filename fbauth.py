import requests
f = open('fbdeets.txt')
d = [line.rstrip('\n') for line in f.readlines()]
p = {'client_id': d[0],
	 'client_secret': d[1],
	 'grant_type': 'client_credentials'
	}

r = requests.get('https://graph.facebook.com/oauth/access_token', params=p)

print r.text