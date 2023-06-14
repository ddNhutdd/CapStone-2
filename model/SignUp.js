function SignUp(name, email, password, phone, boolValue) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.gender = (boolValue === 'Male');
    
}
function Login(email, password){
    this.email = email;
    this.password = password;
}