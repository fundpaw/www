const userApiUrl = './api/users';

const fetchJSON = (url) => fetch(url).then(x=>x.json());
const postJSON = (url, body) => {
	const opts = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}
	return fetch(url, opts).then(x=>x.json());
}

const randomHash = () => (new Array(5)).fill().map(x => Math.random().toString(36).slice(2)).join('-');

async function login(_username, _password, { confirm=true }={}) {
	const [{
		token, username, email, gender, dob
	}={}]=[] = await fetchJSON(`${userApiUrl}?username=${_username}&password=${encodeURIComponent(_password)}`);
	if(!token) return alert('Error logging in!');

	localStorage.setItem(
		'user',
		JSON.stringify({ token, username, email, gender, dob })
	);
	confirm && alert('You have signed in!');
	document.body.classList.add('navigating');
	setTimeout(() => {
		document.location = './loading/loading.html?next=/main/main.html';
	}, 700);
}

window.clickHandler = () => {
	const usernameInput = document.querySelector('#username');
	const passwordInput = document.querySelector('#password');

	const username = usernameInput.value;
	const password = passwordInput.value;

	login(username, password);
}

window.showSignup = () => {
	document.querySelector('#sign-in').classList.add('hidden');
	document.querySelector('#sign-up').classList.remove('hidden');
}

window.createAccountClick = async () => {
	const usernameInput = document.querySelector('#sign-up-username');
	const passwordInput = document.querySelector('#sign-up-password');
	const emailInput = document.querySelector('#sign-up-email');
	const genderMale = document.querySelector('#sign-up-gender-male');
	const birthdayInput = document.querySelector('#sign-up-birthday');

	const username = usernameInput.value;
	const password = passwordInput.value;
	const email = emailInput.value;
	const gender = genderMale.checked
		? 'male'
		: 'female';

	const birthday = birthdayInput.value;

	const response = await createAccount(
		username, email, password, gender, birthday
	);
	alert('Your account is created!  Logging you in!');

	if(username && password){
		return await login(username, password, { confirm: false });
	}

	const errorDiv = document.querySelector('.error');
	errorDiv.classList.remove('hidden');
	errorDiv.textContent = response.error;
}

const users = JSON.parse(
	localStorage.getItem('users') || '[]'
);

async function createAccount(username, email, password, gender, dob){
	const body = {
		username, email, password, gender, dob,
		token: randomHash()
	}
	return await postJSON(userApiUrl, body);