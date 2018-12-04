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
	getRFQJobsSelector,
} from '../../../redux/ducks/jobs';
import './index.scss';

class SubmitQuote extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		listRFQJobs: PropTypes.func.isRequired,
		rfqJobList: PropTypes.array.isRequired,
		createBidInfo: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);
		this.projectId = props.match.params.id;
		this.state = {
			bid: {},
		};
	}

	componentDidMount() {
		const { listRFQJobs } = this.props;
		listRFQJobs();
	}

	submitBid = () => {
		const { bid } = this.state;
		const { createBidInfo } = this.props;
		const { rfqJobList } = this.props;
		const job = rfqJobList[0];
		console.log('job:', job);
		const params = {
			bid: bid.bid,
			sub: job.user.url,
			job: job.url,
		};
		createBidInfo({ params });
	}

	onBidEditHandler = (prop, value) => {
		const { bid } =  this.state;
		const newbid = cloneDeep(bid);
		newbid[prop] = value;
		this.setState({ bid: newbid });
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
		}
		return project;
	}

	render() {
		const { bid } = this.state;
		const { rfqJobList } = this.props;
		const projectInfo = this.getProjectInfo(rfqJobList);
		const job = rfqJobList[0];
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
										value={this.getAddressStr(projectInfo.address)}
									/>
								</td>
							</tr>
						</tbody>
					</Table>
				</div>
				<div className="content settings">
					<React.Fragment>
						<div className="wrap align-items-start">
							<div style={{ flex: 1 }}>
								<Table
									tableName="Job Info"
									onComapnyNameChanged={value => this.onUpdateCompanyDetails('name', value)}
									tableStyle="table-striped table-bordered flex-fill"
								>
									<tbody>
										<tr className="text-left">
											<td className="table-width-30">
												<p className="text-info">Trade Type</p>
											</td>
											<td className="table-width-70" colSpan="4">
												<div>{job && job.trade_type}</div>
											</td>
										</tr>
										<tr className="text-left">
											<td className="table-width-30">
												<p className="text-info">Expected Start Date</p>
											</td>
											<td className="table-width-70" colSpan="4">
												<div>{moment(job && job.expected_start_date, 'YYYY-MM-DD', true).isValid() ? moment(job && job.expected_start_date).format('MM/DD/YYYY') : ''}</div>
											</td>
										</tr>
										<tr className="text-left">
											<td className="table-width-30">
												<p className="text-info">Expected End Date</p>
											</td>
											<td className="table-width-70" colSpan="4">
												<div>{moment(job && job.expected_end_date, 'YYYY-MM-DD', true).isValid() ? moment(job && job.expected_end_date).format('MM/DD/YYYY') : ''}</div>
											</td>
										</tr>
										<tr className="text-left">
											<td className="table-width-30">
												<p className="text-info">Estimated Completion Date</p>
											</td>
											<td className="table-width-70" colSpan="4">
												<div>{moment(job && job.estimated_end_date, 'YYYY-MM-DD', true).isValid() ? moment(job && job.estimated_end_date).format('MM/DD/YYYY') : ''}</div>
											</td>
										</tr>
										<tr className="text-left">
											<td className="table-width-30">
												<p className="text-info">Start Date</p>
											</td>
											<td className="table-width-70" colSpan="4">
												<div>{moment(job && job.start_date, 'YYYY-MM-DD', true).isValid() ? moment(job && job.start_date).format('MM/DD/YYYY') : ''}</div>
											</td>
										</tr>
										<tr className="text-left">
											<td className="table-width-30">
												<p className="text-info">End Date</p>
											</td>
											<td className="table-width-70" colSpan="4">
												<div>{moment(job && job.end_date, 'YYYY-MM-DD', true).isValid() ? moment(job && job.end_date).format('MM/DD/YYYY') : ''}</div>
											</td>
										</tr>
									</tbody>
								</Table>
							</div>
							<div style={{ width: 400, marginLeft: 30 }}>
								<Table
									tableName="Bid Info"
									onComapnyNameChanged={value => this.onUpdateCompanyDetails('name', value)}
									tableStyle="table-striped table-bordered"
								>
									<tbody>
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
														value={bid && bid.bid || 0}
														onChange={e => this.onBidEditHandler('bid', e.target.value)}
													/>
													<div className="input-group-append">
														<span className="input-group-text">,00</span>
													</div>
												</div>
											
											</td>
										</tr>
									</tbody>
								</Table>
								<div className="input-group" style={{ justifyContent: 'flex-end', marginRight: 0 }}>
									<button
										type="button" className="btn btn-success"
										onClick={this.submitBid}
									>
										Submit Bid
									</button>
								</div>
							</div>
						</div>
					</React.Fragment>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	rfqJobList: getRFQJobsSelector(state),
});

const mapDispatchToProps = dispatch => ({
	createBidInfo: params => dispatch(bidActions.create_bid(params)),
	listRFQJobs: () => dispatch(jobActions.get_rfq_jobs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SubmitQuote);
