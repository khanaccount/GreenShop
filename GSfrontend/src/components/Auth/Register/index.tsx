import React from "react";
import s from "./index.module.scss";

interface RegisterProps {
	passwordVisible: boolean;
	handleTogglePasswordVisibility: () => void;
}

const Register: React.FC<RegisterProps> = ({ passwordVisible, handleTogglePasswordVisibility }) => {
	return (
		<div className={s.register}>
			<p>Enter your email and password to register.</p>
			<form className={s.form}>
				<input type="text" name="usernameOrEmail" placeholder="Username" />
				<input type="text" name="Email" placeholder="Enter your email address" />
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
				<input
					type={passwordVisible ? "text" : "password"}
					name="сonfirmPassword"
					placeholder="Confirm Password"
				/>
				<button type="submit">Register</button>
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

export default Register;
