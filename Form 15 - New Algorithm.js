/* This code is executed when form is loaded */
	
	/* Ensure that Fabrik's loaded */
 
	requirejs(['fab/fabrik'], function () {
	
		/* Hide text area where result are stoked */
		var textArea = document.getElementById('orders___textParameters').findClassUp('fabrikElementContainer');
		textArea.hide();
		var textArea2 = document.getElementById('orders___text_art').findClassUp('fabrikElementContainer');
		textArea2.hide();
	
		/* Copy data stocked in the textarea */
		var blockRef = 'form_15';
		var exact = false;
		var form = Fabrik.getBlock(blockRef, exact, function (block) {
			block.elements.get('orders___disp_param').update(block.elements.get('orders___textParameters').get('value'));
			block.elements.get('orders___html_art').update(block.elements.get('orders___text_art').get('value'));
		});
	
	});
	
function copyResults() {
	/* Copy data stocked in the textarea */
	var block = Fabrik.getBlock('form_15');
	var test = block.formElements.get('orders___textParameters').getValue();
};


/* ================ This function prepares the offer ========================= */
function buildOffer() {
	/**
	* Ensure that Fabrik's loaded
	*/
	 
	requirejs(['fab/fabrik'], function () {
		
		var block = Fabrik.getBlock('form_15'); // Carica gli elementi del Form 15 (l'offerta) nella variabile "block"
		var numRepeats = block.repeatGroupMarkers[30]; // Calcola il numero di linee dell'ordine per poterle leggere
		
		/* Costruttore dell'oggetto dove sarà stoccata l'intera offerta */
		offerHotelData = function() {
			/* Parametri occupazionali */
			this.open_days;
			this.yexp;
			this.period;
			this.total_rooms;
			this.totalBeds;
			this.rooms_sold; /* Rooms totali nel periodo */
			this.arrdep; /* Arrivi Presenze nel periodo  */
			this.presences; /* Presenze totali periodo */
			/* Medie occupazionali calcolate dal form */
			this.r_stay;
			this.r_occ; /* Room occupacy */
			this.r_occ_rate;
			this.b_occ_rate;
			this.r_day_occ_av;
			this.p_occ_day_rate;
			this.r_daily_stay_av;
			this.r_daily_dep_av;
			this.output = '';
			this.orderLines = [];
		}
		/* Creiamo l'istanza dell'oggetto offerta */
		thisOfferHotelData = new offerHotelData;
		/* Ora carichiamo i dati non ripetitivi nell'oggetto */
		thisOfferHotelData.open_days = block.formElements.get('orders___open_days').getValue();
		thisOfferHotelData.yexp = block.formElements.get('orders___yexp').get('value');
		thisOfferHotelData.period = block.formElements.get('orders___period').get('value');
		thisOfferHotelData.total_rooms = block.formElements.get('orders___total_rooms').get('value');
		thisOfferHotelData.totalBeds = block.formElements.get('orders___totalBeds').get('value');
		thisOfferHotelData.rooms_sold = block.formElements.get('orders___rooms_sold').get('value');
		thisOfferHotelData.arrdep = block.formElements.get('orders___arrdep').get('value');
		thisOfferHotelData.presences = block.formElements.get('orders___presences').get('value');
		thisOfferHotelData.r_stay = block.formElements.get('orders___r_stay').get('value');
		thisOfferHotelData.r_occ = block.formElements.get('orders___r_occ').get('value'); /* Room occupacy */
		thisOfferHotelData.r_occ_rate = block.formElements.get('orders___r_occ_rate').get('value');
		thisOfferHotelData.b_occ_rate = block.formElements.get('orders___b_occ_rate').get('value');
		thisOfferHotelData.r_day_occ_av = block.formElements.get('orders___r_day_occ_av').get('value');
		thisOfferHotelData.p_occ_day_rate = block.formElements.get('orders___p_occ_day_rate').get('value');
		thisOfferHotelData.r_daily_stay_av  = block.formElements.get('orders___r_daily_stay_av').get('value');
		thisOfferHotelData.r_daily_dep_av = block.formElements.get('orders___r_daily_dep_av').get('value');
		/* Classe dell'oggetto che conterrà i dati della singola linea d'ordine che viene letta */
		var orderLine = function() {
			this.roomType;
			this.room_name;
			this.rooms;
			this.line_rbeds;
			this.roomProminency;
			this.roomProminencyRoom;
			this.roomProminencyArrivi;
			this.roomProminencyPresenze;
			this.nr_num;
			this.line_product;
			this.art_name;
			this.cat;
			this.int_code;
			this.logistics;
			this.buy_price;
			this.sell_price;
			this.pcsCarton;
			this.appCartons;
			this.appraisal;
			this.line_quantity;
			this.avail;
			this.prod_code;
			this.eta;
			this.cpStima;
			this.fixCoeff = 2;
			this.artPerRoom = 0;
			this.extQty = 0;
			this.acquistoRoRs;
			this.margine;
			this.venditaNetta;
			this.venditaRoRs;
			this.appraisedUsage;
			this.coeff;
			this.roomQuote;
			this.shotel;
			this.scons;
			this.margineFisso = 25;
			this.calcCoeff = 0;
			this.coeffCalcMethod = 0;
		}
		/* Classe  */
		var room = function() {
			this.type;
			this.name;
			this.sHotel = 0;
			this.sCons = 0;
			this.roomProminency = 0;
			this.roomProminencyRoom = 0;
			this.roomProminencyArrivi = 0;
		}
		var roomAdd = 0;
		var rooms = [];
		var article = function() {
			this.type;
			this.name = '';
			this.appUsage = 0;
			this.prod_code = '';
			this.cartons = 0;
		}
		var articleAdd = 0;
		var articles = [];
		var totaleAnnoHotel = 0;
		var totaleAnnoConsorziata = 0;
		var lines_replenish_mode; /* The way articles are put in the room */
		var appraisalR; /* Appraisal for "per room" choice */
		var appraisalB; /* Appraisal for "per bed" choice */
		var appraisalF; /* Appraisal for "fix in room" choice */
		
		/* Le variabili seguenti servono per la formazione del display dei risultati */
		var displayRooms = "<p><b>PREVENTIVO CAMERE</b><p><table border='1'><tr class='resultLineHeader'><td class='resultTableHeader' id='RColumn1'>Tipo camera</td><td class='resultTableHeader' id='RColumn2'>Hotel</td><td class='resultTableHeader' id='RColumn3'>Consorziata</td><td class='resultTableHeader' id='RColumn4'>Tot. anno Hotel</td><td class='resultTableHeader' id='RColumn5'>Tot. anno consorziata</td></tr>";
		var displayArticles = "<p><b>DISTINTA PRODOTTI</b><p><table border='1'><tr class='resultLineHeader'><td class='resultTableHeader' id='PColumn1'>Codice</td><td class='resultTableHeader' id='PColumn2'>Prodotto</td><td class='resultTableHeader' id='PColumn3'>Cartoni</td></tr>";
		var artCode = '';
		var artName = '';
		var artCartons = '';

		var roomType = 0;
		var roomName = '';
		var sHotel = 0;
		var sCons = 0;
		var totaleAnnoHotel = 0;
		var totaleConsorziataHotel = 0;			
		
		/* Starts reading articles lines only if at least one is present */
		var checkOfferLines = block.elements.get('orders_7_repeat___line_room_type_0').get('value')
		if (checkOfferLines) {
			for (var lnum = 0; lnum < numRepeats; lnum ++) {
				/* Crea un nuovo oggetto che conterrà la linea dell'ordine */
				thisOfferHotelData.orderLines[lnum] = new orderLine;
				
				/* All'inizio carica i dati della riga d'ordine */
				thisOfferHotelData.orderLines[lnum].roomType = block.formElements.get('orders_7_repeat___line_room_type_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].room_name = block.formElements.get('orders_7_repeat___room_name_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].rooms = block.formElements.get('orders_7_repeat___rooms_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].line_rbeds = block.formElements.get('orders_7_repeat___line_rbeds_' + lnum).getValue();
				
				/* In questa sezione, viene calcolato il "peso" della camera rispetto al totale */
				thisOfferHotelData.orderLines[lnum].roomProminency = thisOfferHotelData.orderLines[lnum].rooms / thisOfferHotelData.total_rooms * 100;
				thisOfferHotelData.orderLines[lnum].roomProminencyRoom = Math.round(thisOfferHotelData.orderLines[lnum].roomProminency * thisOfferHotelData.rooms_sold / 100);
				thisOfferHotelData.orderLines[lnum].roomProminencyArrivi = Math.round(thisOfferHotelData.orderLines[lnum].roomProminency * thisOfferHotelData.arrdep / 100);
				thisOfferHotelData.orderLines[lnum].roomProminencyPresenze = Math.round(thisOfferHotelData.orderLines[lnum].roomProminency * thisOfferHotelData.presences / 100);
				
				/* Continuiamo a caricare gli elementi delle linee d'ordine */
				thisOfferHotelData.orderLines[lnum].nr_num = block.formElements.get('orders_7_repeat___nr_num_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].line_product = block.formElements.get('orders_7_repeat___line_product_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].art_name = block.formElements.get('orders_7_repeat___art_name_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].cat = block.formElements.get('orders_7_repeat___cat_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].int_code = block.formElements.get('orders_7_repeat___int_code_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].logistics = block.formElements.get('orders_7_repeat___logistics_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].buy_price = block.formElements.get('orders_7_repeat___buy_price_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].sell_price = block.formElements.get('orders_7_repeat___sell_price_' + lnum).getValue();
				
				/* Questi elementi servono solo a calcolare i pezzi per cartone, quindi li mettiamo in variabili normali */
				bax_qty = block.formElements.get('orders_7_repeat___bax_qty_' + lnum).getValue();
				bax_carton = block.formElements.get('orders_7_repeat___bax_carton_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].pcsCarton = bax_qty * bax_carton;
				
				/* Ancora elementi da caricare */
				lines_replenish_mode = block.formElements.get('orders_7_repeat___lines_replenish_mode_' + lnum).getValue();
				appraisalR = block.formElements.get('orders_7_repeat___appraisal_' + lnum).getValue();
				appraisalF = block.formElements.get('orders_7_repeat___appraisal_r_' + lnum).getValue();
				appraisalB = block.formElements.get('orders_7_repeat___appraisal_b_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].line_quantity = block.formElements.get('orders_7_repeat___line_quantity_' + lnum).getValue();
				
				/* In base alla scelta (camera, ROOM, posto letto) determiniamo il moltiplicatore per la quantità */
				switch(parseInt(lines_replenish_mode)) {
					case 0 :
						thisOfferHotelData.orderLines[lnum].appraisal = appraisalR;
						thisOfferHotelData.orderLines[lnum].artPerRoom = 1;
						break;
					case 1 :
						thisOfferHotelData.orderLines[lnum].appraisal = appraisalB;
						thisOfferHotelData.orderLines[lnum].artPerRoom = thisOfferHotelData.orderLines[lnum].line_rbeds;
						break;
					case 2 :
						thisOfferHotelData.orderLines[lnum].appraisal = appraisalF;
						thisOfferHotelData.orderLines[lnum].artPerRoom = 1;
						break;
				}
				
				/* Ancora elementi da caricare */
				thisOfferHotelData.orderLines[lnum].avail = block.formElements.get('orders_7_repeat___avail_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].prod_code = block.formElements.get('orders_7_repeat___prod_code_' + lnum).getValue();
				thisOfferHotelData.orderLines[lnum].eta = block.formElements.get('orders_7_repeat___eta_' + lnum).getValue();
				
				/* ====================== HERE WE MAKE CALCULATIONS =======================
				   ======================   TO BE MOVED ON SERVLET  ======================= */
				
				thisOfferHotelData.orderLines[lnum].cpStima = (thisOfferHotelData.r_occ * thisOfferHotelData.orderLines[lnum].appraisal / 100).toFixed(2);
				thisOfferHotelData.orderLines[lnum].coeffCalcMethod = block.formElements.get('orders_7_repeat___coeff_calc_' + lnum).getValue();
				
				/* Selezioniamo, in base al DB prodotti, come va calcolato il coefficiente di stima */
				if (thisOfferHotelData.orderLines[lnum].coeffCalcMethod == 0) {
					thisOfferHotelData.orderLines[lnum].cpStima = (thisOfferHotelData.r_occ * thisOfferHotelData.orderLines[lnum].appraisal / 100).toFixed(2);
				} else {
					thisOfferHotelData.orderLines[lnum].cpStima = (thisOfferHotelData.orderLines[lnum].appraisal / 100).toFixed(2);
				}
				thisOfferHotelData.orderLines[lnum].coeff = ((thisOfferHotelData.r_occ / thisOfferHotelData.r_stay)*thisOfferHotelData.orderLines[lnum].cpStima) + 0.02;
				thisOfferHotelData.orderLines[lnum].extQty = (thisOfferHotelData.orderLines[lnum].coeff * thisOfferHotelData.orderLines[lnum].roomProminencyRoom * thisOfferHotelData.orderLines[lnum].artPerRoom) / 100;
				thisOfferHotelData.orderLines[lnum].acquistoRoRs = thisOfferHotelData.orderLines[lnum].sell_price * thisOfferHotelData.orderLines[lnum].coeff;
				thisOfferHotelData.orderLines[lnum].margine = thisOfferHotelData.orderLines[lnum].sell_price * thisOfferHotelData.orderLines[lnum].margineFisso /100;
				thisOfferHotelData.orderLines[lnum].venditaNetta = parseFloat(thisOfferHotelData.orderLines[lnum].sell_price) + parseFloat(thisOfferHotelData.orderLines[lnum].margine);
				thisOfferHotelData.orderLines[lnum].venditaRoRs = thisOfferHotelData.orderLines[lnum].venditaNetta * thisOfferHotelData.orderLines[lnum].coeff;
				thisOfferHotelData.orderLines[lnum].appraisedUsage = thisOfferHotelData.orderLines[lnum].line_quantity * thisOfferHotelData.orderLines[lnum].coeff * thisOfferHotelData.orderLines[lnum].roomProminency * thisOfferHotelData.rooms_sold / 100;
				thisOfferHotelData.orderLines[lnum].roomQuote = thisOfferHotelData.orderLines[lnum].roomProminency * thisOfferHotelData.rooms_sold;
				thisOfferHotelData.orderLines[lnum].shotel = thisOfferHotelData.orderLines[lnum].venditaRoRs * thisOfferHotelData.orderLines[lnum].line_quantity;
				thisOfferHotelData.orderLines[lnum].scons = thisOfferHotelData.orderLines[lnum].acquistoRoRs * thisOfferHotelData.orderLines[lnum].line_quantity;
				thisOfferHotelData.orderLines[lnum].appCartons = thisOfferHotelData.orderLines[lnum].appraisedUsage / thisOfferHotelData.orderLines[lnum].pcsCarton;
				
				/* ======== IN QUESTA SEZIONE PREPARIAMO IL DB CAMERE E QUELLO PRODOTTI (SENZA DOPPIONI) =============== */
				/* Lista articoli */
				articleAdd = 1;
				for (var artCounter = 0; artCounter < articles.length; artCounter++) {
					if (thisOfferHotelData.orderLines[lnum].line_product == articles[artCounter].type) {
						articles[artCounter].appUsage += Math.round(thisOfferHotelData.orderLines[lnum].appraisedUsage, 0);
						articleAdd = 0;
					}
				}
				if (articleAdd == 1) {
					var thisArticle = new article;
					thisArticle.type = thisOfferHotelData.orderLines[lnum].line_product;
					thisArticle.appUsage = Math.round(thisOfferHotelData.orderLines[lnum].appraisedUsage, 0);
					thisArticle.prod_code = thisOfferHotelData.orderLines[lnum].prod_code;
					thisArticle.name = thisOfferHotelData.orderLines[lnum].art_name;
					thisArticle.cartons = thisOfferHotelData.orderLines[lnum].appCartons;
					articles.push(thisArticle);
				} 
				
				/* Lista rooms */
				roomAdd = 1;
				for (var roomCounter = 0; roomCounter < rooms.length; roomCounter++) {
					if (thisOfferHotelData.orderLines[lnum].roomType == rooms[roomCounter].type) {
						rooms[roomCounter].sHotel += thisOfferHotelData.orderLines[lnum].shotel;
						rooms[roomCounter].sCons += thisOfferHotelData.orderLines[lnum].scons;
						roomAdd = 0;
					}
				}
				if (roomAdd == 1) {
					var thisRoom = new room;
					thisRoom.type = thisOfferHotelData.orderLines[lnum].roomType;
					thisRoom.sHotel = thisOfferHotelData.orderLines[lnum].shotel;
					thisRoom.sCons = thisOfferHotelData.orderLines[lnum].scons;
					thisRoom.name = thisOfferHotelData.orderLines[lnum].room_name;
					thisRoom.roomProminency = thisOfferHotelData.orderLines[lnum].roomProminency;
					thisRoom.roomProminencyRoom = thisOfferHotelData.orderLines[lnum].roomProminencyRoom;
					thisRoom.roomProminencyArrivi = thisOfferHotelData.orderLines[lnum].roomProminencyArrivi
					
					rooms.push(thisRoom);
				} 
				
				
				
				/* =============== LOG SULLA CONSOLE DEI VALORI CALCOLATI ======================== */
				/*
				console.log(
					'Art. '+thisOfferHotelData.orderLines[lnum].line_product+' - '+thisOfferHotelData.orderLines[lnum].art_name.slice(0,20)+
					'; Qty '+thisOfferHotelData.orderLines[lnum].line_quantity+
					'; SHotel '+thisOfferHotelData.orderLines[lnum].shotel.toFixed(4)+
					'; SCons '+thisOfferHotelData.orderLines[lnum].scons.toFixed(4)+
					'; Acq. Netto '+parseFloat(thisOfferHotelData.orderLines[lnum].sell_price).toFixed(5)+
					'; Acq. Ro/Rs '+thisOfferHotelData.orderLines[lnum].acquistoRoRs.toFixed(4)+
					'; Margine '+thisOfferHotelData.orderLines[lnum].margine.toFixed(4)+
					'; Vend. Netta '+thisOfferHotelData.orderLines[lnum].venditaNetta.toFixed(5)+
					'; Vend. Ro/Rs '+thisOfferHotelData.orderLines[lnum].venditaRoRs.toFixed(4)+
					'; Stima '+thisOfferHotelData.orderLines[lnum].appraisal+
					'; CPStima '+thisOfferHotelData.orderLines[lnum].cpStima+
					'; Coeff '+thisOfferHotelData.orderLines[lnum].coeff.toFixed(2)+
					'; Cons. stimati '+thisOfferHotelData.orderLines[lnum].appraisedUsage.toFixed(0)+
					'; Pcs cartone '+thisOfferHotelData.orderLines[lnum].pcsCarton+
					'; Cartoni stimati '+thisOfferHotelData.orderLines[lnum].appCartons.toFixed(0)
				);
				*/
				
			} /* Qui finisce la lettura delle linee d'ordine */


			for (i = 0; i < articles.length; i++) {
				artCode = articles[i].prod_code;
				artName = articles[i].name;
				artCartons = articles[i].cartons
				displayArticles += "<tr><td class='resultText'>"+artCode+"</td><td class='resultText'>"+artName+"</td><td class='resultNumber'>"+artCartons.toFixed(2)+'</td></tr>';
			}

			for (i = 0; i < rooms.length; i++) {
			roomType = rooms[i].type;
			roomName = rooms[i].name;
			sHotel = rooms[i].sHotel.toFixed(4);
			sCons = rooms[i].sCons.toFixed(4);
			totaleAnnoHotel = (rooms[i].sHotel * rooms[i].roomProminencyRoom).toFixed(2);
			totaleConsorziataHotel = (rooms[i].sCons * rooms[i].roomProminencyRoom).toFixed(2);
			
			/* ======================== Display dell'offerta ======================================== */
			displayRooms += "<tr><td class='resultText'>"+roomName+"</td><td class='resultNumber'>"+sHotel+"</td><td class='resultNumber'>"+sCons+"</td><td class='resultNumber'>"+totaleAnnoHotel+"</td><td class='resultNumber'>"+totaleConsorziataHotel+'</td></tr>';
			}
			
				/*
				var output='';
				for (i=0; i<thisOfferHotelData.orderLines.length; i++) {
					output = 'Line '+(i + 1)+' ';
					for (var property in thisOfferHotelData.orderLines[i]) {
						output += property + ': ' + thisOfferHotelData.orderLines[i][property]+'; ';
					}
					console.log(output);
					output = '';
				*/
			
			/* Camere */			
			/*
			for(i=0;i<orderRoomLines.length;i++){
				displayArticles += '<tr><td>' + orderRoomLines[i].room_name + "</td><td class='resultNumber'>" + orderRoomLines[i].shotel.toFixed(4) + "</td><td class='resultNumber'>" + orderRoomLines[i].scons.toFixed(4) + "</td><td class='resultNumber'>" + orderRoomLines[i].totaleAnnoHotel.toFixed(2) + "</td><td class='resultNumber'>" + orderRoomLines[i].totaleAnnoConsorziata.toFixed(2) + '</td></tr>';
			}
			displayArticles += "<tr class='resultLastRoomLine'><td><b>Media Room</b></td><td class='resultNumber'>"+mediaRoomHotel.toFixed(4)+"</td><td class='resultNumber'>"+mediaRoomConsorziata.toFixed(4)+"</td><td class='resultNumber'>"+sommatoriaAnnoHotel.toFixed(2)+"</td><td class='resultNumber'>"+sommatoriaAnnoConsorziata.toFixed(2)+'</td></tr>';
			displayArticles += "<tr></td><td></td><td></td><td></td><td><b>Margine</b></td><td class='resultNumber'>"+margineValuta.toFixed(2)+'</td></tr>';
			displayArticles += "<tr></td><td></td><td></td><td></td><td><b>Margine %</b></td><td class='resultNumber'>"+marginePercentuale.toFixed(2)+'</td></tr>';
			displayArticles += '</table>';
			/* Distinta prodotti 
			displayArticles += "<br /><br /><p><b>DISTINTA PRODOTTI</b><p><table border='1'><tr class='resultLineHeader'><td class='resultTableHeader' id='Column1'>Cod. Produttore</td><td class='resultTableHeader' id='Column2'>Prodotto</td><td class='resultTableHeader' id='Column3'>Q.ta stimata</td><td width='100px' class='resultTableHeader' id='Column4'>Scatoloni</td></tr>";
			for(i=0;i<orderLines.length;i++){
				displayArticles += '<tr><td>'+orderLines[i].prod_code+"</td><td class='resultNumber'>"+orderLines[i].line_product+ "</td><td class='resultNumber'>" + orderLines[i].appraisedUsage.toFixed(2)+"</td><td class='resultNumber'>"+ orderLines[i].cartonsTotal.toFixed(1) +'</td></tr>';
			}
			*/
			block.formElements.get('orders___textParameters').update(displayRooms);
			block.formElements.get('orders___disp_param').update(block.elements.get('orders___textParameters').get('value'));
			block.formElements.get('orders___text_art').update(displayArticles);
			block.formElements.get('orders___html_art').update(block.elements.get('orders___text_art').get('value'));
			
				
		
		} else {
		alert("Non sono stati inserite linee d'ordine!!!");
		};
}); 
} /* End of buildoffer() function */