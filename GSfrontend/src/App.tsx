import React from "react";
import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Account } from "./pages/Account";

const App: React.FC = () => {
	return (
		<>
			<Routes>
				<Route index path="/" element={<Home />} />
				<Route index path="/account" element={<Account />} />
			</Routes>
		</>
	);
};

export default App;
