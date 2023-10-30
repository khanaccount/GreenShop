import React from "react";
import { Link, useLocation } from "react-router-dom";

import s from "./index.module.scss";

const Header: React.FC = () => {
	const location = useLocation();

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
					<img width={24} height={24} src="img/header/cart.svg" alt="cart" />
					<span>6</span>
				</div>

				<button>
					<img width={24} src="img/header/login.svg" alt="login" />
					<p>Login</p>
				</button>
			</div>
		</div>
	);
};

export default Header;
