import React, { useState } from "react";
import PhoneInput from "react-phone-number-input/input";

import s from "./index.module.scss";

const Address: React.FC = () => {
	const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
	const [showRegionDropdown, setShowRegionDropdown] = useState(false);
	const [showStateDropdown, setShowStateDropdown] = useState(false);
	const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
	const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
	const [filteredStates, setFilteredStates] = useState<string[]>([]);
	const [showRegionDropdownImg, setShowRegionDropdownImg] = useState(false);
	const [showStateDropdownImg, setShowStateDropdownImg] = useState(false);

	const handlePhoneChange = (value: string | undefined) => {
		setPhoneNumber(value);
	};

	const toggleRegionDropdown = () => {
		setShowRegionDropdown(!showRegionDropdown);
		setShowStateDropdown(false);
		setShowRegionDropdownImg(!showRegionDropdownImg);
		setShowStateDropdownImg(false);
		if (!showRegionDropdown) {
			handleRegionInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
		}
	};

	const toggleStateDropdown = () => {
		setShowStateDropdown(!showStateDropdown && !!selectedCountry);
		setShowRegionDropdown(false);
		setShowStateDropdownImg(!showStateDropdownImg);
		setShowRegionDropdownImg(false);
		if (!showStateDropdown) {
			handleStateInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
		}
	};

	const handleRegionSelect = (selectedRegion: string) => {
		const regionInput = document.getElementById("Region") as HTMLInputElement;
		regionInput.value = selectedRegion;
		setSelectedCountry(selectedRegion);
		setShowRegionDropdown(false);
		setShowStateDropdown(false);
	};

	const handleStateSelect = (selectedState: string) => {
		const stateInput = document.getElementById("State") as HTMLInputElement;
		stateInput.value = selectedState;
		setShowStateDropdown(false);
	};

	const handleRegionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value.toLowerCase();

		type Country = {
			id: number;
			country: string;
		};

		const availableRegions: Country[] = [
			{ id: 1, country: "USA" },
			{ id: 2, country: "Russia" },
			{ id: 3, country: "Germany" },
			{ id: 4, country: "Japan" },
			{ id: 5, country: "China" }
		];

		const filteredRegions = availableRegions
			.filter((region) => region.country.toLowerCase().startsWith(inputValue))
			.map((region) => region.country);

		setFilteredRegions(filteredRegions);
		setShowRegionDropdown(true);
		setSelectedCountry(undefined);
		setFilteredStates([]);
		setShowStateDropdown(false);

		if (!inputValue) {
			handleRegionInputClear();
		}
	};

	const handleRegionInputClear = () => {
		const regionInput = document.getElementById("Region") as HTMLInputElement;
		const stateInput = document.getElementById("State") as HTMLInputElement;

		regionInput.value = "";
		stateInput.value = "";
		setSelectedCountry(undefined);
		setShowStateDropdown(false);
	};

	const handleStateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value.toLowerCase();

		const statesByCountry: Record<string, string[]> = {
			USA: ["New York", "California", "Texas", "Florida"],
			Russia: ["Moscow", "Saint Petersburg", "Novosibirsk"],
			Germany: ["Berlin", "Munich", "Hamburg"],
			Japan: ["Tokyo", "Osaka", "Kyoto"],
			China: ["Beijing", "Shanghai", "Guangzhou"]
		};

		const selectedStates = statesByCountry[selectedCountry || ""];

		if (selectedStates && selectedCountry) {
			const filteredStates = selectedStates.filter((state) =>
				state.toLowerCase().startsWith(inputValue)
			);
			setFilteredStates(filteredStates);
			setShowStateDropdown(true);
		} else {
			setShowStateDropdown(false);
		}
	};

	return (
		<div className={s.addressBlock}>
			<div className={s.addAddress}>
				<div className={s.billingAddres}>
					<h5>Billing Address</h5>
					<p>The following addresses will be used on the checkout page by default.</p>
				</div>
				<p className={s.addBtn}>Add</p>
			</div>
			<div className={s.inputBlock}>
				<form className={s.firstForm}>
					<label htmlFor="firstName">
						<p className={s.formText}>
							First Name <span>*</span>
						</p>
						<input type="text" id="firstName" name="firstName" />
					</label>
				</form>
				<form className={s.secondForm}>
					<label htmlFor="lastName">
						<p className={s.formText}>
							Last Name <span>*</span>
						</p>
						<input type="text" id="lastName" name="lastName" />
					</label>
				</form>
			</div>

			<div className={s.inputBlock}>
				<form className={s.firstForm}>
					<label htmlFor="Region">
						<p className={s.formText}>
							Country / Region <span>*</span>
						</p>
						<input
							onChange={handleRegionInputChange}
							onClick={toggleRegionDropdown}
							placeholder="Select a country / region"
							type="text"
							id="Region"
							name="Region"
						/>
						<img
							className={showRegionDropdown ? s.arrdownActive : s.arrdown}
							src="img/address/arrdown.svg"
							alt="arrdown"
						/>
					</label>
					{showRegionDropdown && (
						<div className={s.dropdownContent}>
							<ul className={s.regionList}>
								{filteredRegions.map((region, index) => (
									<li key={index} onClick={() => handleRegionSelect(region)}>
										{region}
									</li>
								))}
							</ul>
						</div>
					)}
				</form>

				<form className={s.secondForm}>
					<label htmlFor="City">
						<p className={s.formText}>
							Town / City <span>*</span>
						</p>
						<input type="text" id="City" name="City" />
					</label>
				</form>
			</div>

			<div className={s.inputBlock}>
				<form className={s.firstForm}>
					<label htmlFor="State">
						<p className={s.formText}>
							State <span>*</span>
						</p>
						<input
							onChange={handleStateInputChange}
							onClick={toggleStateDropdown}
							placeholder="Select a state"
							type="text"
							id="State"
							name="State"
							disabled={!selectedCountry}
						/>
						<img
							className={showStateDropdown ? s.arrdownActive : s.arrdown}
							src="img/address/arrdown.svg"
							alt="arrdown"
						/>
					</label>
					{showStateDropdown && (
						<div className={s.dropdownContent}>
							<ul className={s.stateList}>
								{filteredStates.map((state, index) => (
									<li key={index} onClick={() => handleStateSelect(state)}>
										{state}
									</li>
								))}
							</ul>
						</div>
					)}
				</form>
				<form className={s.firstForm}>
					<label htmlFor="Region">
						<p className={s.formText}>
							Street Address <span>*</span>
						</p>
						<input
							placeholder="House number and street name"
							type="text"
							id="Region"
							name="Region"
						/>
					</label>
				</form>
			</div>

			<div className={s.inputBlock}>
				<form className={s.firstForm}>
					<label htmlFor="EmailAddress">
						<p className={s.formText}>
							Email address<span>*</span>
						</p>
						<input type="text" id="EmailAddress" name="EmailAddress" />
					</label>
				</form>
				<form className={s.secondForm}>
					<label htmlFor="City">
						<p className={s.formText}>
							Town / City <span>*</span>
						</p>
						<input type="text" id="City" name="City" />
					</label>
				</form>
			</div>

			<div className={s.inputBlock}>
				<form className={s.secondForm}>
					<label htmlFor="PhoneNumber">
						<p className={s.formText}>
							Phone Number <span>*</span>
						</p>
						<PhoneInput
							id="PhoneNumber"
							name="PhoneNumber"
							placeholder="Enter phone number"
							value={phoneNumber}
							onChange={handlePhoneChange}
						/>
					</label>
				</form>
			</div>
		</div>
	);
};

export default Address;
