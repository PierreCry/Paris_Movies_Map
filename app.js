// durée moyenne d'un tournage (différence entre la date_debut et la date_fin)

var express = require('express');
var app = express();
const http = require('http');
var path = require('path');
const Datastore = require('nedb');
const bodyParser = require('body-parser');


// let geojson = require('./data_full.json');
// let geojson = require('./data.json');

// var db = new Datastore({ filename: 'smalldata.db', autoload: true, corruptAlertThreshold: 1 });
var db = new Datastore({ filename: 'data.db', autoload: true, corruptAlertThreshold: 1 });

// console.log(geojson.features.length);
// for (var i = 0; i < geojson.features.length; i++) {
//     db.insert(geojson.features[i]);
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'));

app.get('/geojson', function (request, response) {
    db.find({}, function (err, docs) {
        response.send({ type: "FeatureCollection", features: docs });
    });
});

//////////////////////////////////////////////////////////////////////

app.get('/alltitre', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.titre": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.titre);
        }
        response.send({ nb: s.size, info: Array.from(s) });
    });
});

app.get('/allreal', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.realisateur": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.realisateur);
        }
        response.send({ nb: s.size, info: Array.from(s) });
    });
});

app.get('/allorga', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.organisme_demandeur": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.organisme_demandeur);
        }
        response.send({ nb: s.size, info: Array.from(s) });
    });
});

// cette fonction permet de donner le prochain ID lorsqu'on ajoute un nouveau marqueur dans la carte et donc dans la base
app.get('/nombredeligne', function (req, res) {
    db.find({}, { "properties.id": 1 }, function (err, docs) {
        var maxid = 0;
        for (var i = 0; i < docs.length; i++) {
            var current = parseInt(docs[i].properties.id, 10);
            if (current > maxid) {
                maxid = current;
            }
        }
        // console.log(maxid);
        res.send({ nb: maxid + 1 });
    });

});

// nombre de tournage par realisateur
app.get('/tournagesparreal', function (req, res) {

    var m = {};
    db.find({}, { "properties.realisateur": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (typeof m[docs[i].properties.realisateur] == 'undefined') {
                m[docs[i].properties.realisateur] = 1;
            } else {
                m[docs[i].properties.realisateur] += 1;
            }
        }

        res.send({ result: m, taille: Object.keys(m).length });
    });
});


// nombre de tournage par production
app.get('/tournagesparprod', function (req, res) {

    var m = {};
    db.find({}, { "properties.titre": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (typeof m[docs[i].properties.titre] == 'undefined') {
                m[docs[i].properties.titre] = 1;
            } else {
                m[docs[i].properties.titre] += 1;
            }
        }

        res.send({ result: m, taille: Object.keys(m).length });
    });
});

// nombre de tournage par arrondissement
app.get('/tournagesparardt', function (req, res) {

    var m = {};
    db.find({}, { "properties.ardt": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (typeof m[docs[i].properties.ardt] == 'undefined') {
                m[docs[i].properties.ardt] = 1;
            } else {
                m[docs[i].properties.ardt] += 1;
            }
        }

        res.send({ result: m, taille: Object.keys(m).length });
    });
});

// nombre de tournage par Organisme demandeur
app.get('/tournagesparorga', function (req, res) {

    var m = {};
    db.find({}, { "properties.organisme_demandeur": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (typeof m[docs[i].properties.organisme_demandeur] == 'undefined') {
                m[docs[i].properties.organisme_demandeur] = 1;
            } else {
                m[docs[i].properties.organisme_demandeur] += 1;
            }
        }

        res.send({ result: m, taille: Object.keys(m).length });
    });
});

app.get('/tournagespararrdtpartype', function (req, res) {

	m = {};
	
    db.find({}, { "properties.type_de_tournage": 1, "properties.ardt": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            var type = docs[i].properties.type_de_tournage;
			var ardt = docs[i].properties.ardt;
			// console.log(type);
            if (typeof m[ardt] == 'undefined' && type != "" && ardt != "" ) {
                m[ardt]={"TELEFILM":0,"SERIE TELEVISEE":0,"LONG METRAGE":0};
				m[ardt][type]= 1;
			}
			else if (type != "" && ardt != ""){
				m[ardt][type]= m[ardt][type]+1;
				
			} 
        }
 
        res.send({ result : m });
    });
});

