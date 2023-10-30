import React from "react";

import s from "./index.module.scss";

const Header: React.FC = () => {
	return (
		<div className={s.header}>
			<img src="img/header/logo.svg" alt="logo" />
			<ul>
				<li>
					<a href="">Home</a>
				</li>
				<li>
					<a href="">Shop</a>
				</li>
				<li>
					<a href="">Plant Care</a>
				</li>
				<li>
					<a href="">Blogs</a>
				</li>
			</ul>
			<div>
				<img className={s.cart} width={24} height={24} src="img/header/cart.svg" alt="cart" />

				<button>
					<img width={20} src="img/header/login.svg" alt="login" />
					<p>Login</p>
				</button>
			</div>
		</div>
	);
};

export default Header;
