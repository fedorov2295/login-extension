document.querySelector('#sign-in').addEventListener('click', () => {
	chrome.runtime.sendMessage({message: 'login'}, response => {
		if(response === "success") window.close();
	});
});
