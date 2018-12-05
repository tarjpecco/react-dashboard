import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';

import Table from '../../../components/Table';
import {
	actions as bidActions,
} from '../../../redux/ducks/bids';
import {
	actions as jobActions,
	getProgressJobsSelector,
} from '../../../redux/ducks/jobs';
import './index.scss';
import { getBid } from '../../../api';
import { getIdFromUrl, numberWithCommas } from '../../../utils';

class Detail extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		listProgressJobs: PropTypes.func.isRequired,
		progressJobList: PropTypes.array.isRequired,
		updateBidInfo: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);
		this.projectId = props.match.params.id;
		this.state = {
			editable: 'disable',
			btnname: 'Edit',
			btnicon: 'si si-pencil',
			bids: [],
		};
	}

	componentDidMount() {
		const { listProgressJobs } = this.props;
		listProgressJobs({ id: this.projectId });
	}

	componentWillReceiveProps(nextProps) {
		const { progressJobList } = nextProps;
		if (progressJobList.length > 0) {
			this.getBidList(progressJobList);
		}
	}

	getBidList = (progressJobList) => {
		const bids = [];
		progressJobList.forEach((job, index) => getBid(getIdFromUrl(job.active_bid))
			.then(res => {
				bids[index] = res;
				if (bids.length === progressJobList.length) {
					this.setState({ bids })
				}
			})
		);
	}

	handleClickEdit = (index) => {
		const { editable, bids } = this.state;
		if (editable === 'disable') {
			this.setState({ editable: '' });
			this.setState({ btnname: 'Save' });
			this.setState({ btnicon: 'far fa-save' });
		} else {
			this.setState({ editable: 'disable' });
			this.setState({ btnname: 'Edit' });
			this.setState({ btnicon: 'si si-pencil' });
			const { updateBidInfo } = this.props;
			const bidId = getIdFromUrl(bids[index].url);
			const params = {
				bid: bids[index].bid,
			}
			updateBidInfo({ id: bidId, params });
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
	`${address.line_1 || ''} ${address.line_2 || ''} ${address.town || ''}, ${address.state || ''} ${address.zip_code || ''}`;
	
	getProjectInfo = jobList => {
		const jobs = cloneDeep(jobList);
		let project = {
			name: '',
			status: '',
			address: {},
		};
		if (jobs.length > 0) {
			const job = jobs.pop();
			project = job.project;
			project.company_name = job.project_company_name;
		}
		return project;
	}

	changeBidStatus = (index, status) => {
		const { updateBidInfo } = this.props;
		const { bids } = this.state;
		const bidId = getIdFromUrl(bids[index].url);
		const params = {
			status,
		};
		updateBidInfo({ id: bidId, params});
	}

	render() {
		const { editable, btnname, btnicon, bids } = this.state;
		const { progressJobList } = this.props;
		const projectInfo = this.getProjectInfo(progressJobList);
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
									<p>{this.getAddressStr(projectInfo.address)}</p>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Company</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<p>{projectInfo.company_name}</p>
								</td>
							</tr>
						</tbody>
					</Table>
				</div>
				<div className="content settings">
					{progressJobList && progressJobList.map((job, index) =>
						<React.Fragment key={index}>
							<div className="table-tool">
								{(projectInfo && projectInfo.status !== 'in_progress') &&
									<button
										type="button"
										className="btn btn-sm btn-hero-dark mr-1 mb-3"
										onClick={() => this.handleClickEdit(index)}
									>
										<i className={btnicon} /> {btnname}
									</button>
								}
							</div>
							<div className="wrap align-items-start">
								<div style={{ flex: 1 }}>
									<Table
										tableName="Job Info"
										onComapnyNameChanged={value => this.onUpdateCompanyDetails('name', value)}
										tableStyle="table-striped table-bordered flex-fill"
									>
										<tbody key={index}>
											<tr className="text-left">
												<td className="table-width-30">
													<p className="text-info">Trade Type</p>
												</td>
												<td className="table-width-70" colSpan="4">
													<div>{job.trade_type}</div>
												</td>
											</tr>
											<tr className="text-left">
												<td className="table-width-30">
													<p className="text-info">Expected Start Date</p>
												</td>
												<td className="table-width-70" colSpan="4">
													<div>{moment(job.expected_start_date, 'YYYY-MM-DD', true).isValid() ? moment(job.expected_start_date).format('MM/DD/YYYY') : ''}</div>
												</td>
											</tr>
											<tr className="text-left">
												<td className="table-width-30">
													<p className="text-info">Expected End Date</p>
												</td>
												<td className="table-width-70" colSpan="4">
													<div>{moment(job.expected_end_date, 'YYYY-MM-DD', true).isValid() ? moment(job.expected_end_date).format('MM/DD/YYYY') : ''}</div>
												</td>
											</tr>
											<tr className="text-left">
												<td className="table-width-30">
													<p className="text-info">Estimated Completion Date</p>
												</td>
												<td className="table-width-70" colSpan="4">
													<div>{moment(job.estimated_end_date, 'YYYY-MM-DD', true).isValid() ? moment(job.estimated_end_date).format('MM/DD/YYYY') : ''}</div>
												</td>
											</tr>
											<tr className="text-left">
												<td className="table-width-30">
													<p className="text-info">Start Date</p>
												</td>
												<td className="table-width-70" colSpan="4">
													<div>{moment(job.start_date, 'YYYY-MM-DD', true).isValid() ? moment(job.start_date).format('MM/DD/YYYY') : ''}</div>
												</td>
											</tr>
											<tr className="text-left">
												<td className="table-width-30">
													<p className="text-info">End Date</p>
												</td>
												<td className="table-width-70" colSpan="4">
													<div>{moment(job.end_date, 'YYYY-MM-DD', true).isValid() ? moment(job.end_date).format('MM/DD/YYYY') : ''}</div>
												</td>
											</tr>
											<tr className="text-left">
												<td className="table-width-30">
													<p className="text-info">RFQ Document</p>
												</td>
												<td className="table-width-70" colSpan="4">
													<a
														target="_blank"
														rel="noopener noreferrer"
														href={job && job.file}
														className="btn btn-primary"
													> Download RFQ</a>
												</td>
											</tr>
										</tbody>
									</Table>
								</div>
								<div style={{ width: 550, marginLeft: 30 }}>
									<Table
										tableName="Bid Info"
										onComapnyNameChanged={value => this.onUpdateCompanyDetails('name', value)}
										tableStyle="table-striped table-bordered"
									>
										<tbody key={index}>
											<tr className="text-left">
												<td className="table-width-40">
													<p className="text-info">Bid Price</p>
												</td>
												<td className="table-width-60" colSpan="4">
													<div className="input-group" style={{ maxWidth: 300 }}>
														<div className="input-group-prepend">
															<span className="input-group-text">$</span>
														</div>
														<input
															type="text"
															className="form-control text-center"
															id="example-group1-input3"
															style={{ border: 'solid 1px #cecacaee' }}
															name="bid"
															placeholder="00"
															value={bids[index] && (editable === 'editable' ? bids[index].bid : numberWithCommas(bids[index].bid)) || 0}
															disabled={editable}
															onChange={e => this.onBidEditHandler(index, 'bid', e.target.value)}
														/>
														<div className="input-group-append">
															<span className="input-group-text">,00</span>
														</div>
													</div>
												</td>
											</tr>
											<tr className="text-left">
												<td className="table-width-40">
													<p className="text-info">Compliance Status</p>
												</td>
												<td className="table-width-60" colSpan="4">
													<div style={{ display: 'flex', flexDirection: 'row' }}>
														<span className={`badge ${this.getComplianceClassName(bids[index] && bids[index].compliance_GL)}`}>GL</span>&nbsp;
														<span className={`badge ${this.getComplianceClassName(bids[index] && bids[index].compliance_WC)}`}>WC</span>&nbsp;
														<span className={`badge ${this.getComplianceClassName(bids[index] && bids[index].compliance_DB)}`}>DB</span>&nbsp;
													</div>
												</td>
											</tr>
											<tr className="text-left">
												<td className="table-width-30">
													<p className="text-info">Proposal</p>
												</td>
												<td className="table-width-70" colSpan="4">
													<a
														target="_blank"
														rel="noopener noreferrer"
														href={bids[index] && bids[index].proposal_file}
														className="btn btn-primary"
													> Download</a>
												</td>
											</tr>
											{bids[index] && bids[index].status === 'contingent_accept' &&
												<React.Fragment>
													<tr className="text-left">
														<td className="table-width-40">
															<p className="text-info">Contingency Description</p>
														</td>
														<td className="table-width-60" colSpan="4">
															<p>{bids[index] && bids[index].contingency_description}</p>
														</td>
													</tr>
													<tr className="text-left">
														<td className="table-width-40">
															<p className="text-info">Policy Update</p>
														</td>
														<td className="table-width-60" colSpan="4">
															&nbsp;
														</td>
													</tr>
												</React.Fragment>
											}
										</tbody>
									</Table>
									{bids[index] && bids[index].status === 'contingent_accept' &&
										<div className="text-right">
											<button
												type="button"
												className="btn btn-primary"
												onClick={() => this.changeBidStatus(index, 'rejected_by_sub')}
												disabled={editable}
											>
												Reject
											</button>
											<button
												type="button"
												className="btn btn-primary"
												onClick={() => this.changeBidStatus(index, 'reviewing_compliance')}
												disabled={editable}
											>
												Verify Compliance Again
											</button>
											<button
												type="button"
												className="btn btn-primary"
												onClick={() => this.changeBidStatus(index, 'pending')}
												disabled={editable}
											>
												Proposal Updated
											</button>
										</div>
									}
								</div>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	progressJobList: getProgressJobsSelector(state),
});

const mapDispatchToProps = dispatch => ({
	updateBidInfo: params => dispatch(bidActions.update_bid(params)),
	listProgressJobs: params => dispatch(jobActions.get_progress_jobs(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
