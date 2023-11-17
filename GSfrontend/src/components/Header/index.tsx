import React from "react";
import { Link, useLocation } from "react-router-dom";
import { isUserLoggedIn } from "../../api/auth";

import s from "./index.module.scss";
import Login from "../Auth/Login";
import Register from "../Auth/Register";

const Header: React.FC = () => {
	const location = useLocation();

	const [activeMethod, setActiveMethod] = React.useState("login");
	const [passwordVisible, setPasswordVisible] = React.useState(false);
	const [authModalVisible, setAuthModalVisible] = React.useState(false);

	const handleMethodClick = (method: string) => {
		setActiveMethod(method);
	};

	const handleTogglePasswordVisibility = () => {
		setPasswordVisible((prev) => !prev);
	};

	const handleToggleAuthModal = () => {
		setAuthModalVisible((prev) => !prev);
	};
	const handleLoginSuccess = () => {
		setAuthModalVisible(false); // Закрыть модальное окно при успешном входе
	};

	return (
		<div className={s.header}>
			<Link to="/">
				<img src="img/header/logo.svg" alt="logo" />
			</Link>
			<ul>
				<li>
					<Link className={location.pathname === "/" ? s.active : ""} to="/">
						Home
					</Link>
				</li>
				<li>
					<Link className={location.pathname === "/shop" ? s.active : ""} to="">
						Shop
					</Link>
				</li>
				<li>
					<Link className={location.pathname === "/plantCare" ? s.active : ""} to="">
						Plant Care
					</Link>
				</li>
				<li>
					<Link className={location.pathname === "/blogs" ? s.active : ""} to="">
						Blogs
					</Link>
				</li>
			</ul>
			<div>
				<div className={s.cart}>
					<img width={27} height={27} src="img/header/cart.svg" alt="cart" />
					<span>6</span>
				</div>
				{isUserLoggedIn() ? (
					<Link to="/account">
						<img width={27} src="img/header/user.svg" alt="user" />
					</Link>
				) : (
					<button onClick={handleToggleAuthModal}>
						<img width={27} src="img/header/login.svg" alt="login" />
						<p>Login</p>
					</button>
				)}

				{authModalVisible && (
					<div className={s.authBg}>
						<div className={s.auth}>
							<img
								className={s.imgCross}
								width={20}
								height={20}
								src="img/header/cross.svg"
								alt="cross"
								onClick={handleToggleAuthModal}
							/>
							<div className={s.loginMethod}>
								<h5
									className={activeMethod === "login" ? s.methodActive : s.method}
									onClick={() => handleMethodClick("login")}>
									Login
								</h5>
								<h5
									className={activeMethod === "register" ? s.methodActive : s.method}
									onClick={() => handleMethodClick("register")}>
									Register
								</h5>
							</div>
							{activeMethod === "login" && (
								<Login
									onLoginSuccess={handleLoginSuccess}
									passwordVisible={passwordVisible}
									handleTogglePasswordVisibility={handleTogglePasswordVisibility}
								/>
							)}
							{activeMethod === "register" && (
								<Register
									passwordVisible={passwordVisible}
									handleTogglePasswordVisibility={handleTogglePasswordVisibility}
								/>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Header;
