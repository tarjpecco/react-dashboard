import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import Table from '../../../components/Table';
import {
	actions as projectActions,
	getProjectsSelector
} from '../../../redux/ducks/projects';
import {
	actions as jobActions,
	getJobsSelector
} from '../../../redux/ducks/jobs';

const Dashboard = ({ projectList, listProjects, jobList, listJobs }) => {
	const getAddressStr = (address) => {
		const { line_1: line1, line_2: line2, town, state, zip_code:zipCode } = address;
		return `${line1} ${line2} ${town}, ${state} ${zipCode}`;
	};
	if (isEmpty(projectList)) {
		listProjects();
	}
	if (isEmpty(jobList)) {
		listJobs();
	}

	return (
		<div id="main">
			<div className="bg-body-light">
				<div className="content content-full">
					<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
						<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
							Sub Dashboard
						</h1>
						<button type="button" className="btn btn-primary">
							1 New Task
						</button>
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
						{projectList.map((project, index) => (
							<tr key={index}>
								<td className="font-w600 text-center">
									<p className="text-info">{project.name}</p>
								</td>
								<td className="font-w600 text-center">
									<p className="text-info">{getAddressStr(project.address)}</p>
								</td>
								<td className="font-w600 text-center">
									<p className="text-info">{project.status}</p>
								</td>
								<td className="font-w600 text-center">
									<button type="button" className="btn btn-primary">
										View
									</button>
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
									<p className="text-info">Main Street</p>
								</td>
								<td className="font-w600 text-center">
									<p className="text-info">123 Main Street NY, NY</p>
								</td>
								<td className="font-w600 text-center">
									<p className="text-info">{job.status}</p>
								</td>
								<td className="font-w600 text-center">
									<button type="button" className="btn btn-primary">
										Submit Quote
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		</div>
	);
};


const mapStateToProps = state => ({
	projectList: getProjectsSelector(state),
	jobList: getJobsSelector(state)
});

const mapDispatchToProps = dispatch => ({
	listProjects: () => dispatch(projectActions.get_projects()),
	listJobs: () => dispatch(jobActions.get_jobs({ status: 'rfq' })),
})

Dashboard.propTypes = {
	projectList: PropTypes.array.isRequired,
	jobList: PropTypes.array.isRequired,
	listProjects: PropTypes.func.isRequired,
	listJobs: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
