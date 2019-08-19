import json


CPT = 0


with open("../data_full.json", 'r') as f:
    datastore = json.load(f)
    for enregistrement in datastore["features"]:
        # print(enregistrement)
        enregistrement['properties']['id'] = CPT
        CPT += 1


with open("../data_full_id.json", 'w') as f:
    json.dump({"features": datastore}, f, ensure_ascii=False)
