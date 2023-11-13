import React from "react";

import s from "./index.module.scss";
import SwitchBlock from "./SwitchBlock";

const AccountInfo: React.FC = () => {
	return (
		<div className={s.accountInfo}>
			<SwitchBlock />
		</div>
	);
};

export default AccountInfo;
