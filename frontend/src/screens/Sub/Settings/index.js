import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { isEmpty, cloneDeep, merge, mapValues, isNull } from 'lodash';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import {
	actions as licenseActions,
	getLicensesSelector
} from '../../../redux/ducks/userlicenses';
import {
	getUserSelector,
	actions as userActions,
} from '../../../redux/ducks/user';
import {
	getCompanySelector,
	actions as companyActions,
} from '../../../redux/ducks/companies';
import Table from '../../../components/Table';
import './index.scss';

class Settings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			editable: 'disable',
			btnname: 'Edit',
			btnicon: 'si si-pencil',
			showResetPassform: false,
			isInValidPassword: {
				password: false,
				oldPassword: false,
				confirmPassword: false,
				notequal: false,
			},
			addressInvalid: {},
			password: '',
			oldPassword: '',
			confirmPassword: '',
		};
		const { user, getUserInfo, listUserLicenses } = props;
		if (isEmpty(user)) {
			getUserInfo();
		}
		listUserLicenses();
	}

	handleClickEdit = () => {
		const { editable } = this.state;
		if (editable === 'disable') {
			this.setState({ editable: '' });
			this.setState({ btnname: 'Save' });
			this.setState({ btnicon: 'far fa-save' });
		} else {
			this.setState({ editable: 'disable' });
			this.setState({ btnname: 'Edit' });
			this.setState({ btnicon: 'si si-pencil' });
		
			const { updateUserInfo, updateLicenses, user, companyInfo, updateCompanyInfo } = this.props;
			updateLicenses();
			updateUserInfo({ user });
			updateCompanyInfo({ id: this.getIdFromUrl(companyInfo.url), params: companyInfo });
		}
	};

	onChangeHandler = e => {
		const property = e.target.name;
		const value = e.target.value;
		this.setState({ [property]: value });
	};

	onAddLicense = () => {
		const { addLicense, user } = this.props;
		const newelement = {
			type: '',
			number: '',
			expire_date: '',
			user: user.url,
		};
		addLicense(newelement);
	};

	onDeleteLicense = id => {
		const { deleteLicense } = this.props;
		deleteLicense({ id });
	};

	onChangeStateLicenseHandler = id => e => {
		const { value, name: prop } = e.target;
		const { userLicenses, updateLicenseState } = this.props;
		const params = {};
		Object.assign(params, userLicenses[id]);
		params[prop] = value;
		params.expire_date = moment(params.expire_date).format('YYYY-MM-DD');
		updateLicenseState({ id, params });
	};

	onResetPasswordHandler = () => {
		this.setState({ showResetPassform: true });
	};

	onResetPassword = () => {
		const { password, oldPassword, confirmPassword } = this.state;
		const { updateUserInfo } = this.props;
		const isInValidPassword = {
			notequal: false,
			password: false,
			oldPassword: false,
			confirmPassword: false,
		};
		let isInValid = false;
		if (password !== confirmPassword) {
			isInValidPassword.notequal = true;
			isInValid = true;
		}
		if (isEmpty(password)) { isInValidPassword.password = true; isInValid = true;}
		if (isEmpty(confirmPassword)) { isInValidPassword.confirmPassword = true; isInValid = true; }
		if (isEmpty(oldPassword)) { isInValidPassword.oldPassword = true; isInValid = true; }
		if (isInValid) {
			this.setState({ isInValidPassword });
		} else {
			this.setState({ isInValidPassword });
			updateUserInfo({ user: {
				old_password: oldPassword,
				confirm_password: confirmPassword,
				password,
			}});
		}
	};


	getAddressStr = (address) => {
		const { line_1: line1, line_2: line2, town, state, zip_code:zipCode } = address;
		return `${line1 || ''} ${line2 || ''} ${town || ''}, ${state || ''} ${zipCode || ''}`;
	}

	onUserEditHandler = (prop, value) => {
		const { user, shallowUpdateUser } = this.props;
		const userInfo = cloneDeep(user);
		userInfo[prop] = value;
		shallowUpdateUser({ user: userInfo });
	}

	onNameEditHandler = value => {
		const { user, shallowUpdateUser } = this.props;
		if (value) {
			const n = value.lastIndexOf(' ');
			const firstName = value.slice(0, n);
			const lastName = value.slice(n + 1);
			shallowUpdateUser({ user: { ...user, first_name: firstName, last_name: lastName } });
		}
	}

	onAddressChanged = () => {
		const { user, shallowUpdateUser } = this.props;
		const emptyAddress = {
			line_1: '',
			line_2: '',
			town: '',
			state: '',
			zip_code: '',
		};
		const addressInvalid = {};
		const newAddress = merge(emptyAddress, user.addressObj);
		let isInValid = false;
		mapValues(newAddress, (value, key) => {
			if (!value && key !== 'line_2') {
				addressInvalid[key] = true;
				isInValid = true;
			}
		});
		if (isInValid) {
			this.setState({ addressInvalid });
		} else {
			shallowUpdateUser({ user: { ...user, addressObj: newAddress }});
			this.setState({ addressInvalid });
		}
	}

	changeAddress = (e) => {
		const prop = e.target.name;
		const value = e.target.value;
		const { addressInvalid } = this.state;
		const { shallowUpdateUser, user } = this.props;
		const newAddress = cloneDeep(user.addressObj);
		const newAddressInvalid = cloneDeep(addressInvalid);
		if (value) newAddressInvalid[prop] = false;
		 else newAddressInvalid[prop] = true;
		newAddress[prop] = value;
		shallowUpdateUser({ user: { ...user, addressObj: newAddress }});
		this.setState({ addressInvalid: newAddressInvalid });
	}

	datepickerChanged = (id, e) => {
		if (!isNull(e)) {
			const data = e.target;
			setTimeout(() => {
				const { value, name: prop } = data;
				const { userLicenses, updateLicenseState } = this.props;
				const params = {};
				Object.assign(params, userLicenses[id]);
				params[prop] = value;
				params.expire_date = moment(params.expire_date).format('YYYY-MM-DD');
				updateLicenseState({ id, params });
			}, 300);
		}
	}

	onUpdateCompanyDetails = (prop, value) => {
		this.setState({ [`company_${prop}`]: value });
		const { companyInfo, updateCompanyPartialInfo } = this.props;
		const newCompanyInfo = cloneDeep(companyInfo);
		newCompanyInfo[prop] = value;
		updateCompanyPartialInfo({ companyInfo: newCompanyInfo })
	};

	getIdFromUrl = url => url.slice(0, -1).split('/').pop();

	render() {
		const {
			editable,
			btnname,
			btnicon,
			showResetPassform,
			isInValidPassword,
			password,
			oldPassword,
			confirmPassword,
			addressInvalid,
		} = this.state;
		const { userLicenses: license, user, companyInfo, getCompanyInfo } = this.props;
		const {
			first_name: firstName,
			last_name: lastName,
			phone,
			email,
			addressObj: address,
		} = user;
		if (isEmpty(companyInfo)) {
			getCompanyInfo({ id: this.getIdFromUrl(user.company)});
		}
	
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								Sub Profile and Settings
							</h1>
							<button
								type="button"
								className="btn btn-success"
								onClick={this.onAddLicense}
							>
								+ Add New License
							</button>
						</div>
					</div>
				</div>

				<div className="content settings">
					<div className="table-tool">
						<button
							type="button"
							className="btn btn-sm btn-hero-dark mr-1 mb-3"
							onClick={this.handleClickEdit}
						>
							<i className={btnicon} /> {btnname}
						</button>
					</div>
					<Table
						tableName={companyInfo.name || ''}
						onComapnyNameChanged={value => this.onUpdateCompanyDetails('name', value)}
						tableStyle="table-striped table-bordered"
						editable={editable}
					>
						<tbody>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Contact name</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="name"
										value={`${firstName} ${lastName}`}
										onChange={e => this.onNameEditHandler(e.target.value)}
										disabled={editable}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Email</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="email"
										value={email}
										style={{ textTransform: 'inherit' }}
										onChange={e => this.onUserEditHandler('email', e.target.value)}
										disabled={editable}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Address</p>
								</td>
								<td className="table-width-80" colSpan="4">
									{editable &&
										<input
											type="text"
											value={this.getAddressStr(address)}
											disabled={editable}
										/>
									}
									{!editable &&
										<React.Fragment>
											<div className="locationdetail-form">
												<input
													value={address.line_1 || ''}
													className={addressInvalid.line_1 ? 'is-invalid form-control' : ''}
													name="line_1"
													placeholder="Address 1"
													onChange={this.changeAddress}
												/>
												<input 
													value={address.line_2 || ''}
													name="line_2"
													placeholder="Address 2"
													onChange={this.changeAddress}
												/>
												<input 
													value={address.town || ''}
													name="town"
													className={addressInvalid.town ? 'is-invalid form-control' : ''}
													placeholder="City"
													onChange={this.changeAddress}
												/>
												<input 
													value={address.state || ''}
													name="state"
													className={addressInvalid.state ? 'is-invalid form-control' : ''}
													placeholder="State"
													onChange={this.changeAddress}
												/>
												<input 
													name="country"
													placeholder="USA"
													disabled
												/>
												<input
													value={address.zip_code || ''}
													name="zip_code"
													className={addressInvalid.zip_code ? 'is-invalid form-control' : ''}
													placeholder="Zip code"
													onChange={this.changeAddress}
												/>
											</div>
										</React.Fragment>
									}
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Phone</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<PhoneInput
										placeholder="Enter phone number"
										value={ phone }
										className="phoneinput"
										country="US"
										disabled={!!editable}
										onChange={value => this.onUserEditHandler('phone', value)}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">EIN #</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="ein"
										value={companyInfo.ein || ''}
										onChange={e => this.onUpdateCompanyDetails('ein', e.target.value)}
										disabled={editable}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td>
									<p className="text-info">License number</p>
								</td>
								<td className="table-width-30">Type</td>
								<td className="table-width-30">Number</td>
								<td className="table-width-40" colSpan="2">
									Expiredate
								</td>
							</tr>
							{license.map((item, id) => (
								// eslint-disable-next-line
								<tr className="text-left" key={id}>
									<td />
									<td className="table-width-30">
										<input
											type="text"
											name="type"
											value={item.type}
											disabled={editable}
											onChange={this.onChangeStateLicenseHandler(id)}
										/>
									</td>
									<td className="table-width-30">
										<input
											type="text"
											name="number"
											value={item.number}
											disabled={editable}
											onChange={this.onChangeStateLicenseHandler(id)}
										/>
									</td>
									<td className="table-width-40">
										{editable && 
											<input
												type="text"
												value={moment(item.expire_date, 'YYYY-MM-DD', true).isValid() ? moment(item.expire_date).format('MM/DD/YYYY') : ''}
												disabled={editable}
											/>
										}
										{!editable &&
											<input
												type="text"
												ref="endDateEleRef"
												className="js-datepicker form-control"
												name="expire_date"
												data-week-start="1"
												data-autoclose="true"
												data-today-highlight="true"
												data-date-format="mm/dd/yyyy"
												defaultValue={moment(item.expire_date, 'YYYY-MM-DD', true).isValid() ? moment(item.expire_date).format('MM/DD/YYYY') : ''}
												onBlur={e => this.datepickerChanged(id, e)}
												placeholder="MM/DD/YYYY"
											/>
										}
									</td>
									<td className="text-left">
										<div className="btn-group">	
											<button
												type="button"
												disabled={editable}
												className="btn btn-sm btn-primary js-tooltip-enabled"
												data-toggle="tooltip"
												data-original-title="Delete"
												onClick={() => this.onDeleteLicense(id)}
											>
												<i className="far fa-trash-alt" />
											</button>
										</div>
									</td>
								</tr>
							))}
							<tr className="text-left">
								<td>
									<p className="text-info">Password</p>
								</td>
								<td colSpan="4" className="password">
									{showResetPassform && 
										<React.Fragment>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<div>
													<input
														type="password"
														name="oldPassword"
														value={oldPassword}
														className={isInValidPassword.oldPassword && 'is-invalid'}
														placeholder="Old Password"
														onChange={this.onChangeHandler}
													/>
													{isInValidPassword.oldPassword && (
														<div id="login-password-error" className="invalid-feedback animated fadeIn">
															{'Required'}
														</div>
													)}
												</div>
												<div>
													<input
														type="password"
														name="password"
														value={password}
														className={isInValidPassword.password && 'is-invalid'}
														placeholder="New Password"
														onChange={this.onChangeHandler}
													/>
													{isInValidPassword.password && (
														<div id="login-password-error" className="invalid-feedback animated fadeIn">
															{'Required'}
														</div>
													)}
												</div>
												<div>
													<input
														type="password"
														name="confirmPassword"
														className={isInValidPassword.confirmPassword && 'is-invalid'}
														value={confirmPassword}
														placeholder="Confirm Password"
														onChange={this.onChangeHandler}
													/>
													{isInValidPassword.password && (
														<div id="login-password-error" className="invalid-feedback animated fadeIn">
															{'Required'}
														</div>
													)}
												</div>
												<button
													type="button"
													className="btn btn-primary"
													style={{ height: 'max-content' }}
													onClick={this.onResetPassword}
												>
													Reset Password
												</button>
											</div>
											{isInValidPassword.notequal && (
												<div id="login-password-error" className="invalid-feedback animated fadeIn">
													{'Confirm Password doesn\'t match with password'}
												</div>
											)}
										</React.Fragment>
									}
									{!showResetPassform &&
										<button
											type="button"
											className="btn btn-primary"
											onClick={this.onResetPasswordHandler}
										>
											Reset here
										</button>
									}
								</td>
							</tr>
						</tbody>
					</Table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	userLicenses: getLicensesSelector(state),
	user: getUserSelector(state),
	companyInfo: getCompanySelector(state),
});

