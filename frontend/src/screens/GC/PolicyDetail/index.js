import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { cloneDeep, mapValues } from 'lodash';
import 'react-phone-number-input/style.css'

import { getPolicyForUser, updatePolicyForUser, getAddressById } from '../../../api';
import Table from '../../../components/Table';
import './index.scss';

class PolicyDetail extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			editable: 'disable',
			btnname: 'Edit',
			btnicon: 'si si-pencil',
			policy: {},
			formData: new FormData(),
			agentAddresses: [],
		};
		const { match } = props;
		this.policyId = match.params.id;
		getPolicyForUser(this.policyId)
			.then(res => {
				const policy = {
					type: res.type,
					number: res.number,
					renewal_date: res.renewal_date,
					file_url: res.file,
					company: res.company,
					agent: res.agent,
				}
				res.agent.map((agent, index) => this.getAddress(index, agent.address));
				return this.setState({ policy })
			});
	}

	handleClickEdit = () => {
		const { editable, policy, formData } = this.state;
		if (editable === 'disable') {
			this.setState({ editable: '' });
			this.setState({ btnname: 'Save' });
			this.setState({ btnicon: 'far fa-save' });
		} else {
			this.setState({ editable: 'disable' });
			this.setState({ btnname: 'Edit' });
			this.setState({ btnicon: 'si si-pencil' });
			mapValues(policy, (value, key) => {
				formData.append(key, value);
			});

			updatePolicyForUser(this.policyId, formData)
				.then(res => {
					const newPolicy = {
						type: res.type,
						number: res.number,
						renewal_date: res.renewal_date,
						file_url: res.file,
						company: res.company,
						agent: res.agent,
					};
					return this.setState({ policy: newPolicy })
				});
		}
	};

	changePolicyType = (e) => {
		const { policy } = this.state;
		const newPolicy = cloneDeep(policy);
		newPolicy.type = e.target.value;
		this.setState({ policy: newPolicy });
	}

	datepickerChanged = () => {
		setTimeout(() => {
			const { policy } = this.state;
			// eslint-disable-next-line react/no-string-refs
			const value = this.refs.endDateEleRef && this.refs.endDateEleRef.value;
			const newPolicy = cloneDeep(policy);
			newPolicy.renewal_date = moment(value).format('YYYY-MM-DD');
			this.setState({ policy: newPolicy });
		}, 300);
	}

	onNumberChangeHandler = (prop, value) => {
		const { policy } = this.state;
		const reg = /^\d+$/;
		if (value === '' || reg.test(value)) {
			const newPolicy = cloneDeep(policy);
			newPolicy[prop] = value;
			this.setState({ policy: newPolicy });
		}
	}

	onFileChange = () => {
		const  { formData } = this.state;
		formData.append('file', this.file.files[0]);
		this.setState({ formData });
	}

	unlinkAgent = () => {
		const { policy } = this.state;
		const newPolicy = cloneDeep(policy);
		newPolicy.agent = [];
		this.setState({ policy: newPolicy });
	}

	getIdFromUrl = url => (url && url !== null && url !== undefined) ? url.slice(0, -1).split('/').pop() : '';

	getAddress = (index, url) => {
		const id = this.getIdFromUrl(url);
		return getAddressById(id).then(res => {
			const { agentAddresses } = this.state;
			const addresses = cloneDeep(agentAddresses);
			addresses[index] = res;
			this.setState({ agentAddresses: addresses });
			return res;
		});
	}

	getAddressStr = (address) => {
		const { line_1: line1, line_2: line2, town, state, zip_code:zipCode } = address;
		return `${line1 || ''} ${line2 || ''} ${town || ''}, ${state || ''} ${zipCode || ''}`;
	}

	render() {
		const {
			editable,
			btnname,
			btnicon,
			policy,
			agentAddresses,
		} = this.state;

        const download = policy.file_url ? (<a target="_blank" rel="noopener noreferrer" href={policy.file_url} className="btn btn-success" > Download Policy </a>) : null
	
		return (
			<div id="main" className="policydetail">
				<div className="bg-body-light">
					<div className="content content-full d-flex align-items-center">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center" style={{ flex: 1 }}>
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								GC Policy Details
							</h1>
						</div>
						{ download }
					</div>
				</div>
				<div className="content settings">
					<div style={{ marginBottom: -40 }}>
						<h4 className="flex-sm-fill">
							Policy Details
						</h4>
					</div>
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
						tableName=""
						onComapnyNameChanged={value => this.onUpdateCompanyDetails('name', value)}
						tableStyle="table-striped table-bordered"
						editable={editable}
					>
						<tbody>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Type</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<div>
										<div className="form-check form-check-inline">
											<input
												className="form-check-input"
												type="radio"
												id="example-radios-inline1"
												name="example-radios-inline"
												value="GL"
												checked={policy.type === 'GL'}
												onClick={this.changePolicyType}
												disabled={editable}
											/>
											GL
										</div>
										<div className="form-check form-check-inline">
											<input
												className="form-check-input"
												type="radio"
												id="example-radios-inline2"
												name="example-radios-inline"
												value="WC"
												checked={policy.type === 'WC'}
												onClick={this.changePolicyType}
												disabled={editable}
											/>
											WC
										</div>
										<div className="form-check form-check-inline">
											<input
												className="form-check-input"
												type="radio"
												id="example-radios-inline3"
												name="example-radios-inline"
												value="DBL"
												checked={policy.type === 'DBL'}
												onClick={this.changePolicyType}
												disabled={editable}
											/>
											DBL
										</div>
									</div>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Number</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<div>
										<input
											type="text"
											value={policy.number || ''}
											className="form-control"
											onChange={e => this.onNumberChangeHandler('number', e.target.value)}
											placeholder="Number"
											disabled={editable}
										/>
									</div>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Expire Date</p>
								</td>
								<td className="table-width-80" colSpan="4">
									{editable && 
										<input
											type="text"
											placeholder="MM/DD/YYYY"
											value={moment(policy.renewal_date, 'YYYY-MM-DD', true).isValid() ? moment(policy.renewal_date).format('MM/DD/YYYY') : ''}
											disabled={editable}
										/>
									}
									{!editable &&
										<input
											type="text"
											// eslint-disable-next-line react/no-string-refs
											ref="endDateEleRef"
											className="js-datepicker form-control"
											name="renewal_date"
											data-week-start="1"
											data-autoclose="true"
											data-today-highlight="true"
											data-date-format="mm/dd/yyyy"
											defaultValue={moment(policy.renewal_date, 'YYYY-MM-DD', true).isValid() ? moment(policy.renewal_date).format('MM/DD/YYYY') : ''}
											onBlur={this.datepickerChanged}
											placeholder="MM/DD/YYYY"
										/>
									}
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Policy File</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<div>
										<input
											type="file"
											ref={(ref) => { this.file = ref; }}
											onChange={this.onFileChange}
											style={{ display: 'none' }}
										/>
										<button
											type="button"
											className="btn btn-success"
											onClick={() => this.file && this.file.click()}
											disabled={editable}
										>
											Upload New Policy
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</Table>
					{(policy.agent && policy.agent.length > 0) &&
						<div style={{ marginTop: 50, marginBottom: -40 }}>
							<h4 className="flex-sm-fill">
								Agent Info
							</h4>
						</div>
					}
					{policy.agent && policy.agent.map((agent, index) =>
						<React.Fragment key={index}>
							<div className="table-tool mb-2">
								<button
									type="button"
									className="btn btn-success"
									onClick={this.unlinkAgent}
								>
									De-link Agent
								</button>
							</div>
							<Table
								tableName={`${agent.first_name}  ${agent.last_name}` || ''}
								onComapnyNameChanged={value => this.onUpdateCompanyDetails('name', value)}
								tableStyle="table-striped table-bordered"
								editable={editable}
							>
								<tbody>
									<tr className="text-left">
										<td className="table-width-20">
											<p className="text-info">Email</p>
										</td>
										<td className="table-width-80" colSpan="4">
											<p>{agent.email}</p>
										</td>
									</tr>
									<tr className="text-left">
										<td className="table-width-20">
											<p className="text-info">Phone</p>
										</td>
										<td className="table-width-80" colSpan="4">
											<p>{agent.phone}</p>
										</td>
									</tr>
									<tr className="text-left">
										<td className="table-width-20">
											<p className="text-info">Company Name</p>
										</td>
										<td className="table-width-80" colSpan="4">
											<p>{agent.company_name}</p>
										</td>
									</tr>
									<tr className="text-left">
										<td className="table-width-20">
											<p className="text-info">Address</p>
										</td>
										<td className="table-width-80" colSpan="4">
											<p>{agentAddresses[index] && this.getAddressStr(agentAddresses[index])}</p>
										</td>
									</tr>
								</tbody>
							</Table>
						</React.Fragment>
					)}
				</div>
			</div>
		);
	}
}

PolicyDetail.propTypes = {
	match: PropTypes.object.isRequired,
};

export default PolicyDetail;
