import React from "react";
import s from "./index.module.scss";

const Details: React.FC = () => {
	const [passwordVisible, setPasswordVisible] = React.useState(false);
	const [imageSrc, setImageSrc] = React.useState<string | null>(null);

	const handleTogglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const image = new Image();
				image.src = reader.result as string;

				image.onload = () => {
					const width = image.width;
					const height = image.height;

					if (width === 50 && height === 50) {
						const dataURL = reader.result as string;
						setImageSrc(dataURL);
					} else {
						alert("Please select an image with dimensions 50x50 pixels.");
						// Здесь можно добавить другую логику, например, сбросить ввод или показать сообщение об ошибке.
					}
				};
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageRemove = () => {
		setImageSrc(null);
	};

	return (
		<div className={s.details}>
			<h5>Personal Information</h5>
			<div className={s.emailNumberBlock}>
				<form className={s.email}>
					<label htmlFor="email">
						<p>
							Email address <span>*</span>
						</p>
						<input type="text" id="email" name="email" />
					</label>
				</form>
				<form className={s.number}>
					<label htmlFor="phoneNumber">
						<p>
							Phone Number <span>*</span>
						</p>
						<input type="text" id="phoneNumber" name="phoneNumber" />
					</label>
				</form>
			</div>
			<div className={s.userImgBlock}>
				<form className={s.userName}>
					<label htmlFor="username">
						<p>
							Username <span>*</span>
						</p>
						<input type="text" id="username" name="username" />
					</label>
				</form>
				<div className={s.imgBlock}>
					<p>
						Photo <span>*</span>
					</p>
					<div className={s.imgBtnBlock}>
						<div className={s.img}>
							{imageSrc ? (
								<div className={s.img}>
									<img src="img/account/cyrcle.svg" alt="cyrcle" />
									<img src="img/account/border.svg" alt="border" />
									<img className={s.userImg} src={imageSrc} alt="User" />
								</div>
							) : (
								<div className={s.img}>
									<img src="img/account/cyrcle.svg" alt="cyrcle" />
									<img src="img/account/border.svg" alt="border" />
									<img className={s.choiceImg} src="img/account/img.svg" alt="img" />
								</div>
							)}
						</div>
						<div className={s.choiceBtn}>
							<label htmlFor="upload-photo" className={s.changeBtn}>
								Change
							</label>
							<input
								type="file"
								accept="image/*"
								id="upload-photo"
								style={{ display: "none" }}
								onChange={handleImageChange}
							/>
							<button className={s.removeBtn} onClick={handleImageRemove}>
								Remove
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className={s.passwordBlock}>
				<h5 className={s.password}>Password change</h5>
				<form className={s.form}>
					<p>
						Current password <span>*</span>
					</p>
					<div className={s.passwordContainer}>
						<input type={passwordVisible ? "text" : "password"} name="password" />
						<img
							src={passwordVisible ? "img/header/eyeClose.svg" : "img/header/eye.svg"}
							width={24}
							alt="eye"
							onClick={handleTogglePasswordVisibility}
						/>
					</div>
				</form>
				<form className={s.form}>
					<p>
						New password <span>*</span>
					</p>
					<div className={s.passwordContainer}>
						<input type={passwordVisible ? "text" : "password"} name="newPassword" />
						<img
							src={passwordVisible ? "img/header/eyeClose.svg" : "img/header/eye.svg"}
							width={24}
							alt="eye"
							onClick={handleTogglePasswordVisibility}
						/>
					</div>
				</form>
				<form className={s.form}>
					<p>
						Confirm new password <span>*</span>
					</p>
					<div className={s.passwordContainer}>
						<input type={passwordVisible ? "text" : "password"} name="confirmNewPassword" />
						<img
							src={passwordVisible ? "img/header/eyeClose.svg" : "img/header/eye.svg"}
							width={24}
							alt="eye"
							onClick={handleTogglePasswordVisibility}
						/>
					</div>
				</form>
			</div>
			<button className={s.saveChange}>Save Change</button>
		</div>
	);
};

export default Details;
