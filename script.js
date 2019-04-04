//functions
jsps = null;
jsss = null;
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
	function punce(){
			//alert("The paragraph was clicked.");
			
			split_string_index = 0;
			split_string = [$("#note-textarea").val()]//.split("\n");
			punctuated_split_string = [];
			send_next_string();		
			
	}
	jsps=punce;

	function sendce(){
			//alert("The paragraph was clicked.");
			
			webSocket.send("mail:" + $("#froma").val() + "||" +$("#toa").val() + "||" +  $("#cca").val() + "||" +  $("#bcca").val() + "||" +  $("#subj").val() + "||" +$("#note-textarea").val());
	}
	jsss=sendce;

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

function clearall(){
	flag = 0;
	flag2 = 0;
	document.getElementById("note-textarea").value = '';
	document.getElementById("froma").value = '';
	document.getElementById("recname").value = '';
	document.getElementById("toa").value = '';
	document.getElementById("cca").value = '';
	document.getElementById("bcca").value = '';
	document.getElementById("subj").value = '';
	artyom.say("cleared all content");

}

function underscoreto() {
	var strus = document.getElementById("toa").value; 
	var resus = strus.replace("underscore", "_");
	document.getElementById("toa").value = resus;
  } 

function underscorecc() {
	var strus = document.getElementById("cca").value; 
	var resus = strus.replace("underscore", "_");
	document.getElementById("cca").value = resus;
  } 

function underscorebcc() {
	var strus = document.getElementById("bcca").value; 
	var resus = strus.replace("underscore", "_");
	document.getElementById("bcca").value = resus;
  } 

//end of functions
const artyom = new Artyom();
//no cases


function js_punc(){
	jsps();
}

function js_send(){
	jsss();
}

//artyom.on(['punctuate', 'send mail']).then((i) => {
//	switch (i) {

//		case 0:
//			artyom.say("punctuating")
//			js_punc();
//			break;
//		case 1:
//			artyom.say("sending")
//			js_send();
//			break;
//	}
// /});
//commands in cases
flag= 0;
flag2=0;
function questions(){
	if(document.getElementById("froma").value == ""){
		artyom.say("Please tell your first name")
		}
	else if(document.getElementById("recname").value == ""){
		artyom.say("Please tell your recipient's first name")
		}
	else if(document.getElementById("subj").value == ""){
		artyom.say("Say the subject")
		}	
	else if(document.getElementById("toa").value == ""){
		artyom.say("What is the recipients mail address?")
		}		
	else if(document.getElementById("cca").value == ""){
		artyom.say("Is there a cc address?")
		}	
	else if(document.getElementById("bcca").value == ""){
		artyom.say("Is there a bcc address?")
		}	
	else if(document.getElementById("note-textarea").value == ""){
		artyom.say("Please recite the mail content")
		}
	else if(flag==0){
		
		artyom.say("Shall I finalize")
	}	
	else if(flag==2){
		artyom.say("Mail Content")
	}
	else if(flag2==0){
		artyom.say("shall i send")
	}

	else{
		artyom.say("Do you want to send another new mail")
	}
		setInterval(function() {
			
			
		  			
	artyom.on(['*'], true).then((i,wildcard) => {
		switch (i) {
			case 0:
				if(document.getElementById("froma").value == ""){
					document.getElementById("froma").value += wildcard;
					joinwords();
					artyom.say("You've said : " + wildcard);
					return		
					}
				else if(document.getElementById("recname").value == ""){
					document.getElementById("recname").value += wildcard;
					joinwords();
					artyom.say("You've said : " + wildcard);
					return
					}
				else if(document.getElementById("subj").value == ""){
					document.getElementById("subj").value += wildcard;
					artyom.say("You've said : " + wildcard);
					return
					}
				else if(document.getElementById("toa").value == ""){
					document.getElementById("toa").value += wildcard+",";
					joinwords();
					underscoreto();
					//splitw(wildcard);
					return
					}	
				else if(document.getElementById("cca").value == ""){
					if(wildcard =="no")
					{
						document.getElementById("cca").value += "   "
					}
					else{
					document.getElementById("cca").value += wildcard+",";
					joinwords();
					underscorecc();
					//splitw(wildcard);
					return}
					}
				else if(document.getElementById("bcca").value == ""){
					if(wildcard =="no")
					{
						document.getElementById("bcca").value += "   "
						return
					}
					else{
					document.getElementById("bcca").value += wildcard+",";
					joinwords();
					underscorebcc();
					//splitw(wildcard);
					return}
					}
				else if(document.getElementById("note-textarea").value == ""){
					document.getElementById("note-textarea").value += wildcard;
					artyom.say("You've said : " + wildcard);
					return
				}
				else if(flag == 0){
					if(wildcard == "yes"){
						js_punc();
						flag =1 ;
					}
					else if(wildcard == "no"){
						flag = 2;
						return

					}
				}
				else if(flag==2){
					if(wildcard=="no"){
						flag=0;
					}
					else{
						document.getElementById("note-textarea").value += " "+wildcard;
						flag=0;
						return
					}
				}
				else if(flag2 == 0){
					if(wildcard=="yes"){
						document.getElementById("note-textarea").value = "Dear "+document.getElementById("recname").value+", "+ document.getElementById("note-textarea").value
						js_send();
						artyom.say("Mail sent successfully");
						flag2=1;


					}
					else{
						flag2=0;
						return
					}
				}
				else{
					if(wildcard == "yes")
					{
					clearall();
				}
				else{
					return
				}
			}
		
		}
	});
}, 1000);
}

	//['start *', 'from*', 'to address *', 'carbon copy *', 'bcece *', 'bcc *', 'clear *', 'read *','subject *','mail to *']
