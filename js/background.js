let user_signed_in = false;
const CLIENT_ID = encodeURIComponent("39387487010-bmf133el2stdi6q68v8lr6vrecje1s3r.apps.googleusercontent.com");
const RESPONSE_TYPE = encodeURIComponent('id_token');
const REDIRECT_URI = encodeURIComponent('https://gipdjkemkajdhkncndgpjbipbgikdalc.chromiumapp.org');
const STATE = encodeURIComponent('jfkls3n');
const SCOPE = encodeURIComponent('openid');
const PROMPT = encodeURIComponent('consent');

const create_oauth2_url = () => {
	let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))

	let url = 
	`https://accounts.google.com/o/oauth2/v2/auth
	?client_id=${CLIENT_ID}
	&response_type=${RESPONSE_TYPE}
	&redirect_uri=${REDIRECT_URI}
	&state=${STATE}
	&scope=${SCOPE}
	&prompt=${PROMPT}
	&nonce=${nonce}
	`;

	return url
}

const is_user_signed_in = () => user_signed_in;

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if(request.message === 'login') {
		if(is_user_signed_in()) {
			console.log('User already signed in')
		} else {
			chrome.identity.launchWebAuthFlow({
				url: create_oauth2_url(),
				interactive: true,
			}, (redirect_url) => {
				let id_token = redirect_url.substring(redirect_url.indexOf('id_token=') + 9);
				id_token = id_token.substring(0, id_token.indexOf('&'));

				const user_info = parseJwt(id_token);
				if((user_info.iss === "https://accounts.google.com" || user_info.iss === "accounts.google.com") && user_info.aud === CLIENT_ID) {
					chrome.browserAction.setPopup({popup: "../html/popup-logged.html"}, () => {
						user_signed_in = true;
						sendResponse("success")
					})
				} else {
					console.log("Error while authentification")
				}

			})
			
			return true
		}

	} else if(request.message === 'logout') {
		chrome.browserAction.setPopup({popup: "../html/popup.html"}, () => {
			user_signed_in = false;
			sendResponse("success")
		})
		return true
	}
})