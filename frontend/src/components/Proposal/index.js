import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { includes, capitalize } from 'lodash';

import './index.scss';
import { getDataFromUrl, getUserLicensesForUser, getPoliciesForUser } from '../../api';
import { getIdFromUrl, numberWithCommas } from '../../utils';

class Proposal extends React.Component {
	state = {
		subUserInfo: {},
		address: {},
		contingencyDescription: '',
		userLicenses: [],
		userPolicies: [],
	};

	componentDidMount() {
		const { data, jobInProgress } = this.props;
		let user = {};
		getDataFromUrl(data.sub)
			.then(userInfo => {
				user = userInfo;
				this.setState({ subUserInfo: user });
				return getDataFromUrl(userInfo.address)
			})
			.then(address => {
				this.setState({ address });
				const id = getIdFromUrl(user.url);
				return getUserLicensesForUser(id)
			})
			.then(res => res.results)
			.then(licenses => {
				this.setState({ userLicenses: licenses });
				if (jobInProgress) {
					const id = getIdFromUrl(user.url);
					console.log('sub user id:', id);
					return getPoliciesForUser(id)
				}
				return { results: [] };
			})
			.then(res => res.results)
			.then(policies => {
				console.log('user policies:', policies);
				this.setState({ userPolicies: policies })
			})
	}

	getAddressStr = address => {
      return `${address.line_1} ${address.line_2 || ''} ${address.town}, ${address.state} ${address.zip_code}`;
    }

	getComplianceClassName = status => {
		if (status === 'ok') return 'badge-success';
		if (status === 'warning') return 'badge-warning';
		return 'badge-danger';
	}

	changeBidStatus = status => {
		const { data, updateBidStatus } = this.props;
		const { contingencyDescription } = this.state;
		const bidId = getIdFromUrl(data.url);
		const params = {
			status,
			contingency_description: status === 'contingent_accept' ? contingencyDescription : '',
		};
		updateBidStatus(bidId, params);
		this.setState({ showContingentBox: false });
	}

	changeContingencyDesc = (e) => {
		this.setState({ contingencyDescription: e.target.value });
	}

