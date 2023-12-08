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

const apiBaseUrl = "http://localhost:8000/shop/";

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

export const getAuthHeaders = () => {
	const accessToken = localStorage.getItem("accessToken");

	if (accessToken) {
		return {
			headers: {
				Authorization: `Token ${accessToken}`
			}
		};
	}

	return {};
};

export const someApiRequest = async () => {
	try {
		const headers = getAuthHeaders(); // Получение заголовков авторизации
		const response = await axios.get(`${apiBaseUrl}some-endpoint/`, headers);
		// Обработка ответа
	} catch (error) {
		console.log(`error ${error}`);
	}
};

let refreshTimer: NodeJS.Timeout | null = null;

export const startTokenRefresh = (): void => {
	stopTokenRefresh();

	refreshTimer = setInterval(async () => {
		try {
			const refreshToken = localStorage.getItem("refreshToken");
			if (!refreshToken) {
				throw new Error("Refresh token not found");
			}

			const response = await axios.post(`${apiBaseUrl}token/refresh/`, {
				refresh: refreshToken
			});

			const { access } = response.data;

			if (access) {
				localStorage.setItem("accessToken", access);
			} else {
				console.error("Access token not found in the refresh response");
			}
		} catch (error) {
			console.error("Token refresh error:", error);
			// Остановка таймера при возникновении ошибки
			stopTokenRefresh();
		}
	}, 29 * 60 * 1000);
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
