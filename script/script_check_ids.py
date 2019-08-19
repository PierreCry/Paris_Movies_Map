import json


CPT = 0

z = []
with open("todelete.json", 'r') as f:
    datastore = json.load(f)
    for enregistrement in datastore:
        z.append(enregistrement["properties"]["id"])

z = sorted(z)
sz = [i for i in range(z[-1])]
z = set(z)
sz = set(sz)
print(sz - z)
