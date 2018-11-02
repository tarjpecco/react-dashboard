import React from 'react';
import Table from '../../../components/Table';

import './index.scss';

const Dashboard = () => {
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
									<p className="text-white font-size-h3 font-w300 mb-0">25</p>
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
									<p className="text-white font-size-h3 font-w300 mb-0">14</p>
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
							<th className="table-width-15">Age</th>
							<th className="table-width-15">Status</th>
							<th />
						</tr>
					</thead>
					<tbody>
						<tr className="text-left">
							<td>
								<p className="text-info">Roofing</p>
							</td>
							<td>GL</td>
							<td>Limits</td>
							<td>1 day</td>
							<td>
								<span className="badge badge-primary">New</span>
							</td>
							<td className="text-right">
								<button type="button" className="btn btn-primary">
									GO
								</button>
							</td>
						</tr>
						<tr className="text-left">
							<td>
								<p className="text-info">Electric</p>
							</td>
							<td>W/C</td>
							<td>Exclusions</td>
							<td>5 days</td>
							<td>
								<span className="badge badge-success">Complete</span>
							</td>
							<td className="text-right">
								<button type="button" className="btn btn-primary">
									GO
								</button>
							</td>
						</tr>
						<tr className="text-left">
							<td>
								<p className="text-info">Plumbing</p>
							</td>
							<td>GL</td>
							<td>Exclusions</td>
							<td>3 days</td>
							<td>
								<span className="badge badge-warning">Submitted</span>
							</td>
							<td className="text-right">
								<button type="button" className="btn btn-primary">
									GO
								</button>
							</td>
						</tr>
						<tr className="text-left">
							<td>
								<p className="text-info">Exterior</p>
							</td>
							<td>Auto</td>
							<td>Limits</td>
							<td>2 days</td>
							<td>
								<span className="badge badge-primary">New</span>
							</td>
							<td className="text-right">
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
export default Dashboard;
