import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { isUserLoggedIn } from "./api/auth";

import { Home } from "./pages/Home";
import { Account } from "./pages/Account";
import { Shop } from "./pages/Shop";

const App: React.FC = () => {
	return (
		<>
			<Routes>
				<Route index path="/" element={<Home />} />
				<Route
					path="/account"
					element={isUserLoggedIn() ? <Account /> : <Navigate to="/" replace={true} />}
				/>
				<Route index path="/shop/:id" element={<Shop />} />
			</Routes>
		</>
	);
};

export default App;
