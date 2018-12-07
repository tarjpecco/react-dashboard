import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { cloneDeep, isUndefined } from 'lodash';
import * as moment from 'moment';

import Table from '../../../components/Table';
import {
	actions as bidActions,
	getBidErrorSelector,
	getBidSuccessSelector,
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
		error: PropTypes.string.isRequired,
		success: PropTypes.bool.isRequired,
		history: PropTypes.object.isRequired,
		reset: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);
		this.projectId = props.match.params.id;
		this.state = {
			bids: [],
			formData: new FormData(),
			showError: true,
			inValid: {},
		};
	}

	componentDidMount() {
		const { listRFQJobs } = this.props;
		listRFQJobs({ id: this.projectId });
		const inValid = { bids: new Array(listRFQJobs.length).fill(false) };
		this.setState({ inValid });
	}

	submitBid = (index) => {
		const { bids, formData } = this.state;
		const { createBidInfo, rfqJobList } = this.props;
		const job = rfqJobList[index];
		if (isUndefined(bids[index] && bids[index].bid) || (bids[index] && bids[index].bid === 0)) {
			const inValidBids = cloneDeep(bids);
			inValidBids[index] = true;
			const inValid = { bids: inValidBids };
			this.setState({ inValid });
			return;
		}
		if (this.proposalFile.files.length === 0 || formData.get('proposal_file') === null) {
			// eslint-disable-next-line no-alert
			window.alert('Proposal File is Required!');
			return;
		}
		formData.append('sub', job.user.url);
		formData.append('job', job.url);
		formData.append('status', 'reviewing_compliance');
		formData.append('bid', bids[index].bid);
		createBidInfo(formData);
		this.setState({ showError: true, formData: new FormData(), bids: {} });
	}

	onFileChange = (fileType) => {
		const  { formData } = this.state;
		if (fileType === 'proposal') {
			formData.append('proposal_file', this.proposalFile.files[0]);
		}
		this.setState({ formData });
	}

	onBidEditHandler = (index, e) => {
		const prop = e.target.name;
		const value = e.target.value;
		const { bids } =  this.state;
		const newbids = cloneDeep(bids);
		const reg = /^\d+$/;
		if (value === '' || reg.test(value)) {
			newbids[index] = {};
			newbids[index][prop] = value;
			this.setState({ bids: newbids });
		}
	}

	getComplianceClassName = status => {
		if (status === 'ok') return 'badge-success';
		if (status === 'warning') return 'badge-warning';
		return 'badge-danger';
	}

	getAddressStr = address => {
      return `${address.line_1 || ''} ${address.line_2 || ''} ${address.town || ''}, ${address.state || ''} ${address.zip_code || ''}`;
    }

	getProjectInfo = jobList => {
		const jobs = cloneDeep(jobList);
		let project = {
			name: '',
			status: '',
			address: {},
		};
		if (jobs.length > 0) {
			const job = jobs[0];
			project = job.project;
		}
		return project;
	}

	render() {
		const { bids, showError, inValid } = this.state;
		const { rfqJobList, error, success, history, reset } = this.props;
		if (success) {
			reset();
			setTimeout(() => history.push('/dashboard'), 500);
		}
        const projectInfo = this.getProjectInfo(rfqJobList);
        const jobs = (rfqJobList || []).filter(j => !j.sub_bid.id)
		return (
			<div id="main">
				{error && showError &&
					<div className="alert alert-danger alert-dismissable animated bounceInRight alert-error-box" role="alert">
						<button type="button" className="close" aria-label="Close" onClick={() => this.setState({ showError: false })}>
							<span>×</span>
						</button>
						<p className="mb-0">{error}</p>
					</div>
				}
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
					{ jobs.map((job, index) =>
						<React.Fragment key={index}>
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
															className={`form-control text-center ${inValid.bids && inValid.bids[index] ? 'is-invalid' : ''}`}
															id="price_form_input"
															name="bid"
															placeholder="0"
															value={(bids[index] && bids[index].bid) || 0}
															onChange={e => this.onBidEditHandler(index, e)}
														/>
														<div className="input-group-append">
															<span className="input-group-text">,00</span>
														</div>
													</div>
													{inValid.bids && inValid.bids[index] &&
														<div className="invalid-feedback animated fadeIn d-block" >Required</div>
													}
												</td>
											</tr>
											<tr className="text-left">
												<td className="table-width-20">
													<p className="text-info">Proposal</p>
												</td>
												<td className="table-width-80" colSpan="4">
													<div>
														<input
															type="file"
															name="proposal_file"
															ref={(ref) => { this.proposalFile = ref; }}
															onChange={() => this.onFileChange('proposal')}
															style={{ display: 'none' }}
														/>
														<button
															type="button"
															className="btn btn-success"
															onClick={() => this.proposalFile && this.proposalFile.click()}
														>
															Upload Proposal
														</button>
													</div>
												</td>
											</tr>
										</tbody>
									</Table>
									<div className="input-group" style={{ justifyContent: 'flex-end', marginRight: 0 }}>
										<button
											type="button" className="btn btn-primary"
											onClick={() => this.submitBid(index)}
										>
											Submit Bid
										</button>
									</div>
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
	rfqJobList: getRFQJobsSelector(state),
	error: getBidErrorSelector(state),
	success: getBidSuccessSelector(state),
});

const mapDispatchToProps = dispatch => ({
	createBidInfo: params => dispatch(bidActions.create_bid(params)),
	listRFQJobs: params => dispatch(jobActions.get_rfq_jobs(params)),
	reset: () => dispatch(bidActions.reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SubmitQuote);
