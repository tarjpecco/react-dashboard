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
				<Table>
					<thead>
						<tr>
							<th className="text-center" style={{ width: '20%' }}>
								Project name
							</th>
							<th className="text-center" style={{ width: '20%' }}>
								Project address
							</th>
							<th className="text-center" style={{ width: '10%' }}>
								Active subs
							</th>
							<th className="text-center" style={{ width: '20%' }}>
								Compilance risks
							</th>
							<th className="text-center" style={{ width: '15%' }}>
								Status
							</th>
							<th className="text-center" style={{ width: '25%' }} />
						</tr>
					</thead>
					<tbody>
						<tr className="text-center">
							<td>
								<p className="text-info">Main Street</p>
							</td>
							<td>123 Main Street</td>
							<td>17</td>
							<td>
								<p className="text-danger">3</p>
							</td>
							<td>
								<span className="badge badge-warning">In progress</span>
							</td>
							<td>
								<button type="button" className="btn btn-outline-dark">
									GO
								</button>
							</td>
						</tr>
						<tr className="text-center">
							<td>
								<p className="text-info">James Street</p>
							</td>
							<td>145 James Street Unit 1</td>
							<td>12</td>
							<td>
								<p className="text-success">0</p>
							</td>
							<td>
								<span className="badge badge-success">Completed</span>
							</td>
							<td>
								<button type="button" className="btn btn-outline-dark">
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
