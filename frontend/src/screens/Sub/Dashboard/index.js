import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, groupBy, mapValues } from 'lodash';
import { Link } from 'react-router-dom';

import Table from '../../../components/Table';
import {
	actions as jobActions,
	getRFQJobsSelector,
	getProgressJobsSelector,
} from '../../../redux/ducks/jobs';
import { getIdFromUrl } from '../../../utils';

class Dashboard extends React.Component {
	componentDidMount () {
		const { rfqJobList, progressJobList, listRFQJobs, listProgressJobs } = this.props;
		if (isEmpty(rfqJobList)) {
			listRFQJobs();
		}
		if (isEmpty(progressJobList)) {
			listProgressJobs();
		}
	}

	getAddressStr = (address) => {
		const { line_1: line1, line_2: line2, town, state, zip_code:zipCode } = address;
		return `${line1} ${line2} ${town}, ${state} ${zipCode}`;
	}

	groupByProject = jobs => {
		const progressProjects = groupBy(jobs, 'project.url');
		const projectList = [];
		mapValues(progressProjects, value => {
			projectList.push(value[0]);
		});
		return projectList;
	}

	render() {
		const { rfqJobList, progressJobList } = this.props;
		const projectList = this.groupByProject(progressJobList);
		const jobList = this.groupByProject(rfqJobList);

		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								Sub Dashboard
							</h1>
						</div>
					</div>
				</div>
				<div className="content">
					<Table tableName="In Progress Projects" editable="disable">
						<thead className="thead-light">
							<tr>
								<th className="text-center table-width-20">Project Name</th>
								<th className="text-center table-width-20">Project Address</th>
								<th className="text-center table-width-30">Status</th>
								<th className="text-center table-width-30">View Project</th>
							</tr>
						</thead>
						<tbody>
							{projectList.map((progresjob, index) => (
								<tr key={index}>
									<td className="font-w600 text-center">
										<p className="text-info">{progresjob.project.name}</p>
									</td>
									<td className="font-w600 text-center">
										<p className="text-info">{this.getAddressStr(progresjob.project.address)}</p>
									</td>
									<td className="font-w600 text-center">
										<p className="text-info">{progresjob.project.status}</p>
									</td>
									<td className="font-w600 text-center">
										<Link to={`/projects/${getIdFromUrl(progresjob.project.url)}`}>
											<button type="button" className="btn btn-primary">
												View
											</button>
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Table tableName="New RFQ/P Received" editable="disable">
						<thead className="thead-light">
							<tr>
								<th className="text-center table-width-20">Project Name</th>
								<th className="text-center table-width-20">Project Address</th>
								<th className="text-center table-width-30">Status</th>
								<th className="text-center table-width-30">Respond</th>
							</tr>
						</thead>
						<tbody>
							{jobList.map((job, index) => (
								<tr key={index}>
									<td className="font-w600 text-center">
										<p className="text-info">{job.project.name}</p>
									</td>
									<td className="font-w600 text-center">
										<p className="text-info">{this.getAddressStr(job.project.address)}</p>
									</td>
									<td className="font-w600 text-center">
										<p className="text-info">{job.project.status}</p>
									</td>
									<td className="font-w600 text-center">
										<Link to={`/submitquote/${getIdFromUrl(job.project.url)}`}>
											<button type="button" className="btn btn-primary">
												Submit Quote
											</button>
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			</div>
		);
	}
};


const mapStateToProps = state => ({
	rfqJobList: getRFQJobsSelector(state),
	progressJobList: getProgressJobsSelector(state),
});

const mapDispatchToProps = dispatch => ({
	listRFQJobs: () => dispatch(jobActions.get_rfq_jobs()),
	listProgressJobs: () => dispatch(jobActions.get_progress_jobs()),
})

Dashboard.propTypes = {
	rfqJobList: PropTypes.array.isRequired,
	progressJobList: PropTypes.array.isRequired,
	listRFQJobs: PropTypes.func.isRequired,
	listProgressJobs: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
