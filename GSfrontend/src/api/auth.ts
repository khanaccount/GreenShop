import axios from "axios";
import Cookies from "js-cookie";

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

let tokenRefreshInterval: NodeJS.Timeout;
let lastInteractionTime = Date.now();

const updateLastInteractionTime = () => {
	lastInteractionTime = Date.now();
};

document.addEventListener("click", updateLastInteractionTime);
document.addEventListener("keydown", updateLastInteractionTime);

const checkActivityAndRefreshToken = async () => {
	const inactivityPeriod = Date.now() - lastInteractionTime;
	const refreshInterval = 29 * 60 * 1000; // Интервал обновления токена (в миллисекундах)

	if (inactivityPeriod > refreshInterval) {
		try {
			await refreshAccessToken();
			// Обновить время последнего взаимодействия после успешного обновления токена
			lastInteractionTime = Date.now();
		} catch (refreshError) {
			console.error("Refresh error:", refreshError);
			clearInterval(tokenRefreshInterval);
		}
	}
};

export const startTokenRefreshInterval = () => {
	checkActivityAndRefreshToken(); // Сначала проверить активность и обновить токен
	// Затем установить интервал для периодической проверки активности пользователя
	tokenRefreshInterval = setInterval(checkActivityAndRefreshToken, 60000); // Проверка каждую минуту
};

startTokenRefreshInterval();

export const register = async (userData: RegisterData): Promise<void> => {
	const { username, email, password } = userData;

	if (password.length < 8) {
		throw new Error("Password should be at least 8 characters long!");
	}

	try {
		await axios.post(`${apiBaseUrl}registration/`, {
			username,
			email,
			password
		});
	} catch (error) {
		if (
			axios.isAxiosError(error) &&
			error.response &&
			error.response.data &&
			error.response.data.errors
		) {
			const { errors } = error.response.data;
			if (errors.username && errors.username.length > 0) {
				const usernameError: string = errors.username[0];
				alert(`Error - Username: ${usernameError}`);
			}
			if (errors.email && errors.email.length > 0) {
				const emailError: string = errors.email[0];
				alert(`Error - Email: ${emailError}`);
			}
		} else {
			console.error("Unexpected error occurred:", error);
		}
	}
};

export const login = async (userData: LoginData): Promise<void> => {
	try {
		const response = await axios.post(`${apiBaseUrl}login/`, userData);
		const { access, refresh } = response.data;

		if (access && refresh) {
			localStorage.setItem("accessToken", access);
			Cookies.set("refreshToken", refresh, { expires: 30 });

			startTokenRefreshInterval();
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

const refreshAccessToken = async () => {
	try {
		const refresh = Cookies.get("refreshToken");
		if (!refresh) {
			throw new Error("Refresh token is missing");
		}

		console.log("Refreshing access token...");

		const response = await axios.post(`${apiBaseUrl}token/refresh/`, { refresh });
		const newAccessToken = response.data.access;

		if (newAccessToken) {
			localStorage.setItem("accessToken", newAccessToken);
		} else {
			throw new Error("New access token is missing in the response");
		}
	} catch (error) {
		console.error("Failed to refresh access token:", error);
		throw new Error("Failed to refresh access token");
	}
};

export const isUserLoggedIn = (): boolean => {
	const accessToken = localStorage.getItem("accessToken");
	const refreshToken = Cookies.get("refreshToken");
	return !!accessToken && !!refreshToken;
};

export const logout = (): void => {
	clearInterval(tokenRefreshInterval);
	localStorage.removeItem("accessToken");
	Cookies.remove("refreshToken");
};

export const initApp = () => {
	const refreshToken = Cookies.get("refreshToken");
	if (refreshToken) {
		startTokenRefreshInterval();
	}
};

initApp();
