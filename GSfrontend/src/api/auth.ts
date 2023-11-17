import axios from "axios";

interface RegisterData {
	username: string;
	email: string;
	password: string;
}

interface LoginData {
	username: string;
	password: string;
}

export const register = async (userData: RegisterData): Promise<void> => {
	const { username, email, password } = userData;

	if (password.length < 8) {
		throw new Error("Password should be at least 8 characters long!");
	}

	try {
		await axios.post("http://localhost:8000/shop/registration/", {
			username,
			email,
			password
		});
		// Обработка успешной регистрации, если необходимо
	} catch (error) {
		// Обработка ошибок регистрации
		console.error("Registration error:", error);
		throw new Error("Registration failed");
	}
};

export const login = async (userData: LoginData): Promise<void> => {
	try {
		const response = await axios.post("http://localhost:8000/shop/login/", userData);
		const { access, refresh } = response.data;

		if (access && refresh) {
			localStorage.setItem("accessToken", access);
			localStorage.setItem("refreshToken", refresh);
			// Другая логика после сохранения токенов, например, перенаправление на другую страницу
			// history.push("/dashboard");
		} else {
			console.error("Tokens are missing in the response");
			throw new Error("Tokens are missing");
		}
	} catch (error) {
		// Обработка ошибок входа
		console.error("Login error:", error);
		throw new Error("Login failed");
	}
};

export const isUserLoggedIn = (): boolean => {
	const accessToken = localStorage.getItem("accessToken");
	const refreshToken = localStorage.getItem("refreshToken");
	return !!accessToken && !!refreshToken;
};
