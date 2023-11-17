import React, { useState } from "react";
import axios from "axios";

import s from "./index.module.scss";

interface LoginProps {
	passwordVisible: boolean;
	handleTogglePasswordVisibility: () => void;
}

const Login: React.FC<LoginProps> = ({ passwordVisible, handleTogglePasswordVisibility }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const response = await axios.post("http://localhost:8000/shop/login/", {
				username,
				password
			});

			const { access, refresh } = response.data; // Получение обоих токенов из ответа сервера
			console.log(access, refresh);

			if (access && refresh) {
				localStorage.setItem("accessToken", access);
				localStorage.setItem("refreshToken", refresh);

				// Другая логика после сохранения токенов, например, перенаправление на другую страницу
				// history.push("/dashboard");
			} else {
				console.error("Tokens are missing in the response");
			}
		} catch (error) {
			console.error("Login error:", error);
			// Обработка ошибок входа в систему
		}
	};

	return (
		<div className={s.login}>
			<p>Enter your username and password to login.</p>
			<form className={s.form} onSubmit={handleLogin}>
				<input
					type="text"
					name="username"
					placeholder="Enter your login"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
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
