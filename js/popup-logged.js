document.querySelector('#sign-out').addEventListener('click', () => {
	chrome.runtime.sendMessage({message: 'logout'}, response => {
		if(response === "success") window.close();
	});
});

document.querySelector("#date-logged").innerHTML = new Date().toISOString().split('T')[0];

chrome.identity.getProfileUserInfo(userInfo => {
	document.querySelector("#user-mail").innerHTML = userInfo.email;
})
