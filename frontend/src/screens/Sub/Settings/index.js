import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { isEmpty, cloneDeep } from 'lodash';
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
import Table from '../../../components/Table';
import './index.scss';
import LocationSearchInput from '../../../components/LocationSearchInput';

class Settings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			editable: 'disable',
			ein: '61-512584',
			btnname: 'Edit',
			btnicon: 'si si-pencil',
			showResetPassform: false,
			isInValidPassword: {
				password: false,
				oldPassword: false,
				confirmPassword: false,
				notequal: false,
			},
			password: '',
			oldPassword: '',
			confirmPassword: '',
			user: {
				first_name: '',
				last_name: '',
				addressObj: {
					line_1: '',
					line_2: '',
					town: '',
					state: '',
					country: '',
				},
			}
		};
		const { user, getUserInfo, listUserLicenses } = props;
		if (isEmpty(user)) {
			getUserInfo();
		}
		listUserLicenses();
	}

	
	componentWillReceiveProps(nextProps) {
		const { user } = nextProps;
		this.setState({ user });
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
		
			const { user } = this.state;
			const { updateUserInfo } = this.props;
			updateUserInfo({ user });
		}
	};

	onChangeHandler = e => {
		const property = e.target.name;
		const value = e.target.value;
		this.setState({ [property]: value });
	};

	onAddLicense = () => {
		const { createLicense } = this.props;
		const newelement = {
			type: 'GC',
			number: '12345678',
			expire_date: moment().format("YYYY-MM-DD"),
		};
		createLicense(newelement);
	};

	onDeleteLicense = id => {
		const { userLicenses, removeLicense } = this.props;
		const licenseUrlData = userLicenses[id].url.split('/');
		licenseUrlData.pop();
		const licenseId = licenseUrlData.pop();
		const userId = licenseUrlData.pop();
		removeLicense({ userId, licenseId });
	};

	onChangeLicenseHandler = id => e => {
		const { value, name: prop } = e.target;
		const { userLicenses, updateLicense } = this.props;
		const licenseUrlData = userLicenses[id].url.split('/');
		const params = userLicenses[id];
		params[prop] = value;
		params.expire_date = moment(params.expire_date).format('YYYY-MM-DD');
		licenseUrlData.pop();
		const licenseId = licenseUrlData.pop();
		const userId = licenseUrlData.pop();
		updateLicense({ userId, licenseId, params });
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
		return `${line1} ${line2} ${town}, ${state} ${zipCode}`;
	}

	onUserEditHandler = (prop, value) => {
		const { user } = this.state;
		const userInfo = cloneDeep(user);
		userInfo[prop] = value;
		this.setState({ user: userInfo });
	}

	onNameEditHandler = value => {
		const { user } = this.state;
		if (value) {
			const n = value.lastIndexOf(' ');
			const firstName = value.slice(0, n);
			const lastName = value.slice(n + 1);
			this.setState({ user: { ...user, first_name: firstName, last_name: lastName } });
		}
	}

	onAddressChanged = (address) => {
		const { user } = this.state;
		this.setState({ user: { ...user, addressObj: address } });
	}

	render() {
		const {
			ein,
			editable,
			btnname,
			btnicon,
			showResetPassform,
			user,
			isInValidPassword,
			password,
			oldPassword,
			confirmPassword,
		} = this.state;
		const { userLicenses: license } = this.props;
		const {
			first_name: firstName,
			last_name: lastName,
			phone,
			addressObj: address,
		} = user;
	
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

				<div className="content">
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
						tableName="ABC Construction Company, Inc."
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
										<LocationSearchInput
											onAddressChanged={this.onAddressChanged}
											className="locationSearchForm"
											placeholder={this.getAddressStr(address)}
										/>
										
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
										country="US"
										disabled={editable}
										onChange={value => this.onUserEditHandler('phone', value)} />
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
										value={ein}
										onChange={this.onChangeHandler}
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
								<tr className="text-center" key={id}>
									<td />
									<td className="table-width-30">
										<input
											type="text"
											name="type"
											value={item.type}
											disabled={editable}
											onChange={this.onChangeStateLicenseHandler(id)}
											onBlur={this.onChangeLicenseHandler(id)}
										/>
									</td>
									<td className="table-width-30">
										<input
											type="text"
											name="number"
											value={item.number}
											disabled={editable}
											onChange={this.onChangeStateLicenseHandler(id)}
											onBlur={this.onChangeLicenseHandler(id)}
										/>
									</td>
									<td className="table-width-40">
										<input
											type="text"
											name="expire_date"
											value={item.expire_date}
											disabled={editable}
											onChange={this.onChangeStateLicenseHandler(id)}
											onBlur={this.onChangeLicenseHandler(id)}
										/>
									</td>
									<td className="text-center">
										<div className="btn-group">
											<button
												type="button"
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
});

const mapDispatchToProps = dispatch => ({
	createLicense: params => dispatch(licenseActions.create_license(params)),
	listUserLicenses: () => dispatch(licenseActions.get_licenses()),
	updateLicense: params => dispatch(licenseActions.update_license(params)),
	removeLicense: params => dispatch(licenseActions.remove_license(params)),
	updateLicenseState: params => dispatch(licenseActions.update_license_state(params)),
	getUserInfo: () => dispatch(userActions.get_user()),
	updateUserInfo: params => dispatch(userActions.update_user(params)),
})

Settings.propTypes = {
	userLicenses: PropTypes.array.isRequired,
	createLicense: PropTypes.func.isRequired,
	listUserLicenses: PropTypes.func.isRequired,
	updateLicense: PropTypes.func.isRequired,
	removeLicense: PropTypes.func.isRequired,
	updateLicenseState: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	getUserInfo: PropTypes.func.isRequired,
	updateUserInfo: PropTypes.func.isRequired, 
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
