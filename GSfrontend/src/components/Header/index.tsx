import React from "react";
import { Link, useLocation } from "react-router-dom";

import s from "./index.module.scss";

const Header: React.FC = () => {
	const location = useLocation();

	const [activeMethod, setActiveMethod] = React.useState("login");
	const [passwordVisible, setPasswordVisible] = React.useState(false);

	const handleMethodClick = (method: string) => {
		setActiveMethod(method);
	};

	const handleTogglePasswordVisibility = () => {
		setPasswordVisible((prev) => !prev);
	};

	return (
		<div className={s.header}>
			<Link to="/">
				<img src="img/header/logo.svg" alt="logo" />
			</Link>
			<ul>
				<li>
					<Link className={location.pathname === "/" ? s.active : ""} to="">
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

				<button>
					<img width={27} src="img/header/login.svg" alt="login" />
					<p>Login</p>
				</button>

				<div className={s.authBg}>
					<div className={s.auth}>
						<img
							className={s.imgCross}
							width={20}
							height={20}
							src="img/header/cross.svg"
							alt="cross"
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
							<div className={s.login}>
								<p>Enter your username and password to login.</p>
								<form className={s.form}>
									<input type="text" name="usernameOrEmail" placeholder="Enter your login" />
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
									<a href="///" className={s.forgot}>
										Forgot Password?
									</a>
									<button type="submit">Login</button>
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
						)}
						{activeMethod === "register" && (
							<div className={s.login}>
								<p>Enter your username and password to login.</p>
								<form className={s.form}>
									<input type="text" name="usernameOrEmail" placeholder="Enter your login" />
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
									<button type="submit">Login</button>
								</form>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