// Nombre de chaque type de tournage
app.get('/tournagespartype', function (req, res) {

    var m = {};
    db.find({}, { "properties.type_de_tournage": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (typeof m[docs[i].properties.type_de_tournage] == 'undefined') {
                m[docs[i].properties.type_de_tournage] = 1;
            } else {
                m[docs[i].properties.type_de_tournage] += 1;
            }
        }

        res.send({ result: m, taille: Object.keys(m).length });
    });
});

app.get('/tournagesparmoisparprod', function (req, res) {

	var m= {};
	
	for (var i = 0; i < 12; i++) {
        m[i] = 0;
    }
	
	var l= {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[]};
	
    db.find({}, { "properties.titre": 1, "properties.date_debut": 1, "properties.date_fin": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            var prod = docs[i].properties.titre;
            var mois_debut = docs[i].properties.date_debut.split("-")[1];
            var mois_fin = docs[i].properties.date_fin.split("-")[1];
            if (typeof date_debut != undefined && typeof date_fin != undefined && typeof prod != undefined) {
                mois_debut = parseInt(mois_debut);
                mois_fin = parseInt(mois_fin);
				var b = false;
				for (var k = 0; k < mois_fin-mois_debut+1;k++){
					for (var j=0;j<l[mois_debut-1].length;j++){
						if (l[mois_debut-1][j]==prod){
						b=true;
						break;
					}
				}
					if (b == false){
						l[mois_debut - 1].push(prod);
					} 
				}
				
			}
        }
            

		for (key in l){
			m[key]=l[key].length;
		}
	res.send({ result : m});
    });
});


// nombre de tournage EN COURS par Mois

app.get('/tournagesparmoispartype', function (req, res) {

    var longm = {};
    var telef = {};
    var serie = {};
    var sanstype = {}
    // fill m
    for (var i = 0; i < 12; i++) {
        longm[i] = telef[i] = serie[i] = sanstype[i] = 0;
    }
    // console.log(longm,telef,serie);

    db.find({}, { "properties.type_de_tournage": 1, "properties.date_debut": 1, "properties.date_fin": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(parseInt(m[docs[i].properties.date_debut].split("-")[1]));
            var type = docs[i].properties.type_de_tournage;
            var mois_debut = docs[i].properties.date_debut.split("-")[1];
            var mois_fin = docs[i].properties.date_fin.split("-")[1];
            if (typeof date_debut != undefined && typeof date_fin != undefined && typeof type != undefined) {
                mois_debut = parseInt(mois_debut);
                mois_fin = parseInt(mois_fin);
                // console.log(mois_fin, mois_debut, mois_fin - mois_debut);
                if (type == "LONG METRAGE") {
                    if (mois_fin - mois_debut == 0) {
                        longm[mois_debut - 1] += 1;
                    } else {
                        for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
                            longm[j - 1] += 1;
                        }
                    }
                }
                else if (type == "SERIE TELEVISEE") {
                    if (mois_fin - mois_debut == 0) {
                        serie[mois_debut - 1] += 1;
                    } else {
                        for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
                            serie[j - 1] += 1;
                        }
                    }
                }
                else if (type == "TELEFILM") {
                    if (mois_fin - mois_debut == 0) {
                        telef[mois_debut - 1] += 1;
                    } else {
                        for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
                            telef[j - 1] += 1;
                        }
                    }
                }
                else {
                    if (mois_fin - mois_debut == 0) {
                        sanstype[mois_debut - 1] += 1;
                    } else {
                        for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
                            sanstype[j - 1] += 1;
                        }
                    }
                }
            }

        }
        res.send({ resultlongm: longm, resulttelef: telef, resultserie: serie, resultsanstype: sanstype });
    });
});

app.get('/tournagesparmois', function (req, res) {

    var m = {};
    // fill m
    for (var i = 0; i < 12; i++) {
        m[i] = 0;
    }
    // console.log(m);

    db.find({}, { "properties.date_debut": 1, "properties.date_fin": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(parseInt(m[docs[i].properties.date_debut].split("-")[1]));
            var mois_debut = docs[i].properties.date_debut.split("-")[1];
            var mois_fin = docs[i].properties.date_fin.split("-")[1];
            if (typeof date_debut != undefined && typeof date_fin != undefined) {
                mois_debut = parseInt(mois_debut);
                mois_fin = parseInt(mois_fin);
                // console.log(mois_fin, mois_debut, mois_fin - mois_debut);
                if (mois_fin - mois_debut == 0) {
                    m[mois_debut - 1] += 1;
                } else {
                    for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
                        m[j - 1] += 1;
                    }
                }
            }

        }
        res.send({ result: m });
    });
});

