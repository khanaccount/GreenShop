import React, { useState } from "react";
import s from "./index.module.scss";
import axios from "axios"; // Импортируем axios или другую библиотеку для отправки запросов

interface RegisterProps {
	passwordVisible: boolean;
	handleTogglePasswordVisibility: () => void;
}

const Register: React.FC<RegisterProps> = ({ passwordVisible, handleTogglePasswordVisibility }) => {
	const [usernameOrEmail, setUsernameOrEmail] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match!");
		} else {
			try {
				const response = await axios.post("http://localhost:8000/shop/registration/", {
					usernameOrEmail,
					email,
					password
				});
				const token = response.data.token; // Предполагается, что сервер вернет токен в ответе
				alert("Registration successful. Token received: " + token);
				// Здесь можно сохранить токен в localStorage или использовать в приложении
			} catch (error) {
				console.error("Registration failed:", error);
				alert("Registration failed. Please try again.");
				// Обработка ошибок регистрации
			}
		}
	};

	return (
		<div className={s.register}>
			<p>Enter your email and password to register.</p>
			<form className={s.form} onSubmit={handleSubmit}>
				<input
					type="text"
					name="usernameOrEmail"
					placeholder="Username"
					value={usernameOrEmail}
					onChange={(e) => setUsernameOrEmail(e.target.value)}
				/>
				<input
					type="text"
					name="Email"
					placeholder="Enter your email address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
						src={passwordVisible ? "img/header/eyeClose.svg" : "img/header/eye.svg"}
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
