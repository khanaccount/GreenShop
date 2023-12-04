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
	} catch (error: any) {
		if (error.response && error.response.data && error.response.data.errors) {
			const { errors } = error.response.data;
			if (errors.username && errors.username.length > 0) {
				const usernameError = errors.username[0];
				alert(`Error - Username: ${usernameError}`);
			}
			if (errors.email && errors.email.length > 0) {
				const emailError = errors.email[0];
				alert(`Error - Email: ${emailError}`);
			}
		} else {
			console.error("Unexpected error occurred:", error);
		}
	}
};

export const login = async (userData: LoginData): Promise<void> => {
	try {
		const response = await axios.post("http://localhost:8000/shop/login/", userData);
		const { access, refresh } = response.data;

		if (access && refresh) {
			localStorage.setItem("accessToken", access);
			localStorage.setItem("refreshToken", refresh);
			console.log(`access JWT Token=${access}`, `refresh JWT Token=${refresh}`);

			// Инициализация обновления токена
			startTokenRefresh();
		} else {
			console.error("Tokens are missing in the response");
			throw new Error("Tokens are missing");
		}
	} catch (error) {
		console.error("Login error:", error);
		throw new Error("Login failed");
	}
};

let refreshTimer: NodeJS.Timeout | null = null;

export const startTokenRefresh = (): void => {
	if (refreshTimer) {
		clearInterval(refreshTimer);
	}

	// Время в миллисекундах для 180 дней
	const interval60Minutes = 25 * 60 * 1000; // Обновление access токена каждый час
	const interval180Days = 29 * 24 * 60 * 60 * 1000; // Обновление refresh токена раз в 180 дней

	// Обновление access токена каждый час
	refreshTimer = setInterval(async () => {
		try {
			const refreshToken = localStorage.getItem("refreshToken");

			if (refreshToken) {
				const response = await axios.post("http://localhost:8000/shop/token/refresh/", {
					refresh: refreshToken
				});

				const newAccessToken = response.data.access;
				localStorage.setItem("accessToken", newAccessToken);
			} else {
				console.error("Refresh token not found");
				throw new Error("Refresh token not found");
			}
		} catch (error) {
			console.error("Token refresh error:", error);
		}
	}, interval60Minutes); // Обновление access токена каждый час

	// Обновление refresh токена каждые 180 дней
	setInterval(async () => {
		try {
			// ... (ваш код для обновления refresh токена)
		} catch (error) {
			console.error("Refresh token error:", error);
		}
	}, interval180Days); // Обновление refresh токена раз в 180 дней
};

export const stopTokenRefresh = (): void => {
	if (refreshTimer) {
		clearInterval(refreshTimer);
		refreshTimer = null;
	}
};

export const isUserLoggedIn = (): boolean => {
	const accessToken = localStorage.getItem("accessToken");
	const refreshToken = localStorage.getItem("refreshToken");
	return !!accessToken && !!refreshToken;
};

export const logout = (): void => {
	stopTokenRefresh();
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
};
