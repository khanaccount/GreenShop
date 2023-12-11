import React, { useState } from "react";
import s from "./index.module.scss";
import { register } from "../../../api/auth";

interface RegisterProps {
	passwordVisible: boolean;
	handleTogglePasswordVisibility: () => void;
}

const Register: React.FC<RegisterProps> = ({ passwordVisible, handleTogglePasswordVisibility }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match!");
		} else if (password.length < 8) {
			alert("Password should be at least 8 characters long!");
		} else {
			try {
				await register({ username, email, password });

				setUsernameError(false);
				setEmailError(false);
			} catch (error) {
				alert(error);
			}
		}
	};

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
		setUsernameError(false);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		setEmailError(false);
	};

	const handleUsernameBlur = () => {
		setUsernameError(username.trim() === "");
	};

	const handleEmailBlur = () => {
		const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		setEmailError(!isValidEmail);
	};

	return (
		<div className={s.register}>
			<p>Enter your email and password to register.</p>
			<form className={s.form} onSubmit={handleSubmit}>
				{usernameError && <p className={s.errorText}>Invalid username</p>}
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={username}
					onBlur={handleUsernameBlur}
					className={usernameError ? s.inputErr : ""}
					onChange={handleUsernameChange}
				/>

				{emailError && <p className={s.errorText}>Invalid email</p>}
				<input
					type="text"
					name="Email"
					placeholder="Enter your email address"
					value={email}
					onBlur={handleEmailBlur}
					className={emailError ? s.inputErr : ""}
					onChange={handleEmailChange}
				/>
				<div className={s.passwordContainer}>
					<input
						type={passwordVisible ? "text" : "password"}
						name="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<img
						src={passwordVisible ? "/img/header/eyeClose.svg" : "/img/header/eye.svg"}
						width={24}
						alt="eye"
						onClick={handleTogglePasswordVisibility}
					/>
				</div>
				<input
					type={"password"}
					name="сonfirmPassword"
					placeholder="Confirm Password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<button type="submit">Register</button>
			</form>
			<p className={s.loginOption}>Or login with</p>
			<div className={s.anotherMethods}>
				<button>
					<img src="/img/header/google.svg" alt="google" />
					<p>Login with Google</p>
				</button>
				<button>
					<img src="/img/header/facebook.svg" alt="facebook" />
					<p>Login with Facebook</p>
				</button>
			</div>
		</div>
	);
};

export default Register;
