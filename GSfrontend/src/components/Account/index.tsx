import React, { useState } from "react";

import s from "./index.module.scss";
import SwitchBlock from "./SwitchBlock";
import Details from "./Details";
import Address from "./Address";

const AccountInfo: React.FC = () => {
	const [showDetails, setShowDetails] = useState(true);
	const [showAddress, setShowAddress] = useState(false);

	const handleShowDetails = () => {
		setShowDetails(true);
		setShowAddress(false);
	};

	const handleShowAddress = () => {
		setShowDetails(false);
		setShowAddress(true);
	};

	return (
		<div className={s.accountInfo}>
			<SwitchBlock showDetails={handleShowDetails} showAddress={handleShowAddress} />
			{showDetails && !showAddress && <Details />}
			{showAddress && <Address />}
		</div>
	);
};

export default AccountInfo;
