'use strict'
const userForm = new UserForm();

userForm.loginFormCallback = (data) => {
    const {login,password} = data;

    const cb = (response) => {
        if(response.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(response.error);
        }
    };
    ApiConnector.login({login, password}, cb);
 }

 //const registerForm = new RegisterForm();

userForm.registerFormCallback = (data) => {
    const {login,password} = data;

    const cb = (response) => {
        if(!response.success) {
            console.log(response.success);
            userForm.setRegisterErrorMessage(response.error);
        }
    };
    ApiConnector.register({login, password}, cb);
}
