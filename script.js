//functions


split_string = [];
split_string_index = 0;
punctuated_split_string = []
$(document).ready(function () {
	var webSocket = new WebSocket('ws://localhost:8765');

	webSocket.onerror = function (event) {
		alert("Web socket error")
		console.log(event)
	};

	webSocket.onopen = function (event) {
		console.log("Socket Open")
		console.log(event)
	};

	webSocket.onmessage = function (event) {
		console.log(event.data)
		var got_punc = event.data
		punctuated_split_string.push(got_punc);
		send_next_string();

	};

	$("#punc").click(function (e) {
		//alert("The paragraph was clicked.");
		e.preventDefault();
		split_string_index = 0;
		split_string = [$("#note-textarea").val()]//.split("\n");
		punctuated_split_string = [];
		send_next_string();
		
	});
	$("#mail").click(function (e) {
		//alert("The paragraph was clicked.");
		e.preventDefault();
		webSocket.send("mail:" + $("#froma").val() + "||" +$("#toa").val() + "||" +  $("#cca").val() + "||" +  $("#bcca").val() + "||" +  $("#subj").val() + "||" +$("#note-textarea").val());		
	});
	function send_next_string() {
		if (split_string_index < split_string.length) {
			webSocket.send("punc:" + split_string[split_string_index++] + " .");		
		} else {
			document.getElementById("note-textarea").value = "";
			temp = ""
			for (i = 0; i < punctuated_split_string.length; i++) {
				temp += punctuated_split_string[i];
			}
			document.getElementById("note-textarea").value = temp;
		}
	}
});


function joinwords() {
	var x = document.querySelectorAll('#froma, #toa, #cca, #bcca,#recname');

	for (var i = 0; i < 5; i++) {
		x[i].value = x[i].value.split(' ').join('');

	}
}

function splitw(wildcard) {
	var w = wildcard;
	for (var j = 0; j < w.length; j++) {
		console.log(w.charAt(j));
		artyom.say(w.charAt(j));
	}
}

//end of functions
const artyom = new Artyom();
//no cases
artyom.on(['stop', 'next line']).then((i) => {
	switch (i) {

		case 0:
			artyom.shutUp();
			break;
		case 1:
			//document.getElementById("note-textarea").innerHTML += '.'+'\n';
			document.getElementById("note-textarea").value += '\n';
			console.log("done");
			//artyom.say("new line");
			break;
	}
});
//commands in cases
artyom.on(['start *', 'mail from *', 'to address *', 'carbon copy *', 'bcece *', 'bcc *', 'clear *', 'read *','subject *','mail to *'], true).then((i, wildcard) => {
	switch (i) {
		case 0:
			document.getElementById("note-textarea").value += wildcard;
			artyom.say("You've said : " + wildcard);
			break;
		case 1:
			//aname=wildcard.charAt(0).toUpperCase();
			document.getElementById("froma").value += wildcard;
			joinwords();
			artyom.say("You've said : " + wildcard);
			break;
		case 2:
			document.getElementById("toa").value += wildcard+",";
			joinwords();
			splitw(wildcard);
			break;
		case 3:
			document.getElementById("cca").value += wildcard+",";
			joinwords();
			splitw(wildcard);
			break;
		case 4:
		case 5:
			document.getElementById("bcca").value += wildcard+",";
			joinwords();
			splitw(wildcard);
			break;
		case 6:
			if (wildcard === "mail") {
				document.getElementById("note-textarea").value = '';
				artyom.say("content cleared");
			} else if (wildcard === "my name") {
				document.getElementById("froma").value = '';
				artyom.say("content cleared");
			} else if (wildcard === "to address") {
				document.getElementById("toa").value = '';
				artyom.say("content cleared");
			} else if (wildcard === "carbon copy") {
				document.getElementById("cca").value = '';
				artyom.say("content cleared");
			} else if (wildcard === "bcc") {
				document.getElementById("bcca").value = '';
				artyom.say("content cleared");
			}
			else if (wildcard === "subject") {
				document.getElementById("subj").value = '';
				artyom.say("content cleared");
			}
			break;
		case 7:
			if (wildcard === "instructions") {
				var text = document.getElementById("insp").textContent;
				artyom.say(text);

			} else if (wildcard === "mail") {
				var text = document.getElementById("note-textarea").value;
				artyom.say(text);

			}else if (wildcard === "subject") {
				var text = document.getElementById("subj").value;
				artyom.say(text);

			}  
			else if (wildcard === "carbon copy") {
				var text = document.getElementById("cca").value;
				splitw(text);

			} else if (wildcard === "from address") {
				var text = document.getElementById("froma").value;
				splitw(text);
				artyom.say(text);

			} else if (wildcard === "to address") {
				var text = document.getElementById("toa").value;
				splitw(text);
				

			} else if (wildcard === "bcc") {
				var text = document.getElementById("bcca").value;
				splitw(text);
			}
			break;
		case 8:
			document.getElementById("subj").value += wildcard;
			artyom.say("You've said : " + wildcard);
			break;
		case 9:
			document.getElementById("recname").value += wildcard;
			joinwords();
			artyom.say("You've said : " + wildcard);
			break;
	}
});

// Start the commands !
artyom.initialize({
	lang: "en-GB", // GreatBritain english
	continuous: true, // Listen forever
	soundex: true, // Use the soundex algorithm to increase accuracy
	debug: true, // Show messages in the console
	//executionKeyword: "over",
	listen: true, // Start to listen commands !
	speed: 0.7,
	//obeyKeyword: "over",

}).then(() => {
	console.log("Artyom has been succesfully initialized");
}).catch((err) => {
	console.error("Artyom couldn't be initialized: ", err);
});

artyom.say("Hello", {
	onStart: () => {
		console.log("Reading ...");
	},
	onEnd: () => {
		console.log("No more text to talk");

	}
});