app.get('/dureepartournage2', function (req, res) {
	var j1 = [];
	var j2 = [];
	var j3 = [];
	var j4 = [];
	var j5 = [];
	var j6 = [];
	
	var t = [j1,j2,j3,j4,j5,j6];
    db.find({}, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            var debut = docs[i].properties.date_debut;
            var fin = docs[i].properties.date_fin;
            if (typeof date_debut != undefined && typeof date_fin != undefined) {
                var diff = {}                           // Initialisation du retour
                var tmp = new Date(fin) - new Date(debut);

                tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
                diff.sec = tmp % 60;                    // Extraction du nombre de secondes

                tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
                diff.min = tmp % 60;                    // Extraction du nombre de minutes

                tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
                diff.hour = tmp % 24;                   // Extraction du nombre d'heures

                tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
                diff.day = tmp + 1;

                // console.log(diff.day);
				
				// console.log("j"+diff.day);
				if (diff.day>=6){
					day = 5
				}
				else{
					day=diff.day-1
				}
				var tab = t[day];
				// console.log(tab);
                if (isNaN(diff.day) == false) {
					// console.log(docs[i]);
                    tab.push(docs[i]);
                }
            }
        }

        res.send({listTournage : t});
    });
});

//durée de chaque tournage
app.get('/dureepartournage', function (req, res) {

    var m = {};

    db.find({}, { "properties.date_debut": 1, "properties.date_fin": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            var debut = docs[i].properties.date_debut;
            var fin = docs[i].properties.date_fin;
            if (typeof date_debut != undefined && typeof date_fin != undefined) {
                var diff = {}                           // Initialisation du retour
                var tmp = new Date(fin) - new Date(debut);

                tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
                diff.sec = tmp % 60;                    // Extraction du nombre de secondes

                tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
                diff.min = tmp % 60;                    // Extraction du nombre de minutes

                tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
                diff.hour = tmp % 24;                   // Extraction du nombre d'heures

                tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
                diff.day = tmp + 1;

                // console.log(diff.day);
                if (isNaN(diff.day) == false) {

                    if (isNaN(m[diff.day])) {
                        m[diff.day] = 1;
                    }
                    else {
                        m[diff.day]++;
                    }
                }


            }
        }
        l = {}
        for (const key in m) {
            if (key > 6) {
                l[6] = l[6] + m[key]
            }
            else {
                l[key] = m[key]
            }
        }
        res.send({ result: l });
    });
});


// nombre de film par realisateurs
app.get('/filmparreal', function (req, res) {
    var m = {};
    db.find({}, { "properties.realisateur": 1, "properties.titre": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(docs[i].properties.titre);
            if (typeof m[docs[i].properties.realisateur] == 'undefined') {
                m[docs[i].properties.realisateur] = new Set();
                m[docs[i].properties.realisateur].add(docs[i].properties.titre);
            } else {
                m[docs[i].properties.realisateur].add(docs[i].properties.titre);
            }
        }
        for (const key in m) {
            m[key] = Array.from(m[key]);
        }
        res.send({ result: m });
    });
});

//////////////////////////////////////////////////////////////////////

app.post('/userInput', function (req, res) {
    var temp = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                parseFloat(req.body.y).toFixed(14),
                parseFloat(req.body.x).toFixed(14)
            ]
        },
        "properties": {
            "type_de_tournage": "",
            "organisme_demandeur": "",
            "adresse": "",
            "date_fin": "",
            "realisateur": "",
            "xy": [
                parseFloat(req.body.x).toFixed(14),
                parseFloat(req.body.y).toFixed(14)
            ],
            "ardt": "",
            "titre": "",
            "date_debut": "",
            "id": parseInt(req.body.id, 10)
        },
    };
    db.insert(temp, function (err, newDoc) {
        if (err) res.send({ status: -1, message: 'Error has occured' });
        else {
            res.send({ status: 0, message: "Document created pour l'id " + req.body.id, data: temp });
        }
    });
});

