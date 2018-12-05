import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, cloneDeep, isNull } from 'lodash';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

import {
	getCompanySelector,
	actions as companyActions,
} from '../../../redux/ducks/companies';
import Table from '../../../components/Table';
import './index.scss';
import { stateList, getIdFromUrl } from '../../../utils';
import { getAddressById, updateAddressById, getUser } from '../../../api';

class Details extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			editable: 'disable',
			mainContact: null,
			license: '',
			addressInvalid: {},
			addressObj: {},
		};
		const { match, getCompanyInfo } = props;
		const companyId = match.params.id;
		getCompanyInfo({ id: companyId });

	}

	componentWillReceiveProps (nextProps) {
		const { companyInfo } = nextProps;
		const { addressObj, mainContact } = this.state;
		if (isEmpty(addressObj)) {
			getAddressById(getIdFromUrl(companyInfo.address))
				.then(res => this.setState({ addressObj: res }));
		}
		if (isNull(mainContact)) {
			getUser(companyInfo.main_contact)
				.then(res => this.setState({ mainContact: `${res.first_name} ${res.last_name}` }))
		}
	}

	handleClickEdit = () => {
		const { editable, addressObj } = this.state;
		if (editable === 'disable') {
			this.setState({ editable: '' });
		} else {
			this.setState({ editable: 'disable' });
			const { companyInfo, updateCompanyInfo } = this.props;
			const params = {
				phone: companyInfo.phone,
			}
			updateCompanyInfo({ id: getIdFromUrl(companyInfo.url), params });
			updateAddressById(getIdFromUrl(companyInfo.address), addressObj)
		}
	};

	handleClickArchive = () => {};

	onChangeHandler = e => {
		const property = e.target.name;
		const value = e.target.value;
		this.setState({ [property]: value });
	};

	onUpdateCompanyDetails = (prop, value) => {
		const { companyInfo, updateCompanyPartialInfo } = this.props;
		const newCompanyInfo = cloneDeep(companyInfo);
		newCompanyInfo[prop] = value;
		updateCompanyPartialInfo({ companyInfo: newCompanyInfo })
	};

	changeAddress = (e) => {
		const prop = e.target.name;
		const value = e.target.value;
		const { addressInvalid, addressObj } = this.state;
		const newAddress = cloneDeep(addressObj);
		const newAddressInvalid = cloneDeep(addressInvalid);
		if (value) newAddressInvalid[prop] = false;
		 else newAddressInvalid[prop] = true;
		newAddress[prop] = value;
		this.setState({ addressInvalid: newAddressInvalid, addressObj: newAddress });
	}

	getAddressStr = (address) => {
		const { line_1: line1, line_2: line2, town, state, zip_code:zipCode } = address;
		return `${line1 || ''} ${line2 || ''} ${town || ''}${town ? ',' : ''} ${state || ''} ${zipCode || ''}`;
	}

	onNameEditHandler = value => {
		if (value) {
			const n = value.lastIndexOf(' ');
			const firstName = value.slice(0, n);
			const lastName = value.slice(n + 1);
			this.setState({ mainContact: `${firstName} ${lastName}` });
		}
	}

	render() {
		const { license, editable, addressInvalid, addressObj, mainContact } = this.state;
		const { companyInfo } = this.props;
		const {
			ein,
			phone,
		} = companyInfo;
	
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								{companyInfo.name || ''}
							</h1>
						</div>
					</div>
				</div>

				<div className="content settings">
					<Table tableName="" tableStyle="table-striped table-bordered">
						<tbody>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Contact name</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="name"
										value={mainContact}
										onChange={e => this.onNameEditHandler(e.target.value)}
										disabled
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
											value={addressObj && this.getAddressStr(addressObj)}
											disabled={editable}
										/>
									}
									{!editable &&
										<React.Fragment>
											<div className="locationdetail-form">
												<input
													value={addressObj.line_1 || ''}
													className={addressInvalid.line_1 ? 'is-invalid form-control' : ''}
													name="line_1"
													placeholder="Address 1"
													onChange={this.changeAddress}
												/>
												<input 
													value={addressObj.line_2 || ''}
													name="line_2"
													placeholder="Address 2"
													onChange={this.changeAddress}
												/>
												<input 
													value={addressObj.town || ''}
													name="town"
													className={addressInvalid.town ? 'is-invalid form-control' : ''}
													placeholder="City"
													onChange={this.changeAddress}
												/>
												<select
													defaultValue={addressObj.state}
													name="state"
													className={`form-control ${addressInvalid.state && 'is-invalid'}`}
													placeholder="State"
													onChange={this.changeAddress}
												>
													{stateList.map((state, index) =>
														<option value={state.abbreviation} key={index}>{state.name}</option>	
													)}
												</select>
												<input 
													name="country"
													placeholder="USA"
													disabled
												/>
												<input
													value={addressObj.zip_code || ''}
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
										value={ein || ''}
										disabled={editable}
									/>
								</td>
							</tr>
						</tbody>
					</Table>
				</div>
				<div className="content">
					<Table tableName="Policies" tableStyle="table-striped" editable="disable">
						<thead className="thead-light">
							<tr className="text-left">
								<th className="table-width-25">Policy type</th>
								<th className="table-width-25">Policy number</th>
								<th className="table-width-25">Status</th>
								<th />
							</tr>
						</thead>
						<tbody>
							<tr className="text-left">
								<td>Workers comp</td>
								<td>XXX</td>
								<td>
									<span className="badge badge-primary">New</span>
								</td>
								<td className="text-right">
									<button type="button" className="btn btn-primary">
										Go
									</button>
								</td>
							</tr>
							<tr className="text-left">
								<td>Disability</td>
								<td>XXX</td>
								<td>
									<span className="badge badge-success">Complete</span>
								</td>
								<td className="text-right">
									<button type="button" className="btn btn-primary">
										Go
									</button>
								</td>
							</tr>
							<tr className="text-left">
								<td>General liability</td>
								<td>XXX</td>
								<td>
									<span className="badge badge-warning">Submitted</span>
								</td>
								<td className="text-right">
									<button type="button" className="btn btn-primary">
										Go
									</button>
								</td>
							</tr>
							<tr className="text-left">
								<td>Disability</td>
								<td>XXX</td>
								<td>
									<span className="badge badge-primary">New</span>
								</td>
								<td className="text-right">
									<button type="button" className="btn btn-primary">
										Go
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

Details.propTypes = {
	match: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
	// userLicenses: getLicensesSelector(state),
	companyInfo: getCompanySelector(state),
});

const mapDispatchToProps = dispatch => ({
	// addLicense: params => dispatch(licenseActions.add_license(params)),
	// listUserLicenses: () => dispatch(licenseActions.get_licenses()),
	// deleteLicense: params => dispatch(licenseActions.delete_license(params)),
	// updateLicenses: () => dispatch(licenseActions.update_licenses()),
	// updateLicenseState: params => dispatch(licenseActions.update_license_state(params)),
	getCompanyInfo: params => dispatch(companyActions.get_company(params)),
	updateCompanyInfo: params => dispatch(companyActions.update_company(params)),
	updateCompanyPartialInfo: params => dispatch(companyActions.update_company_partial(params)),
})

Details.propTypes = {
	// userLicenses: PropTypes.array.isRequired,
	// addLicense: PropTypes.func.isRequired,
	// listUserLicenses: PropTypes.func.isRequired,
	// updateLicenses: PropTypes.func.isRequired,
	// deleteLicense: PropTypes.func.isRequired,
	// updateLicenseState: PropTypes.func.isRequired,
	getCompanyInfo: PropTypes.func.isRequired,
	updateCompanyPartialInfo: PropTypes.func.isRequired,
	updateCompanyInfo: PropTypes.func.isRequired,
	companyInfo: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
