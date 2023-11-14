import React from "react";

import s from "./index.module.scss";
import SwitchBlock from "./SwitchBlock";
import Details from "./Details";

const AccountInfo: React.FC = () => {
	return (
		<div className={s.accountInfo}>
			<SwitchBlock />
			<Details />
		</div>
	);
};

export default AccountInfo;
