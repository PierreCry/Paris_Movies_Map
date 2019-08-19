import json


s =[]
with open("data_full.json", 'r') as f:
    datastore = json.load(f)
    for enregistrement in datastore['features']:
        # print(enregistrement['properties']['date_debut'])
        # print(enregistrement['properties']['date_fin'])
        s.append(enregistrement['properties']['date_fin'])

print(len(s))
print(len(set(s)))
# with open("../data_full_id.json", 'w') as f:
#     json.dump(datastore, f, ensure_ascii=False)

