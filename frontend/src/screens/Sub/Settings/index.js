import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { isEmpty } from 'lodash';

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

class Settings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			editable: 'disable',
			ein: '61-512584',
			btnname: 'Edit',
			btnicon: 'si si-pencil',
			password: '',
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

	onResetPassword = () => {};

	getAddressStr = (address) => {
		const { line_1: line1, line_2: line2, town, state, zip_code:zipCode } = address;
		return `${line1} ${line2} ${town}, ${state} ${zipCode}`;
	}

	render() {
		const { user } = this.props;
		const {
			ein,
			editable,
			btnname,
			btnicon,
			password,
		} = this.state;
		const { userLicenses: license } = this.props;
		const {
			first_name: firstName,
			last_name: lastName,
			phone,
			address,
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
										onChange={this.onChangeHandler}
										disabled={editable}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Address</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="address"
										value={this.getAddressStr(address)}
										onChange={this.onChangeHandler}
										disabled={editable}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Phone</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="phone"
										value={phone}
										onChange={this.onChangeHandler}
										disabled={editable}
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
									<input
										type="password"
										name="password"
										value={password}
										placeholder="Your Password"
										onChange={this.onChangeHandler}
									/>
									<button
										type="button"
										className="btn btn-primary"
										onClick={() => this.onResetPassword}
									>
										Reset here
									</button>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
