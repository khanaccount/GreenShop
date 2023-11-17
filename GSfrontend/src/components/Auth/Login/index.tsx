import React from "react";
import s from "./index.module.scss";

interface LoginProps {
	passwordVisible: boolean;
	handleTogglePasswordVisibility: () => void;
}

const Login: React.FC<LoginProps> = ({ passwordVisible, handleTogglePasswordVisibility }) => {
	return (
		<div className={s.login}>
			<p>Enter your username and password to login.</p>
			<form className={s.form}>
				<input type="text" name="usernameOrEmail" placeholder="Enter your login" />
				<div className={s.passwordContainer}>
					<input
						type={passwordVisible ? "text" : "password"}
						name="password"
						placeholder="Password"
					/>
					<img
						src={passwordVisible ? "img/header/eyeClose.svg" : "img/header/eye.svg"}
						width={24}
						alt="eye"
						onClick={handleTogglePasswordVisibility}
					/>
				</div>
				<a href="///" className={s.forgot}>
					Forgot Password?
				</a>
				<button className={s.loginBtn} type="submit">
					Login
				</button>
			</form>
			<p className={s.loginOption}>Or login with</p>
			<div className={s.anotherMethods}>
				<button>
					<img src="img/header/google.svg" alt="google" />
					<p>Login with Google</p>
				</button>
				<button>
					<img src="img/header/facebook.svg" alt="facebook" />
					<p>Login with Facebook</p>
				</button>
			</div>
		</div>
	);
};

export default Login;
