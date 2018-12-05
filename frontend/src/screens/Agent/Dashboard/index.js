import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isNull } from 'lodash';
import { Link } from 'react-router-dom';

import Table from '../../../components/Table';
import {
	actions as companiesActions,
	getCompaniesSelector
} from '../../../redux/ducks/companies';
import {
	actions as policiesAction,
	getPoliciesSelector
} from '../../../redux/ducks/policies';
import { getIdFromUrl } from '../../../utils';
import './index.scss';

class Dashboard extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
		};
		const { listPolicies, listCompanies } = props;
		listPolicies({ status: 'requires_modification' });
		listCompanies({ search: '' });
	}

	getComplianceClassName = status => {
		if (status === 'ok') return 'badge-success';
		if (status === 'requires_modification') return 'badge-warning';
		return 'badge-primary';
	}

	render() {
		const { companyList, policies } = this.props;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								Agent Dashboard
							</h1>
						</div>
					</div>
				</div>

				<div className="content">
					<div className="row">
						<div className="col-md-6 col-xl-6">
							{/* eslint-disable-next-line */}
							<a className="block block-rounded block-link-shadow bg-gd-sea">
								<div className="block-content block-content-full d-flex align-items-center justify-content-between">
									<div>
										<i className="far fa-2x fa-user text-primary-lighter" />
									</div>
									<div className="ml-3 text-right">
										<p className="text-white font-size-h3 font-w300 mb-0">{companyList.length}</p>
										<p className="text-white-75 mb-0">Clients</p>
									</div>
								</div>
							</a>
						</div>
						<div className="col-md-6 col-xl-6">
							{/* eslint-disable-next-line */}
							<a className="block block-rounded block-link-shadow  bg-gd-dusk">
								<div className="block-content block-content-full d-flex align-items-center justify-content-between">
									<div>
										<i className="far fa-2x fa-check-circle text-white-50" />
									</div>
									<div className="ml-3 text-right">
										<p className="text-white font-size-h3 font-w300 mb-0">{policies.length}</p>
										<p className="text-white-75 mb-0">Tasks</p>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
				<div className="content">
					<Table tableName="To Do" tableStyle="" editable="disable">
						<thead className="thead-light">
							<tr className="text-left">
								<th className="table-width-25">Company</th>
								<th className="table-width-25">Policy type</th>
								<th className="table-width-15">Request type</th>
								<th className="table-width-15">Status</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{policies && policies.map((policy, index) =>
								<tr className="text-left" key={index}>
									<td>
										<p className="text-info">{policy.company_name || ''}</p>
									</td>
									<td>{policy.type}</td>
									<td>{isNull(policy.file) ? 'New' : 'Require Update'}</td>
									<td>
										<span className={`badge ${this.getComplianceClassName(policy.status)}`}>{policy.status}</span>
									</td>
									<td className="text-right">
										<Link to={`/insurance/${getIdFromUrl(policy.url)}`}>
											<button type="button" className="btn btn-primary">
												Go
											</button>
										</Link>
									</td>
								</tr>
							)}
						</tbody>
					</Table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	companyList: getCompaniesSelector(state),
	policies: getPoliciesSelector(state),
});

const mapDispatchToProps = dispatch => ({
	getCompanyInfo: params => dispatch(companiesActions.get_company(params)),
	listPolicies: params => dispatch(policiesAction.get_policies(params)),
	listCompanies: params => dispatch(companiesActions.get_companies(params)),

})

Dashboard.propTypes = {
	policies: PropTypes.array.isRequired,
	listPolicies: PropTypes.func.isRequired,
	companyList: PropTypes.array.isRequired,
	listCompanies: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