const mapDispatchToProps = dispatch => ({
	addLicense: params => dispatch(licenseActions.add_license(params)),
	listUserLicenses: () => dispatch(licenseActions.get_licenses()),
	deleteLicense: params => dispatch(licenseActions.delete_license(params)),
	updateLicenses: () => dispatch(licenseActions.update_licenses()),
	updateLicenseState: params => dispatch(licenseActions.update_license_state(params)),
	getUserInfo: () => dispatch(userActions.get_user()),
	updateUserInfo: params => dispatch(userActions.update_user(params)),
	shallowUpdateUser: params => dispatch(userActions.update_user_state(params)),
	getCompanyInfo: params => dispatch(companyActions.get_company(params)),
	updateCompanyInfo: params => dispatch(companyActions.update_company(params)),
	updateCompanyPartialInfo: params => dispatch(companyActions.update_company_partial(params)),
})

Settings.propTypes = {
	userLicenses: PropTypes.array.isRequired,
	addLicense: PropTypes.func.isRequired,
	listUserLicenses: PropTypes.func.isRequired,
	updateLicenses: PropTypes.func.isRequired,
	deleteLicense: PropTypes.func.isRequired,
	updateLicenseState: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	getUserInfo: PropTypes.func.isRequired,
	shallowUpdateUser: PropTypes.func.isRequired,
	updateUserInfo: PropTypes.func.isRequired,
	getCompanyInfo: PropTypes.func.isRequired,
	updateCompanyPartialInfo: PropTypes.func.isRequired,
	updateCompanyInfo: PropTypes.func.isRequired,
	companyInfo: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
