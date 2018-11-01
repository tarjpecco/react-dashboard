import React from 'react';
import Table from '../../../components/Table';

import './index.scss';

const Projects = () => {
	return (
		<div id="main">
			<div className="bg-body-light">
				<div className="content content-full">
					<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
						<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
							GC Projects
						</h1>
					</div>
				</div>
			</div>
			<div className="content">
				<Table tableName="" tableStyle="" editable="disable">
					<thead className="thead-light">
						<tr className="text-left">
							<th className="table-width-25">Project name</th>
							<th className="table-width-25">Project address</th>
							<th className="table-width-15">Active subs</th>
							<th className="table-width-15">Compliance risks</th>
							<th className="table-width-15">Status</th>
							<th />
						</tr>
					</thead>
					<tbody>
						<tr className="text-left">
							<td>
								<p className="text-info">Main Street</p>
							</td>
							<td>123 Main Street</td>
							<td>17</td>
							<td>
								<p className="badge badge-pill badge-danger">3</p>
							</td>
							<td>
								<span className="badge badge-warning">In progress</span>
							</td>
							<td>
								<button type="button" className="btn btn-primary">
									GO
								</button>
							</td>
						</tr>
						<tr className="text-left">
							<td>
								<p className="text-info">James Street</p>
							</td>
							<td>145 James Street Unit 1</td>
							<td>12</td>
							<td>
								<p className="badge badge-pill badge-success">0</p>
							</td>
							<td>
								<span className="badge badge-success">Completed</span>
							</td>
							<td>
								<button type="button" className="btn btn-primary">
									GO
								</button>
							</td>
						</tr>
					</tbody>
				</Table>
			</div>
		</div>
	);
};
export default Projects;