	render() {
		const { subUserInfo, address, userLicenses, userPolicies, showContingentBox, contingencyDescription } = this.state;
		const { data, jobInProgress } = this.props;
        const hideDeclineAccept = data.status !== 'pending'
        const classname = `table table-vcenter table-bordered`;
        const showStatus = !includes(['pending', 'accepted'], data.status);
        const showCompliences = includes(['pending', 'accepted', 'contingent_accept'], data.status)
        const status = capitalize(data.status.split('_').join(' '));

		return (
			<div className="block block-rounded block-bordered">
				{subUserInfo && (
					<div className="block-header block-header-default">
						<h3 className="block-title">{(subUserInfo.company && subUserInfo.company.name) || ''}</h3>
					</div>
				)}
				<div className="block-content" style={{ display: 'flex' }}>
					<table className={classname}>
						<tbody>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">
										Contact name
									</p>
								</td>
								<td
									className="table-width-80"
									colSpan="3"
								>
									<p>{`${subUserInfo.first_name} ${subUserInfo.last_name}` || ''}</p>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">
										Address
									</p>
								</td>
								<td
									className="table-width-80"
									colSpan="3"
								>
									<p>
										{this.getAddressStr(address) || ''}
									</p>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">
										Phone
									</p>
								</td>
								<td colSpan="3">
									<p>{subUserInfo.phone || ''}</p>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">
										Email
									</p>
								</td>
								<td colSpan="3">
									<p>{subUserInfo.email || ''}</p>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">
										EIN #
									</p>
								</td>
								<td colSpan="3">
									<p>{(subUserInfo.company && subUserInfo.company.ein) || ''}</p>
								</td>
                            </tr>
							<tr className="text-left">
								<td>
									<p className="text-info">
										License number
									</p>
								</td>
								<td className="table-width-30">
									Type
								</td>
								<td className="table-width-30">
									Number
								</td>
								<td
									className="table-width-40"
									colSpan="2"
								>
									Expiredate
								</td>
							</tr>
							{userLicenses && userLicenses.map((license, index) => (
								<tr className="text-left" key={index}>
									<td />
									<td className="table-width-30">
										{license.type || ''}
									</td>
									<td className="table-width-30">
										{license.number || ''}
									</td>
									<td
										className="table-width-40"
										colSpan="2"
									>
										{moment(license.expire_date).format('MM/DD/YYYY')}
									</td>
								</tr>
							))}
							{userLicenses.length === 0 &&
								<tr className="text-left">
									<td />
									<td className="table-width-30">
										&nbsp;
									</td>
									<td className="table-width-30">
										&nbsp;
									</td>
									<td
										className="table-width-40"
										colSpan="2"
									>
										&nbsp;
									</td>
								</tr>
							}
						</tbody>
					</table>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'space-around',
							marginLeft: 20,
						}}
					>
						<div className="d-flex font-weight-bold mt-2 mb-2" style={{ fontSize: '1.2em' }}>
							<p className="text-info mr-2">Bid price: </p>
							<p>&nbsp;${numberWithCommas(data.bid)} </p>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
                          {data.COI_file ? (<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.COI_file}
								className="btn btn-primary"
                              >Download COI</a>) : <button className="btn btn-primary" disabled>COI generating</button>}


							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.proposal_file}
								className="btn btn-primary"
							> Download Proposal</a>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }} hidden={!showCompliences}>
							<span className={`badge ${this.getComplianceClassName(data.compliance_GL)}`}>GL</span>&nbsp;
							<span className={`badge ${this.getComplianceClassName(data.compliance_WC)}`}>WC</span>&nbsp;
							<span className={`badge ${this.getComplianceClassName(data.compliance_DB)}`}>DB</span>&nbsp;
						</div>
                        <div style={{ displat: 'flex', flexDirection: 'row' }} hidden={!showStatus}>
                          <span className="text-info"> Status: </span> <span className='badge badge-primary' >{ status }</span>
                        </div>
						<div style={{ display: 'flex', flexDirection: 'row' }} hidden={hideDeclineAccept}>
							<button type="button" className="btn btn-primary" onClick={() => this.changeBidStatus('accepted')}>
								Accept
							</button>
							<button type="button" className="btn btn-primary" onClick={() => this.changeBidStatus('declined')}>
								Decline
							</button>
							<button type="button" className="btn btn-primary" onClick={() => this.setState({ showContingentBox: true })}>
								Contingent accept
							</button>
						</div>
						{showContingentBox &&
							<div className="d-flex">
								<input
									className="form-control"
									type="text"
									name="example-radios-inline"
									value={contingencyDescription}
									onChange={this.changeContingencyDesc}
								/>
								<button type="button" className="btn btn-primary btn-sm" onClick={() => this.changeBidStatus('contingent_accept')}>
									Add Description
								</button>
							</div>
						}
						{!showContingentBox &&
							<div style={{ height: 38 }} />
						}
						<div hidden={!jobInProgress} style={{ height: 50 }} />
					</div>
				</div>
				{jobInProgress &&
					<div className="block-content">
						<table className={classname}>
							<thead className="thead-light">
								<tr>
									<th className="text-center table-width-20">Agent/Broker name</th>
									<th className="text-center table-width-15">Policy type</th>
									<th className="text-center table-width-15">Policy number</th>
									<th className="text-center table-width-20">Renewal Date</th>
									<th className="text-center table-width-15">Status</th>
								</tr>
							</thead>
							<tbody>
								{userPolicies.map((policy, index) => (
									<tr className="text-center" key={index}>
										<td>
											<p className="text-info">{(policy.agent[0] && policy.agent[0].first_name + policy.agent[0].last_name) || 'Self uploaded'}</p>
										</td>
										<td>{policy.type}</td>
										<td>{policy.number}</td>
										<td>{moment(policy.renewal_date, 'YYYY-MM-DD', true).isValid() ? moment(policy.renewal_date).format('MM/DD/YYYY') : moment().format('MM/DD/YYYY')}</td>
										<td>
											<span className="badge badge-success">{policy.status}</span>
										</td>
									</tr>
								))}
								{userPolicies.length === 0 &&
									<tr className="text-center">
										<td>&nbsp;</td>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
									</tr>
								}
							</tbody>
						</table>
					</div>
				}
			</div>
		);
	}
}

Proposal.propTypes = {
	data: PropTypes.object,
	jobInProgress: PropTypes.bool,
	updateBidStatus: PropTypes.func,
};

Proposal.defaultProps = {
	data: {},
	jobInProgress: false,
	updateBidStatus: () => {},
}

export default Proposal;
