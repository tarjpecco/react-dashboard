import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './index.scss';
import { getDataFromUrl, getUserLicensesForUser } from '../../api';
import { getIdFromUrl } from '../../utils';

class Proposal extends React.Component {
	state = {
		subUserInfo: {},
		address: {},
		userLicenses: [],
	};

	componentDidMount() {
		const { data } = this.props;
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
			.then(licenses => this.setState({ userLicenses: licenses }));
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
		const bidId = getIdFromUrl(data.url);
		updateBidStatus(bidId, status);
	}

	render() {
		const { subUserInfo, address, userLicenses } = this.state;
		const { data } = this.props;
		const classname = `table table-vcenter table-bordered`;

		return (
			<div className="block block-rounded block-bordered">
				{subUserInfo && (
					<div className="block-header block-header-default">
						<h3 className="block-title">{subUserInfo.company_name || ''}</h3>
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
								<td>
									<p>{subUserInfo.phone || ''}</p>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">
										EIN #
									</p>
								</td>
								<td>
									<p>{subUserInfo.ein || ''}</p>
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
						</tbody>
					</table>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'space-evenly',
						}}
					>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<p className="text-info">Bid price </p>
							<p>&nbsp;${data.bid} </p>
						</div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>

                          <a
                            type="button"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={data.COI_file}
                            className="btn btn-primary"
                          > Download COI</a>

                          <a
                            type="button"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={data.proposal_file}
                            className="btn btn-primary"
                          > Download Proposal</a>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<span className={`badge ${this.getComplianceClassName(data.compliance_GL)}`}>GL</span>&nbsp;
							<span className={`badge ${this.getComplianceClassName(data.compliance_WC)}`}>WC</span>&nbsp;
							<span className={`badge ${this.getComplianceClassName(data.compliance_DB)}`}>DB</span>&nbsp;
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }} hidden={data.status !== 'pending'}>
							<button type="button" className="btn btn-primary" onClick={() => this.changeBidStatus('accepted')}>
								Accept
							</button>
							<button type="button" className="btn btn-primary" onClick={() => this.changeBidStatus('declined')}>
								Decline
							</button>
							<button type="button" className="btn btn-primary" onClick={() => this.changeBidStatus('contingent_agent')}>
								Contigent accept
							</button>
						</div>
						<div hidden={data.status === 'pending'} style={{ height: 100 }} />
					</div>
				</div>
			</div>
		);
	}
}

Proposal.propTypes = {
	data: PropTypes.object,
	updateBidStatus: PropTypes.func.isRequired,
};

Proposal.defaultProps = {
	data: {},
}

export default Proposal;
