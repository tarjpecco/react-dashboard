import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { isEmpty, cloneDeep } from 'lodash';

import Modal from 'react-modal';
import Table from '../../../components/Table';
import {
	actions as projectActions, getProjectSelector,
} from '../../../redux/ducks/projects';
import {
	getBidsSelector,
	actions as bidActions,
} from '../../../redux/ducks/bids';
import {
	getCompanySelector,
	actions as companyActions,
} from '../../../redux/ducks/companies';
import { getIdFromUrl } from '../../../utils';
import './index.scss';


class Detail extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		listBids: PropTypes.func.isRequired,
		bidList: PropTypes.array.isRequired,
		getProjectInfo: PropTypes.func.isRequired,
		// updateBidInfo: PropTypes.func.isRequired,
		projectInfo: PropTypes.object.isRequired,
		companyInfo: PropTypes.object.isRequired,
	}

	constructor(props) {
		super(props);
		this.projectId = props.match.params.id;

		this.state = {
			editable: 'disable',
			btnname: 'Edit',
			btnicon: 'si si-pencil',
		};

		const { getProjectInfo } = props;
		getProjectInfo({ id: this.projectId });
	}

	componentDidMount() {
		Modal.setAppElement('body');
		const { listBids } = this.props;
		listBids({ job__project: this.projectId });
	}

	componentWillReceiveProps(newProps) {
		const { companyInfo, projectInfo, getCompanyInfo } = newProps;
		if (projectInfo.company && isEmpty(companyInfo)) {
			getCompanyInfo({ id: getIdFromUrl(projectInfo.company)});
		}
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
	}

	onBidEditHandler = (index, prop, value) => {
		const { bids } =  this.state;
		const newbids = cloneDeep(bids);
		newbids[index][prop] = value;
		this.setState({ bids: newbids });
	}

	getComplianceClassName = status => {
		if (status === 'ok') return 'badge-success';
		if (status === 'warning') return 'badge-warning';
		return 'badge-danger';
	}

	getAddressStr = address =>
	`${address.line_1} ${address.line_2 || ''} ${address.town}, ${address.state} ${address.zip_code}`;

	render() {
		const { editable, btnname, btnicon } = this.state;
		const { projectInfo, companyInfo, bidList } = this.props;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								{projectInfo.name}
							</h1>
						</div>
					</div>
				</div>
				<div className="content settings">
					<Table
						tableName="Project Info"
						onComapnyNameChanged={() => {}}
						tableStyle="table-striped table-bordered"
					>
						<tbody>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Status</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<span className="badge badge-warning">{projectInfo.status}</span>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Address</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										disabled
										value={companyInfo.address && this.getAddressStr(projectInfo.address)}
									/>
								</td>
							</tr>
						</tbody>
					</Table>
					<Table
						tableName="Company Info"
						onComapnyNameChanged={value => this.onUpdateCompanyDetails('name', value)}
						tableStyle="table-striped table-bordered"
					>
						<tbody>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Company name</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="name"
										value={companyInfo.name}
										disabled
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
										disabled
										value={companyInfo.address && this.getAddressStr(projectInfo.address)}
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
										name="email"
										value={companyInfo.phone}
										disabled
										style={{ textTransform: 'inherit' }}
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
										disabled
									/>
								</td>
							</tr>
						</tbody>
					</Table>
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
						tableName="Bid Info"
						onComapnyNameChanged={value => this.onUpdateCompanyDetails('name', value)}
						tableStyle="table-striped table-bordered"
					>
						{bidList.map((bid, index) =>
							<tbody key={index}>
								<tr className="text-left">
									<td className="table-width-20">
										<p className="text-info">Bid Price</p>
									</td>
									<td className="table-width-80" colSpan="4">
										<div className="input-group" style={{ maxWidth: 300 }}>
											<div className="input-group-prepend">
												<span className="input-group-text">$</span>
											</div>
											<input
												type="text"
												className="form-control text-center"
												id="example-group1-input3"
												style={{ border: 'solid 1px #cecacaee' }}
												name="price"
												placeholder="00"
												value={bid.price}
												disabled={editable}
												onChange={e => this.onBidEditHandler(index, 'price', e.target.value)}
											/>
											<div className="input-group-append">
												<span className="input-group-text">,00</span>
											</div>
										</div>
									</td>
								</tr>
								<tr className="text-left">
									<td className="table-width-20">
										<p className="text-info">Bid Status</p>
									</td>
									<td className="table-width-80" colSpan="4">
										<div style={{ display: 'flex', flexDirection: 'row' }}>
											<span className={`badge ${this.getComplianceClassName(bid.compliance_GL)}`}>GL</span>&nbsp;
											<span className={`badge ${this.getComplianceClassName(bid.compliance_WC)}`}>WC</span>&nbsp;
											<span className={`badge ${this.getComplianceClassName(bid.compliance_DB)}`}>DB</span>&nbsp;
										</div>
									</td>
								</tr>
							</tbody>
						)}
					</Table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	bidList: getBidsSelector(state),
	projectInfo: getProjectSelector(state),
	companyInfo: getCompanySelector(state),
});

const mapDispatchToProps = dispatch => ({
	getProjectInfo: params => dispatch(projectActions.get_project(params)),
	updateBidInfo: params => dispatch(bidActions.update_bid(params)),
	listBids: params => dispatch(bidActions.get_bids(params)),
	getCompanyInfo: params => dispatch(companyActions.get_company(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