artyom.on(['start *', 'carbon copy *', 'bcece *', 'bcc *', 'delete *', 'read *',], true).then((i, wildcard) => {
	switch (i) {
		case 0:
			document.getElementById("note-textarea").value += wildcard;
			artyom.say("You've said : " + wildcard);
			break;
		case 1:
			document.getElementById("cca").value += wildcard+",";
			joinwords();
			splitw(wildcard);
			underscorecc();
			break;
		case 2:
		case 3:
			document.getElementById("bcca").value += wildcard+",";
			joinwords();
			splitw(wildcard);
			underscorebcc();
			break;
		case 4:
			if (wildcard === "mail") {
				document.getElementById("note-textarea").value = '';
				flag=0;
				flag2=0;
				artyom.say("content cleared");
			} else if (wildcard === "my name") {
				document.getElementById("froma").value = '';
				artyom.say("content cleared");
			} else if (wildcard === "receivers name") {
				document.getElementById("recname").value = '';
				artyom.say("content cleared");
			} else if (wildcard === "to address") {
				document.getElementById("toa").value = '';
				artyom.say("content cleared");
			} else if (wildcard === "carbon copy") {
				document.getElementById("cca").value = '';
				artyom.say("content cleared");
			} else if (wildcard === "black carbon copy") {
				document.getElementById("bcca").value = '';
				artyom.say("content cleared");
			}
			else if (wildcard === "subject") {
				document.getElementById("subj").value = '';
				artyom.say("content cleared");
			}
			else if (wildcard === "all"){
				clearall();

			}
			break;
		case 5:
			if (wildcard === "the instructions") {
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

artyom.say("Say Reed the Instructions if you want to know the instructions",{
    onStart:function(){
        // Don't obey any command
		artyom.dontObey();
		setInterval(function() {
			// method to be executed;
			questions();
		  }, 13000);
		
	},
    
		
		//questions();
		
	onEnd: function(){
        setTimeout(function(){
            // Allow to process commands again
            artyom.obey();
        },7000);
	}
	});
	