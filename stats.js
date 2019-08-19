window.onload = function() {

	//TODO : 
	// Régler le bug des charts à choix, pourquoi les données s'affiche pas (Fait mais code de 600 ligne pour sens formulaire -> chart, pas ouf..)
	// Finir les dernières fonctions clics. Régler le bug du clic durée.
	// Rendre fonctionnel le toggleDataSeries.
	// Réorganiser le code

			var dataTournageReal = [];
			var dataTournageArdt = [];
			var dataTypeTournage = [];
			var dataTypeTournage2 = [];
			var dataTournageMois = [];
			var dataDureeTournage = [];
			var dataTournageOrga = [];
			var dataTournageProd = [];
			var line;
			var moisS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre"];
			var dataLongm=[];
			var dataTelef = [];
			var dataSerie = [];
			var dataSansType = [];
			var dataT= [dataLongm,dataTelef,dataSerie,dataSansType];
			var dataArdtLongM = [];
			var dataArdtSerie = [];
			var dataArdtTelef = [];
			var dataA= [dataArdtTelef,dataArdtSerie,dataArdtLongM];			
			var real = {};
			var orga = {};
			var mois = {};
			var ardt = {};
			var prod = {};
			var dataTempArdt=[];
			var dataTempMois=[];
			var dataTempOrga=[];
			var dataTempProd=[];
			var dataTempReal=[];
			var color = {"SERIE TELEVISEE": "blue", "LONG METRAGE": "green", "TELEFILM":"red" };
			
//Fonction utilisant lors du traitement de données
	
function NumberDay(debut,fin){
	var diff = {};
	var tmp = new Date(fin) - new Date(debut);

	tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
	diff.sec = tmp % 60;                    // Extraction du nombre de secondes

	tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
	diff.min = tmp % 60;                    // Extraction du nombre de minutes

	tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
	diff.hour = tmp % 24;                   // Extraction du nombre d'heures

	tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
	diff.day = tmp + 1;
	
	return diff.day;
}
	
function compareNombres(a, b) {
		return a[0] - b[0];
	}

function toolTipContent(e) {
	var str = "";
	var total = 0;
	var str2, str3;
	for (var i = 0; i < e.entries.length; i++){
		var  str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\"> "+e.entries[i].dataSeries.name+"</span>: <strong>"+e.entries[i].dataPoint.y+"</strong> Tournages <br/>";
		total = e.entries[i].dataPoint.y + total;
		str = str.concat(str1);
	}
	var id = e.chart._containerId;
	if (id=="TournageMois" || e.chart.options.name == "TournageParMois2"){
		var title = moisS[e.entries[0].dataPoint.x];
	}
	else{
		var title = e.entries[0].dataPoint.label;
	}
	str2 = "<span style = \"color:DodgerBlue;\"><strong>"+title+"</strong></span><br/>"; //mois[e.entries[0].dataPoint.x]
	total = Math.round(total * 100) / 100;
	str3 = "<span style = \"color:Tomato\">Total:</span><strong>"+total+"</strong> Tournages<br/>";
	return (str2.concat(str)).concat(str3);
}
	
// Fonctions permettant d'afficher le nombre de film, realisateur, organisme et de tournage
function numberLine(data){
	line = data.nb;
	document.getElementById("NombreTournage").innerHTML=line;
}
$.getJSON('http://localhost:444/nombredeligne',numberLine);
	
function NombreFilm(data){
   document.getElementById("NombreDeFilm").innerHTML=data.nb;
}
$.getJSON('http://localhost:444/allTitre',NombreFilm);

function NombreOrga(data){
   document.getElementById("NombreOrganisme").innerHTML=data.nb;
}
$.getJSON('http://localhost:444/allorga',NombreOrga);

function NombreReal(data){
   document.getElementById("NombreReal").innerHTML=data.nb;
}
$.getJSON('http://localhost:444/allreal',NombreReal);
		
	
	
//Option des charts que l'on utilisera
var ChartOptions = {
	width:868.01,
	height: 500,
	animationEnabled: true,
	zoomEnabled: true,
	title: {
		text: ""
	},
	axisY: {
		title: "Nombre de tournage",
		valueFormatString: "#",
	},
	axisX: {
		title: "",
		valueFormatString: "#",
	},
	data: []
}			
	
var ChartPieOptions = {
	width:868.01,
	height: 500,
	theme: "light2",
	animationEnabled: true,
	title: {
		text: "Type de Tournage"
	},
	data: []
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Pourcentage de chaque type de tournage		
		var TypeTournage = new CanvasJS.Chart("TypeTournage", ChartPieOptions);
		TypeTournage.options.data=[{
				click: ClickType,
				type: "pie",
				startAngle: 240,
				yValueFormatString: "##0.00\"%\"",
				indexLabel: "{label} {y}",
				dataPoints: dataTypeTournage
			}];
		
		function ClickType(e){
			// console.log(e);
			if (document.title=="Carte"){
			var id = e.chart._containerId;
			if (id!="chartTemp"){
				document.getElementById('formLoaderFilter').reset();
			}
			document.getElementById('formLoaderFilter__type_de_tournage').value=e.dataPoint.label;
			document.getElementById('sub').click();
			if (id!="chartTemp"){
				$("#close").click();
		}
		else{
				$("#closeTemp").click();
			
		}
		}
		}
		function DataTypeTournage(data) {
			var temp = (Object.getOwnPropertyNames(data.result));
				for (var i = 0; i < data.taille; i++) {
					dataTypeTournage.push({
						y: (data.result[temp[i]]/line)*100,
						label : temp[i],
						color: color[temp[i]]
					});
				}
				TypeTournage.render();	
			}
		$.getJSON('http://localhost:444/tournagespartype',DataTypeTournage);
	
//Partie correspondant à la chart Tournage par mois par les stackedColumn
		var TournageParMois = new CanvasJS.Chart("TournageMois", ChartOptions);
		TournageParMois.options.title={text:"Nombre de Tournage par mois"};
		TournageParMois.options.name="TournageParMois";
		TournageParMois.options.legend = {
		cursor:"pointer",
		itemclick : toggleDataSeries
	};
		TournageParMois.options.toolTip = {
		shared: true,
		content: toolTipContent
	};
		TournageParMois.options.data = [{
				click: ClickMois, 
				type: "stackedColumn",
				showInLegend: true,
				color: "green",
				name: "LONG METRAGE",
				dataPoints: dataLongm
				},
				{        
					click: ClickMois,
					type: "stackedColumn",
					showInLegend: true,
					name: "TELEFILM",
					color: "red",
					dataPoints: dataTelef
				},
				{        
					click: ClickMois,
					type: "stackedColumn",
					showInLegend: true,
					name: "SERIE TELEVISEE",
					color: "blue",
					dataPoints: dataSerie
				}];

//Récupération des données pour la chart Tournage par mois par type	
	function DataTypeParMois(data){
		var temp = (Object.getOwnPropertyNames(data));
		for (var i=0;i<temp.length;i++){
			var result = temp[i];
			var temp2 = (Object.getOwnPropertyNames(data[result]));
			for (j=0;j<temp2.length;j++){
				dataT[i].push({
					y:data[result][temp2[j]],
					label: mois[j]
					});
			}
			                       
			}
		TournageParMois.render();
		}
	
	$.getJSON('http://localhost:444/tournagesparmoispartype', DataTypeParMois)	
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Fonction permettant de clicker sur les charts
function ClickMois(e){
	if (document.title=="Carte"){
		
	var mois = e.dataPoint.x + 1;
	var maxDay= new Date(2016,mois,0).getDate();
	if (mois<10){
		var debut="2016-0"+mois+"-01";
		var fin="2016-0"+mois+"-"+maxDay;
	}
	else{
		var debut="2016-"+mois+"-01";
		var fin="2016-"+mois+"-"+maxDay;
	}
	var id = e.chart._containerId;
	var type = e.dataSeries.type;
	if (id!="chartTemp"){
		document.getElementById('formLoaderFilter').reset();
	}
	if (type=="stackedColumn"){
		document.getElementById('formLoaderFilter__type_de_tournage').value=e.dataSeries.name;
	}
	document.getElementById('formLoaderFilter__date_debut').value=debut;
	document.getElementById('formLoaderFilter__date_fin').value=fin;
	document.getElementById('sub').click();
	if (id!="chartTemp"){
			$("#close").click();
	}
	else{
			$("#closeTemp").click();
		
	}
}
}		
function ClickArrdt(e){
	if (document.title=="Carte"){
	var id = e.chart._containerId;
	if (id!="chartTemp"){
		document.getElementById('formLoaderFilter').reset();
	}
	document.getElementById('formLoaderFilter__ardt').value=e.dataPoint.label;
	document.getElementById('sub').click();
	if (id!="chartTemp"){
			$("#close").click();
	}
	else{
			$("#closeTemp").click();
		
	}
}
}		
function clickOrga(e){
	if (document.title=="Carte"){
	var id = e.chart._containerId;
	if (id!="chartTemp"){
		document.getElementById('formLoaderFilter').reset();
	}
	document.getElementById('formLoaderFilter__organisme_demandeur').value=e.dataPoint.label;
	document.getElementById('sub').click();
	if (id!="chartTemp"){
				$("#close").click();
		}
		else{
				$("#closeTemp").click();
			
		}
}
}
	
function clickProd(e){
	if (document.title=="Carte"){
	
	var id = e.chart._containerId;
	// console.log(e);
	if (id!="chartTemp"){
		document.getElementById('formLoaderFilter').reset();
	}
	document.getElementById('formLoaderFilter__titre').value=e.dataPoint.label;
	document.getElementById('sub').click();
	if (id!="chartTemp"){
				$("#close").click();
		}
		else{
				$("#closeTemp").click();
			
		}
}
}

function ClickReal(e){
	if (document.title=="Carte"){
	var id = e.chart._containerId;
	if (id!="chartTemp"){
		document.getElementById('formLoaderFilter').reset();
	}
	document.getElementById('formLoaderFilter__realisateur').value=e.dataPoint.label;
	document.getElementById('sub').click();
	if (id!="chartTemp"){
				$("#close").click();
		}
		else{
				$("#closeTemp").click();
			
		}
}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Partie correspondant au chart de la durée des tournages
var DureeTournage = new CanvasJS.Chart("TournageDuree", {
	width:868.01,
	height: 500,
	animationEnabled: true, 
	zoomEnabled: true,
	title:{
		text: "Durée des tournages par nombre de jours"
	},
	axisY: {
		title: "Nombre de tournage",
		valueFormatString: "#",
	},
	axisX: {
		title : "Nombre de Jours",
		valueFormatString: "#",
	},
	data: [{
		click:ClickDuree,
		type: "column",
		color: "rgba(54,158,173,.7)",
		markerSize: 5,
		xValueFormatString: "# jour(s)",
		yValueFormatString: "# tournages",
		dataPoints: dataDureeTournage
	}]
});

var dataDuree2=[];	
var dataDuree2Temp = [];

function ClickDuree(e){
	
	if (document.title=="Carte"){
		var id = e.chart._containerId;
		if (id!="chartTemp"){
			var tab = dataDuree2;
		}
		else{
			var tab = dataDuree2Temp;
		}
		
		//console.log(e);
		var response=[];
		$.getJSON('http://localhost:444/dureepartournage2',DataDureeTournage2);
		response = (tab[e.dataPoint.x]);
		// console.log("res",response);
		// console.log(response);
		document.getElementById('formLoaderFilter').reset();
		loadPoint(response);
		var tempo=[];;
		console.log(response);
		if (id!="chartTemp"){
			for(var i=0;i<response.length;i++){
				tempo.push(response[i].properties);
		}
			var temp={data:tempo};
		}
		else{
			var temp={data:response};
		}
		loadTemp(temp);
		if (id!="chartTemp"){
				$("#close").click();
		}
		else{
				$("#closeTemp").click();
			
		}
	}
}
function DataDureeTournage(data) {
	var temp = (Object.getOwnPropertyNames(data.result))
	for (var i = 0; i < temp.length; i++) {
		if (temp[i]==6){
			dataDureeTournage.push({
				y : data.result[temp[i]],
				label : temp[i]+"+"
			});
		}
		else{
			dataDureeTournage.push({
				y : data.result[temp[i]],
				label : temp[i]
		});
		}
	}
	DureeTournage.render();
	}
$.getJSON('http://localhost:444/dureepartournage',DataDureeTournage);

function DataDureeTournage2(data) {
	var temp = (Object.getOwnPropertyNames(data.listTournage));
	for(var i = 0; i< data.listTournage.length;i++){
		dataDuree2.push(data.listTournage[i]);;
	}
	}
	$.getJSON('http://localhost:444/dureepartournage2',DataDureeTournage2);

			
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////			
//Récupération des données pour la chart Tournage par organisme
function DataTournageOrga(data) {
var result = Object.keys(data.result).map(function(key) { 
					return [data.result[key],(key)]; });
	var tabTemp = result.sort(compareNombres);
	
	for (var i = 0; i < tabTemp.length; i++) {
		dataTournageOrga.push({
			y : tabTemp[i][0],
			label : tabTemp[i][1]
		});
	}
}
$.getJSON('http://localhost:444/tournagesparorga',DataTournageOrga);

function DataTournageReal(data) {
		var result = Object.keys(data.result).map(function(key) { 
							return [data.result[key],(key)]; });
		var tabTemp = result.sort(compareNombres);
		
		for (var i = 0; i < tabTemp.length; i++) {
			dataTournageReal.push({
				y : tabTemp[i][0],
				label : tabTemp[i][1]
			});
		}
			}
$.getJSON('http://localhost:444/tournagesparreal',DataTournageReal);

//Nombre de tournages par arrondissement

function DataTournageArdt(data) {
	var result = Object.keys(data.result).map(function(key) { 
					return [data.result[key],(key)]; });
		var tabTemp = result.sort(compareNombres);
		
		for (var i = 0; i < tabTemp.length; i++) {
			dataTournageArdt.push({
				y : tabTemp[i][0],
				label : tabTemp[i][1]
			});
		}
	}
$.getJSON('http://localhost:444/tournagesparardt',DataTournageArdt);

//Récupération des données pour la chart Tournage par Mois
function DataTournageMois(data) {
		var temp = (Object.getOwnPropertyNames(data.result))
			for (var i = 0; i < 12; i++) {
				dataTournageMois.push({
					y: data.result[temp[i]],
					label : moisS[i]
				});
			}
		}
$.getJSON('http://localhost:444/tournagesparmois',DataTournageMois);
			
//Récupération des données pour la chart Tournage par production
		function DataTournageProd(data) {
			var result = Object.keys(data.result).map(function(key) { 
								return [data.result[key],(key)]; });
	var tabTemp = result.sort(compareNombres);
	
	for (var i = 0; i < tabTemp.length; i++) {
		dataTournageProd.push({
			y : tabTemp[i][0],
			label : tabTemp[i][1]
		});
	}
			}
			$.getJSON('http://localhost:444/tournagesparprod',DataTournageProd);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////			
//Récupération des données pour la chart Tournage par Type
		function DataTypeTournage2(data) {
				var temp = (Object.getOwnPropertyNames(data.result));
					for (var i = 0; i < data.taille; i++) {
						dataTypeTournage2.push({
							y: (data.result[temp[i]]/line)*100,
							label : temp[i]
						});
					}
				}
		$.getJSON('http://localhost:444/tournagespartype',DataTypeTournage2);
		



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////			
//Chart correspondant au drilldown avec lequel il y a les réalisateur, le mois, les organisme et arrondissement.
	var PieChoix = {
		"MultiData": [{
			click: ChangementCharts,
			cursor: "pointer",
			explodeOnClick: false,
			innerRadius: "75%",
			legendMarkerType: "square",
			name: "Nombre de Tournage par Type",
			radius: "100%",
			showInLegend: true,
			startAngle: 90,
			type: "doughnut",
			dataPoints: [{ y: 20.00, name : "Arrondissement" },
						{y: 20.00, name : "Organisme"},
						{y: 20.00, name : "Production"},
						{y: 20.00, name : "Réalisateur"},
						{y: 20.00, name : "Mois"}]
		}],
		"Réalisateur": [{
			click:ClickReal,
			type: "column",
			color: "rgba(54,158,173,.7)",
			name: "Réalisateur",
			markerSize: 5,
			xValueFormatString: "YYYY",
			yValueFormatString: "# tournages",
			dataPoints: dataTournageReal
		}],
		"Organisme": [{
			click:clickOrga,
			type: "column",
			color: "rgba(54,158,173,.7)",
			markerSize: 5,
			xValueFormatString: "YYYY",
			yValueFormatString: "# tournages",
			dataPoints: dataTournageOrga
		}],
		"Production": [{
			click : clickProd,
			type: "column",
			color: "rgba(54,158,173,.7)",
			markerSize: 5,
			xValueFormatString: "YYYY",
			yValueFormatString: "# tournages",
			dataPoints: dataTournageProd
		}],
		"Mois": [{
			click:ClickMois,
			color: "#546BC1",
			name: "",
			type: "column",
			xValueFormatString: "#",
			yValueFormatString: "# tournages",
			dataPoints: dataTournageMois
		}],
		"Arrondissement":[{
			click: ClickArrdt,
			type: "bar",
			name: "Arrondissement",
			axisYType: "secondary",
			color: "#014D65",
			xValueFormatString: "YYYY",
			yValueFormatString: "# tournages",
			dataPoints: dataTournageArdt
	}]};

	
	
var TypeTournageOptions = {
		width:868.01,
		height:500,
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Nombre de tournage par type"
		},
		
		subtitles: [{
			text: "Veuillez sélectionner un attribut",
			backgroundColor: "#2eacd1",
			fontSize: 16,
			fontColor: "white",
			padding: 5
		}],
		legend: {
			fontFamily: "calibri",
			fontSize: 14,
			cursor:"pointer",
			itemclick : toggleDataSeries
		},
		data: []
	};

var secondChartsOptions = {
		width:868.01,
		height:500,
		animationEnabled: true,
		zoomEnabled:true,
		theme: "light2",
		axisX: {
			labelFontColor: "#717171",
			lineColor: "#a2a2a2",
			tickColor: "#a2a2a2"
		},
		axisY: {
			gridThickness: 0,
			includeZero: false,
			labelFontColor: "#717171",
			lineColor: "#a2a2a2",
			tickColor: "#a2a2a2",
			lineThickness: 1
		},
		data: []
	};

var chart = new CanvasJS.Chart("chartContainer", TypeTournageOptions);
chart.options.data = PieChoix["MultiData"];
chart.render();

function ChangementCharts(e) {
	// console.log(e);
	var id = e.chart._containerId;		
	chart2 = new CanvasJS.Chart(id, secondChartsOptions);
	chart2.options.data = PieChoix[e.dataPoint.name];
	//console.log(e.name);
	chart2.options.title = { text: "Nombre de tournage par " + e.dataPoint.name }
	$("#backButton").toggleClass("invisible");
	chart2.render();
}

$("#backButton").click(function() {
	$(this).toggleClass("invisible");
	chart = new CanvasJS.Chart("chartContainer", TypeTournageOptions);
	chart.options.data = PieChoix["MultiData"];
	chart.render();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
//Partie correspondant au chart des Arrondissements par type PARTIE REUSSI ET FONCTIONNEL
	
var OptionArdtParType = {
	width:868.01,
	height: 500,
	animationEnabled: true,
	zoomEnabled: true,
	title:{
		text: "Nombre de tournage par arrondissement par type"
	},
	axisY: {
		title: "Nombre de tournage"
	},
	legend: {
		cursor:"pointer",
		itemclick : toggleDataSeries
	},
	toolTip: {
		shared: true,
		content: toolTipContent
	},
	data: []
};

var ArdtParType = new CanvasJS.Chart("TournageArdtParType", OptionArdtParType);
ArdtParType.options.name="ArdtParType";
ArdtParType.options.data=[{
		click:ClickArdt,
		type: "bar",
		showInLegend: true,
		name: "LONG METRAGE",
		color: "green",
		dataPoints: dataArdtLongM
	},
	{
		click:ClickArdt,
		type: "bar",
		showInLegend: true,
		name: "TELEFILM",
		color: "red",
		dataPoints: dataArdtTelef
	},
	{
		click:ClickArdt,
		type: "bar",
		showInLegend: true,
		name: "SERIE TELEVISEE",
		color: "blue",
		dataPoints: dataArdtSerie
	}];

var ArdtParType2 = new CanvasJS.Chart("chartTemp", OptionArdtParType);


function ClickArdt(e){
		var id = e.chart._containerId;
		if (id!="chartTemp"){
				document.getElementById('formLoaderFilter').reset();
		}
		document.getElementById('formLoaderFilter__type_de_tournage').value=e.dataSeries.name;
		document.getElementById('formLoaderFilter__ardt').value=e.dataPoint.label;
		document.getElementById('sub').click();
		if (id!="chartTemp"){
				$("#close").click();
		}
		else{
				$("#closeTemp").click();
			
		}
	}

function DataTypeParArdt(data){
		var temp = (Object.getOwnPropertyNames(data.result));
		var temp2 = (Object.getOwnPropertyNames(data.result[temp[0]]))
		for (var i = 0 ; i<temp.length;i++){
			for (j=0;j<temp2.length;j++){
				dataA[j].push({
					y:data.result[temp[i]][temp2[j]],
					label: temp[i]
					 });
			 }
			                       
		 }
		
		//console.log(dataA);
		ArdtParType.render();
		}
	
	$.getJSON('http://localhost:444/tournagespararrdtpartype', DataTypeParArdt)	


function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		// console.log(e);
		var nom = (e.chart.options.name);
		if (nom=="ArdtParType"){
			ArdtParType.render();
		}
		else if (nom == "ArdtParType2"){
			ArdtParType2.render();
		}
		else if (nom=="TournageParMois"){
			TournageParMois.render();
		}
	}
//////////////////////////////////////////////////////////////////////////:

function loadTemp(response){
	if (typeof response.status=="undefined"){
		var ClickMoisTemp=null;
		var clickRealTemp = null;
		var clickOrgaTemp=null;
		var clickProdTemp=null;
		var ClickArrdtTemp=null;
		var ClickTypeTemp=null;
		var ClickArdtTemp=null;
	}
	else{
		var ClickArdtTemp=ClickArdt;
		var ClickTypeTemp =ClickType;
		var ClickArrdtTemp=ClickArrdt;
		var clickRealTemp=ClickReal;
		var clickOrgaTemp=clickOrga;
		var clickProdTemp=clickProd;
		var ClickMoisTemp=ClickMois;
	}
	// console.log(response);
	$("#statstemp_li").removeClass("disabled");
	mapMarkersTemp = response.data;
						// <!-- console.log("succes", response.data); -->
						$("#NombreTournageTemp").text(response.data.length.toString());

						// calcul et update du nombre de realisateurs présent a l'écran
						var s = new Set();
						for (var i = 0; i < response.data.length; i++) {
							// console.log(response.data)
							s.add(response.data[i].realisateur);
						}
						// console.log({ nb: s.size, info: Array.from(s) });
						$("#NombreRealTemp").text(s.size.toString());

						// calcul et update du nombre d'ogr demandeur présent a l'écran
						var s = new Set();
						for (var i = 0; i < response.data.length; i++) {
							s.add(response.data[i].organisme_demandeur);
						}
						// console.log({ nb: s.size, info: Array.from(s) });
						$("#NombreOrgTemp").text(s.size.toString());

						// calcul et update du nombre de films présent a l'écran
						var s = new Set();
						for (var i = 0; i < response.data.length; i++) {
							s.add(response.data[i].titre);
						}
						// console.log({ nb: s.size, info: Array.from(s) });
						$("#NombreFilmTemp").text(s.size.toString());

						$("#multiTemp").on("click", function () {
							//Bug à résoudre (les données se multiplie au clic. Les tableaux ne se rafraichissent pas.)
							var real = {};
							var orga = {};
							var mois = {};
							var ardt = {};
							var prod = {};
							var dataTempArdt=[];
							var dataTempMois=[];
							var dataTempOrga=[];
							var dataTempProd=[];
							var dataTempReal=[];
							
							var moisS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];

							for (var i = 0; i < 12; i++) {
								mois[i] = 0;
							}
							// <!-- console.log(response.data); -->
							for (var i = 0; i < response.data.length; i++) {
								var mois_debut = response.data[i].date_debut.split("-")[1];
								var mois_fin = response.data[i].date_fin.split("-")[1];
								if (typeof date_debut != undefined && typeof date_fin != undefined) {
									mois_debut = parseInt(mois_debut);
									mois_fin = parseInt(mois_fin);
									// console.log(mois_fin, mois_debut, mois_fin - mois_debut);
									if (mois_fin - mois_debut == 0) {
										mois[mois_debut - 1] += 1;
									} else {
										for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
											mois[j - 1] += 1;
										}
									}
								}
								if (typeof real[response.data[i].realisateur] == 'undefined') {
									real[response.data[i].realisateur] = 1;
								} 
								else{
									real[response.data[i].realisateur] += 1;

								}
								if (typeof prod[response.data[i].titre] == 'undefined') {
									prod[response.data[i].titre] = 1;
								}
								else{
									prod[response.data[i].titre] += 1;								
								}
								if (typeof orga[response.data[i].organisme_demandeur] == 'undefined') {
									orga[response.data[i].organisme_demandeur] = 1;
								} 
								else{
									orga[response.data[i].organisme_demandeur] += 1;
								}
								if (typeof ardt[response.data[i].ardt] == 'undefined') {
									ardt[response.data[i].ardt] = 1;
								} 
								else {
									ardt[response.data[i].ardt] += 1;

								}
							}
							
							var data = { real: real, ardt: ardt, mois : mois, prod: prod, orga: orga };
					
							var resultReal = Object.keys(data.real).map(function(key) { 
								return [data.real[key],(key)]; });
							var tabReal = resultReal.sort(compareNombres); 
							
							var resultArdt = Object.keys(data.ardt).map(function(key) { 
								return [data.ardt[key],(key)]; });
							var tabArdt = resultArdt.sort(compareNombres);
							
							var resultMois = Object.keys(data.mois).map(function(key) { 
								return [(key),data.mois[key]]; });
							var tabMois = resultMois.sort(compareNombres);
							
							// console.log(tabMois);
							
							var resultProd = Object.keys(data.prod).map(function(key) { 
								return [data.prod[key],(key)]; });
							var tabProd = resultProd.sort(compareNombres);
							
							var resultOrga = Object.keys(data.orga).map(function(key) { 
								return [data.orga[key],(key)]; });
							var tabOrg = resultOrga.sort(compareNombres);
							
							for (var i = 0; i < tabReal.length; i++) {
								dataTempReal.push({
									y : tabReal[i][0],
									label : tabReal[i][1]
								});
							}
							
							for (var i = 0; i < tabOrg.length; i++) {
								dataTempOrga.push({
									y : tabOrg[i][0],
									label : tabOrg[i][1]
								});
							}
							
							for (var i = 0; i < tabArdt.length; i++) {
								dataTempArdt.push({
									y : tabArdt[i][0],
									label : tabArdt[i][1]
								});
							}
							

							for (var i = 0; i < tabMois.length; i++) {
								dataTempMois.push({
									y : tabMois[i][1],
									label : moisS[parseInt(tabMois[i][0])]
								});
							}
							
							for (var i = 0; i < tabProd.length; i++) {
								dataTempProd.push({
									y : tabProd[i][0],
									label : tabProd[i][1]
								});
							}
								
								var PieChoixTemp={
										"MultiData": [{
											click: ChangementCharts2,
											cursor: "pointer",
											explodeOnClick: false,
											innerRadius: "75%",
											legendMarkerType: "square",
											name: "Nombre de Tournage par Type",
											radius: "100%",
											showInLegend: true,
											startAngle: 90,
											type: "doughnut",
											dataPoints: [{ y: 20.00, name : "Arrondissement" },
														{y: 20.00, name : "Organisme"},
														{y: 20.00, name : "Production"},
														{y: 20.00, name : "Réalisateur"},
														{y: 20.00, name : "Mois"}]
										}],
										"RéalisateurTemp": [{
											click:clickRealTemp,
											type: "column",
											color: "rgba(54,158,173,.7)",
											name: "Réalisateur",
											markerSize: 5,
											xValueFormatString: "YYYY",
											yValueFormatString: "# tournages",
											dataPoints: dataTempReal
										}],
										"OrganismeTemp": [{
											click:clickOrgaTemp,
											type: "column",
											color: "rgba(54,158,173,.7)",
											markerSize: 5,
											xValueFormatString: "YYYY",
											yValueFormatString: "# tournages",
											dataPoints: dataTempOrga
										}],
										"ProductionTemp": [{
											click : clickProdTemp,
											type: "column",
											color: "rgba(54,158,173,.7)",
											markerSize: 5,
											xValueFormatString: "YYYY",
											yValueFormatString: "# tournages",
											dataPoints: dataTempProd
										}],
										"MoisTemp": [{
											click:ClickMoisTemp,
											color: "#546BC1",
											name: "",
											type: "column",
											dataPoints: dataTempMois
										}],
										"ArrondissementTemp":[{
											click: ClickArrdtTemp,
											type: "bar",
											name: "Arrondissement",
											axisYType: "secondary",
											color: "#014D65",
											dataPoints: dataTempArdt
										}]
								
								};
							
							var chart = new CanvasJS.Chart("chartTemp", TypeTournageOptions);
							chart.options.data = PieChoixTemp["MultiData"];
							chart.render();
							
							function ChangementCharts2(e) {
								// console.log(e);
								var id = e.chart._containerId;
								chart2 = new CanvasJS.Chart(id, secondChartsOptions);
								chart2.options.data = PieChoixTemp[e.dataPoint.name+"Temp"];
								//console.log(e.name);
								chart2.options.title = { text: "Nombre de tournage par "+ e.dataPoint.name }
								$("#backButton2").toggleClass("invisible");
								chart2.render();
								
							}
								$("#backButton2").click(function() {
									$(this).toggleClass("invisible");
									chart = new CanvasJS.Chart("chartTemp", TypeTournageOptions);
									chart.options.data = PieChoixTemp["MultiData"];
									chart.render();
								});

						});
						
						$("#moisTemp").on("click",function(){
						
							var longm = {};
							var telef = {};
							var serie = {};
							
							var dataLongm=[];
							var dataTelef = [];
							var dataSerie = [];
							var dataT= [dataLongm,dataTelef,dataSerie];
							// fill m
							for (var i = 0; i < 12; i++) {
								longm[i] = telef[i] = serie[i]  = 0;
							}
							for (var i = 0; i < response.data.length; i++) {
								// console.log(parseInt(m[docs[i].properties.date_debut].split("-")[1]));
								var type = response.data[i].type_de_tournage;
								var mois_debut = response.data[i].date_debut.split("-")[1];
								var mois_fin = response.data[i].date_fin.split("-")[1];
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
								}
							}
							
							var data = {resultlongm: longm, resulttelef: telef, resultserie: serie};
							var temp = (Object.getOwnPropertyNames(data));
							for (var i=0;i<temp.length;i++){
								var result = temp[i];
								var temp2 = (Object.getOwnPropertyNames(data[result]));
								for (j=0;j<temp2.length;j++){
									dataT[i].push({
										y:data[result][temp2[j]],
										label: mois[j]
										});
								}
													   
								}
								
							var TournageParMois2 = new CanvasJS.Chart("chartTemp", ChartOptions);
							TournageParMois2.options.title={text:"Nombre de Tournage par mois"};
							TournageParMois2.options.name="TournageParMois2";
							TournageParMois2.options.legend = {
											cursor:"pointer",
											itemclick : toggleDataSeries2
										};
							TournageParMois2.options.data=[{
									click: ClickMoisTemp, 
									type: "stackedColumn",
									showInLegend: true,
									color: "green",
									name: "LONG METRAGE",
									dataPoints: dataLongm
									},
									{        
										click: ClickMoisTemp,
										type: "stackedColumn",
										showInLegend: true,
										name: "TELEFILM",
										color: "red",
										dataPoints: dataTelef
									},
									{        
										click: ClickMoisTemp,
										type: "stackedColumn",
										showInLegend: true,
										name: "SERIE TELEVISEE",
										color: "blue",
										dataPoints: dataSerie
									}];
							TournageParMois2.render();
							function toggleDataSeries2(e) {
								if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
									e.dataSeries.visible = false;
								}
								else {
									e.dataSeries.visible = true;
								}
								TournageParMois2.render();
							}
						});
						
						$("#typeTemp").on("click", function () {
							var dataTemp = [];
							var m = {};

							for (var i = 0; i < response.data.length; i++) {
								if (typeof m[response.data[i].type_de_tournage] == 'undefined') {
									m[response.data[i].type_de_tournage] = 1;
								} else {
									m[response.data[i].type_de_tournage] += 1;
								}
							}
							var data = { result: m, taille: Object.keys(m).length };

							var temp = (Object.getOwnPropertyNames(data.result))
							for (var i = 0; i < data.taille; i++) {
								dataTemp.push({
									y: (data.result[temp[i]] / response.data.length) * 100,
									label: temp[i],
									color : color[temp[i]]
								});
							}

							var TournageTypeTemp = new CanvasJS.Chart("chartTemp", ChartPieOptions);
							TournageTypeTemp.options.title={text:"Type de tournage"};
							TournageTypeTemp.options.data= [{
									click : ClickTypeTemp,
									type: "pie",
									startAngle: 240,
									yValueFormatString: "##0.00\"%\"",
									indexLabel: "{label} {y}",
									dataPoints: dataTemp
								}];
							
							TournageTypeTemp.render();
						});
						
						$("#ardtTemp").on("click", function() {
						// console.log("YAYAYAYAkY",response.data);
						var dataArdtTelefTemp=[];
						var dataArdtSerieTemp=[];
						var dataArdtLongMTemp=[];
						var dataATemp= [dataArdtTelefTemp,dataArdtSerieTemp,dataArdtLongMTemp];
						m = {};
						for (var i = 0; i < response.data.length; i++) {
							var type = response.data[i].type_de_tournage;
							var ardt = response.data[i].ardt;
							if (typeof m[ardt] == 'undefined' && type != "" && ardt != "" ) {
								m[ardt]={"TELEFILM":0,"SERIE TELEVISEE":0,"LONG METRAGE":0};
								m[ardt][type]= 1;
							}
							else if (type != "" && ardt != ""){
								m[ardt][type]= m[ardt][type]+1;
							} 
						}
				 
						var data = {result : m };
						
						var ArdtParType2 = new CanvasJS.Chart("chartTemp", OptionArdtParType);
						ArdtParType2.options.name="ArdtParType2";
						ArdtParType2.options.legend = {
											cursor:"pointer",
											itemclick : toggleDataSeries2
										};
						ArdtParType2.options.data=[{
							click:ClickArdtTemp,
							type: "bar",
							showInLegend: true,
							name: "LONG METRAGE",
							color: "green",
							dataPoints: dataArdtLongMTemp
						},
						{
							click:ClickArdtTemp,
							type: "bar",
							showInLegend: true,
							name: "TELEFILM",
							color: "red",
							dataPoints: dataArdtTelefTemp
						},
						{
							click:ClickArdtTemp,
							type: "bar",
							showInLegend: true,
							name: "SERIE TELEVISEE",
							color: "blue",
							dataPoints: dataArdtSerieTemp
						}];
						
						
						var temp = (Object.getOwnPropertyNames(data.result));
						// console.log("temp1",temp);
						//var temp2 = (Object.getOwnPropertyNames(data.result["75001"]))
						//console.log(temp2);
						for (var i = 0 ; i<temp.length;i++){
							var result2 = temp[i];
							var temp2 = (Object.getOwnPropertyNames(data.result[result2]));
							// console.log("temp2",temp2);
							for (j=0;j<temp2.length;j++){
								dataATemp[j].push({
									y:data.result[temp[i]][temp2[j]],
									label: temp[i]
									 });
							 }
						 }
						
						// console.log(dataATemp);
						ArdtParType2.render();
						function toggleDataSeries2(e) {
							if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
								e.dataSeries.visible = false;
							}
							else {
								e.dataSeries.visible = true;
							}
							ArdtParType2.render();
						}
						});
						
						$("#duréeTemp").on("click", function () {
							var dataTemp = [];
							
							var m = {};
							var j1 = [];
							var j2 = [];
							var j3 = [];
							var j4 = [];
							var j5 = [];
							var j6 = [];
							
							var t = [j1,j2,j3,j4,j5,j6];
							// console.log("XEXEXEXEXE", response);
							for (var i = 0; i < response.data.length; i++) {
								// <!-- console.log(response.data[i]); -->
								var debut = response.data[i].date_debut;
								var fin = response.data[i].date_fin;
								if (typeof date_debut != undefined && typeof date_fin != undefined && typeof response.data[i].xy != undefined) {
									                           // Initialisation du retour
									var day = NumberDay(debut,fin);

									// console.log(diff.day);
									if (isNaN(day) == false) {
										// console.log(day);
										if (isNaN(m[day])) {
											m[day] = 1;
										}
										else {
											m[day] = m[day] + 1;
										}
									}
									if (day>=6){
										i_day = 5
									}
									else{
										i_day=day-1
									}
									var tab = t[i_day];
									if (isNaN(day) == false) {
										tab.push(response.data[i]);
									}
								}
							}
							l = {}
							for (const key in m) {
								// <!-- console.log(key); -->
								if (key > 6) {
									l[6] = l[6] + m[key]
								}
								else {
									l[key] = m[key]
								}
							}
							// <!-- console.log(l); -->
							// <!-- console.log(Object.keys(l).length); -->
							var data = { result: l, taille: Object.keys(l).length };

							var temp = (Object.getOwnPropertyNames(data.result))
							for (var i = 0; i < data.taille; i++) {
								if (temp[i] == 6) {
									dataTemp.push({
										y: data.result[temp[i]],
										label: temp[i] + "+"
									});
								}
								else {
									dataTemp.push({
										y: data.result[temp[i]],
										label: temp[i]
									});
								}
							}
							// console.log("ttttt",t);
							for(var i = 0; i< 6;i++){
								dataDuree2Temp.push(t[i]);;
							}
						
							var TournageDureeTemp = new CanvasJS.Chart("chartTemp", ChartOptions);
							TournageDureeTemp.options.title= { text:"Tournage par durée"};
							TournageDureeTemp.options.data = [{
											// click:ClickDuree, 
											type: "column",
											color: "rgba(54,158,173,.7)",
											markerSize: 5,
											yValueFormatString: "# tournages",
											dataPoints: dataTemp
										}];
							
							
							
							TournageDureeTemp.render();
						});

					}


$("#formLoaderFilter").on("submit", function (evt) {
				
				evt.preventDefault();
				loadMap();
				var reponse = $(this).serialize();
				var l_rep = reponse.split("&");
				toSend = {}
				for (var i = 0; i < l_rep.length; i++) {
					var temp = l_rep[i].split("=");
					toSend[temp[0]] = temp[1];
				}
				$.ajax({
					type: "POST",
					url: 'http://localhost:444/filterform',
					data: { data: toSend },
					success: function (response) {
						loadTemp(response)	
			
			}
				});
});

}

