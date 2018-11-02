import React from 'react';
import Table from '../../../components/Table';

const Dashboard = () => {
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
						<tr>
							<td className="font-w600 text-center">
								<p className="text-info">Main Street</p>
							</td>
							<td className="font-w600 text-center">
								<p className="text-info">123 Main Street NY, NY</p>
							</td>
							<td className="font-w600 text-center">
								<p className="text-info">Quote Submitted</p>
							</td>
							<td className="font-w600 text-center">
								<button type="button" className="btn btn-primary">
									View
								</button>
							</td>
						</tr>
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
						<tr>
							<td className="font-w600 text-center">
								<p className="text-info">Main Street</p>
							</td>
							<td className="font-w600 text-center">
								<p className="text-info">123 Main Street NY, NY</p>
							</td>
							<td className="font-w600 text-center">
								<p className="text-info">NEW-Respond by 11/1/2018</p>
							</td>
							<td className="font-w600 text-center">
								<button type="button" className="btn btn-primary">
									Submit Quote
								</button>
							</td>
						</tr>
					</tbody>
				</Table>
			</div>
		</div>
	);
};
export default Dashboard;
