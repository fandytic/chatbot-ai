$(document).ready(function () {

	//Widget Code
	var bot = '<div class="chatCont" id="chatCont">' +
	'<div class="bot_profile">' +
	'<div class="headerBar">' +
	'<img src="images/logohome.png" width="18%">' +
	'</div>' +
	'<div class="close">' +
	'<img src="images/icon.png" width="4%">' +
	'</div>' +
	'</div><!--bot_profile end-->' +

	'<div id="result_div" class="resultDiv"></div>' +
	'<div class="chatForm" id="chat-div">' +
	'<div class="lok spinner">' +
	'<div class="bounce1"></div>' +
	'<div class="bounce2"></div>' +
	'<div class="bounce3"></div>' +
	'</div>' +
	'<input type="text" id="chat-input" autocomplete="off" placeholder="Tulis pesan..." class="form-control bot-txt"/>' +
	'<input type="button" id="klik" class="button" value="Kirim">' +
	'</div>' +
	'</div><!--chatCont end-->' +

	'<div class="profile_div">' +
	'<div class="row">' +
	'<div class="col-hgt col-sm-offset-7">' +
	'<img src="images/logoindi.png" class="img-circle img-profile">' +
	'</div><!--col-hgt end-->' +
	'<div class="col-hgt">' +
	'</div>' +
	'</div><!--col-hgt end-->' +
	'</div><!--row end-->' +
	'</div><!--profile_div end-->';

	$("mybot").html(bot);

	// ------------------------------------------ Toggle chatbot -----------------------------------------------
	//function to click and open chatbot from icon
	$('.profile_div').click(function () {
		$('.profile_div').toggle();
		$('.chatCont').toggle();
		$('.bot_profile').toggle();
		$('.chatForm').toggle();
		document.getElementById('chat-input').focus();
	});
	
	//function to click and close chatbot to icon
	$('.close').click(function () {
		$('.profile_div').toggle();
		$('.chatCont').toggle();
		$('.bot_profile').toggle();
		$('.chatForm').toggle();
	});

	// on input/text enter--------------------------------------------------------------------------------------	
	$('#chat-input').on('keyup keypress', function (e) {
		var keyCode = e.keyCode || e.which;
		var text = $("#chat-input").val();
		if (keyCode === 13) {
			if (text == "" || $.trim(text) == '') {
				e.preventDefault();
				return false;
			} else {
				$("#chat-input").blur();
				setUserResponse(text);
				send(text);
				e.preventDefault();
				document.getElementById('chat-input').focus();
				return false;
			}
		}
	});

	// on input/text klik button--------------------------------------------------------------------------------------	
	$('input[type="button"]').click(function (e) {
		if (e.target) {
			var text = $("#chat-input").val();
			if (text == "" || $.trim(text) == '') {
				e.preventDefault();
				return false;
			} else {
				setUserResponse(text);
				send(text);
				document.getElementById('chat-input').focus();
				return false;
			}
		}
	});

	//------------------------------------------- Call the RASA API--------------------------------------
	function send(text) {
		$.ajax({
			url: 'http://localhost:5005/webhooks/rest/webhook', //  RASA API
			type: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				"sender": "user",
				"message": text
			}),
			success: function (data, textStatus, xhr) {
				console.log(data);

				if (Object.keys(data).length !== 0) {
					for (i = 0; i < Object.keys(data[0]).length; i++) {
						if (Object.keys(data[0])[i] == "buttons") { //check if buttons(suggestions) are present.
							addSuggestion(data[0]["buttons"])
						}

					}
				}
				setBotResponse(data);
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log('Error in Operation');
				setBotResponse('error');
			}
		});
	}

	//------------------------------------ Set bot response in result_div -------------------------------------
	function setBotResponse(val) {
		setTimeout(function () {
			if ($.trim(val) == '' || val == 'error') { //if there is no response from bot or there is some error
				val = 'Maaf server tidak merespon'
				var BotResponse = '<div class="chat friend"><div class="user-photo"><img src="images/logoindi2.png"></div><p class="chat-message">' + val + '</p></div>';
				$(BotResponse).appendTo('#result_div');
			} else {

				//if we get message from the bot succesfully
				var msg = "";
				for (var i = 0; i < val.length; i++) {
					if (val[i]["image"]) { //check if there are any images
						msg += '<div class="chat friend"><div class="user-photo">' +
						'<img src="images/logoindi2.png"></div><p class="chat-message">' +
						'<a class="example-image-link" href="' + val[i].image + '" data-lightbox="example-1">' +
						'<img class="example-image"  width="200" height="124" src="' + val[i].image + '" alt="image-1"/></a></p></div>';
					} else {
						msg += '<div class="chat friend"><div class="user-photo"><img src="images/logoindi2.png"></div><p class="chat-message">' + val[i].text + '</p></div>';
					}
				}
				BotResponse = msg;
				$(BotResponse).appendTo('#result_div');
			}

			scrollToBottomOfResults();
			hideSpinner();
		}, 500);
	}

	//------------------------------------- Set user response in result_div ------------------------------------
	function setUserResponse(val) {
		var UserResponse = '<div class="chat self"><p class="chat-message">' + val + '</p></div>';
		$(UserResponse).appendTo('#result_div');
		$("#chat-input").val('');
		scrollToBottomOfResults();
		showSpinner();
		$('.suggestion').remove();
	}

	//---------------------------------- Scroll to the bottom of the results div -------------------------------
	function scrollToBottomOfResults() {
		var terminalResultsDiv = document.getElementById('result_div');
		terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
	}

	//---------------------------------------- Spinner ---------------------------------------------------
	function showSpinner() {
		$('.spinner').show();
	}

	function hideSpinner() {
		$('.spinner').hide();
	}

	//------------------------------------------- Buttons(suggestions)--------------------------------------------------
	function addSuggestion(textToAdd) {
		setTimeout(function () {
			var suggestions = textToAdd;
			var suggLength = textToAdd.length;
			$('<p class="suggestion"></p>').appendTo('#result_div');
			// Loop through suggestions
			for (i = 0; i < suggLength; i++) {
				$('<span class="sugg-options">' + suggestions[i].title + '</span>').appendTo('.suggestion');
			}
			scrollToBottomOfResults();
		}, 1000);
	}

	// on click of suggestions get value and send to API.AI
	$(document).on("click", ".suggestion span", function () {
		var text = this.innerText;
		setUserResponse(text);
		send(text);
		$('.suggestion').remove();
	});
	// Suggestions end -----------------------------------------------------------------------------------------
});