app.post('/modifmarqueur', function (req, res) {
    var temp = {
        "properties.type_de_tournage": req.body.type_de_tournage,
        "properties.organisme_demandeur": req.body.organisme_demandeur,
        "properties.adresse": req.body.adresse,
        "properties.realisateur": req.body.realisateur,
        "properties.ardt": req.body.ardt,
        "properties.titre": req.body.titre,
        "properties.date_fin": req.body.date_fin,
        "properties.date_debut": req.body.date_fin
    }

    db.update({ "properties.id": parseInt(req.body.id, 10) }, { $set: temp }, {}, function (err, num) {
        if (err) res.send({ status: -1, message: 'unknown question id' });
        else {
            console.log("nombre d'enregistrement dans la base MODIFIER : ", num);
            res.send({ status: 0, message: "Document updated pour l'id " + req.body.id, data: temp });
        }
    })

});

app.post('/modiflatlng', function (req, res) {
    console.log(req.body.id);
    var temp = {
        "coordinates": [parseFloat(req.body.y), parseFloat(req.body.x)],
        "xy": [parseFloat(req.body.x), parseFloat(req.body.y)]
    }
    db.update({ "properties.id": parseInt(req.body.id, 10) }, { $set: { "properties.xy": temp.xy, "geometry.coordinates": temp.coordinates } }, {}, function (err, numReplaced) {
        console.log(numReplaced);
    });
    res.send({ status: 0, message: "all good" });
});

app.post('/removemarqueur', function (req, res) {
    // console.log(req.body.id, parseInt(req.body.id, 10));
    db.remove({ "properties.id": parseInt(req.body.id, 10) }, {}, function (err, num) {
        if (err) res.send({ status: -1, message: 'unknown question id' });
        else {
            console.log("nombre d'enregistrement dans la base RETIRE : ", num);
            res.send({ status: 0, message: "Document removed pour l'id " + req.body.id });
        }
    });
});

app.post('/loadFields', function (req, res) {
    // console.log(req.body.id, typeof req.body.id);
    res.send({ status: 0 });
});

app.post('/filterform', function (req, res) {
    // console.log("here", req.body.data);
    var toCompare = {};
    var dbString = {};
    var reponse = []

    for (var key in req.body.data) {
        if (req.body.data[key]) {
            dbString["properties." + key.toString()] = 1;
            if (key !== "ardt") {
                toCompare[key] = req.body.data[key].replace(/\+/g, ' ').trim();
            } else {
                toCompare[key] = parseInt(req.body.data[key].replace(/\+/g, ' ').trim(), 10);
            }
        }
    }

    // console.log(toCompare);

    db.find({}, {}, function (err, docs) {
        if (err) res.send({ status: -1, message: 'error' });
        for (var i = 0; i < docs.length; i++) {
            var flag = true;
            for (var key in toCompare) {
                // console.log(key);
                // console.log("comp", docs[i].properties[key], "/", toCompare[key], docs[i].properties[key] == toCompare[key]);
                if (key == "date_debut" || key == "date_fin") {
                    if (typeof toCompare["date_debut"] == "undefined") {
                        var datedebutUser = Date.parse("2016-01-01");
                    } else {
                        var datedebutUser = Date.parse(toCompare["date_debut"]);
                    }

                    if (typeof toCompare["date_fin"] == "undefined") {
                        var datefinUser = Date.parse("2016-12-31");
                    } else {
                        var datefinUser = Date.parse(toCompare["date_fin"]);
                    }
                    var datedebutDB = Date.parse(docs[i].properties["date_debut"]);
                    var datefinDB = Date.parse(docs[i].properties["date_fin"]);
                    // console.log(toCompare["date_debut"], toCompare["date_fin"], docs[i].properties["date_debut"], docs[i].properties["date_fin"])
                    // console.log(datedebutUser, datefinUser, datedebutDB, datefinDB);
                    // console.log("-------------------------------------------------------");


                    if (datedebutDB >= datedebutUser && datedebutDB <= datefinUser && datefinDB >= datedebutUser && datefinDB <= datefinUser) {
                        flag = true;
                    } else {
                        flag = false;
                        break;
                    }
                }
                else if (key == "type_de_tournage" && toCompare[key] == "NON RENSEIGNE") {
                    flag = true;
                }
                else if (docs[i].properties[key] !== toCompare[key]) {
                    // console.log(docs[i].properties[key], toCompare[key]);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                // console.log("i", docs[i]);
                reponse.push(docs[i].properties);
            }
        }
        // console.log(reponse);
        res.send({ status: 0, data: reponse });
    });
});


//////////////////////////////////////////////////////////////////////

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'map.html'));
});

app.get('/stats', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'stats.html'));
});

http.createServer(app).listen(444, function () {
    console.log("Server is up and running...");
});