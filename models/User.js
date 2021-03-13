
class User{
	constructor(email, username, password){
		this.email = email;
		this.username = username;
		this.password = password;
	}

	greeting(){
		return 'Hey ${this.username}';
	}

}