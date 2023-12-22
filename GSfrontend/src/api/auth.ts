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

export const startTokenRefreshInterval = () => {
	clearInterval(tokenRefreshInterval);

	tokenRefreshInterval = setInterval(async () => {
		try {
			await refreshAccessToken();
		} catch (refreshError) {
			console.error("Refresh error:", refreshError);
			clearInterval(tokenRefreshInterval);
		}
	}, 29 * 60 * 1000);
};

export const someApiRequest = async () => {
	try {
		const headers = getAuthHeaders();
		const response = await axios.get(`${apiBaseUrl}some-endpoint/`, headers);
	} catch (error: any) {
		if (error.response && error.response.status === 401) {
			try {
				await refreshAccessToken();
				const headers = getAuthHeaders();
				const response = await axios.get(`${apiBaseUrl}some-endpoint/`, headers);
				// Обработка успешного ответа после обновления access токена
			} catch (refreshError) {
				console.error("Refresh error:", refreshError);
			}
		} else {
			console.error(`Error: ${error}`);
		}
	}
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
			console.log("Access token refreshed successfully:", newAccessToken);
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
	console.log("Access Token:", accessToken);
	console.log("Refresh Token:", refreshToken);
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
