import React from 'react';
import Table from '../../components/Table';

const Dashboard = () => {
	return (
		<div id="main">
			<div className="bg-body-light">
				<div className="content content-full">
					<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
						<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
							GC Dashboard
						</h1>
					</div>
				</div>
			</div>

			<div className="content">
				<div className="row">
					<div className="col-md-6 col-xl-3">
						<a className="block block-rounded block-link-shadow bg-gd-sea">
							<div className="block-content block-content-full d-flex align-items-center justify-content-between">
								<div>
									<i className="far fa-2x fa-user text-primary-lighter" />
								</div>
								<div className="ml-3 text-right">
									<p className="text-white font-size-h3 font-w300 mb-0">25</p>
									<p className="text-white-75 mb-0">Active projects</p>
								</div>
							</div>
						</a>
					</div>
					<div className="col-md-6 col-xl-3">
						<a className="block block-rounded block-link-shadow  bg-gd-dusk">
							<div className="block-content block-content-full d-flex align-items-center justify-content-between">
								<div>
									<i className="far fa-2x fa-check-circle text-white-50" />
								</div>
								<div className="ml-3 text-right">
									<p className="text-white font-size-h3 font-w300 mb-0">14</p>
									<p className="text-white-75 mb-0">Active subs</p>
								</div>
							</div>
						</a>
					</div>
					<div className="col-md-6 col-xl-3">
						<a className="block block-rounded block-link-shadow bg-gd-fruit">
							<div className="block-content block-content-full d-flex align-items-center justify-content-between">
								<div>
									<i className="fa fa-2x fa-chart-line text-white-50" />
								</div>
								<div className="ml-3 text-right">
									<p className="text-white font-size-h3 font-w300 mb-0">14</p>
									<p className="text-white-75 mb-0">Compliance Risks</p>
								</div>
							</div>
						</a>
					</div>
					<div className="col-md-6 col-xl-3" />
				</div>
			</div>
			<div className="content">
				<Table tableName="Tasks to be completed">
					<tbody>
						<tr>
							<th className="text-center" scope="row">
								1
							</th>
							<td className="font-w600">
								<p className="text-info">New Quote Received</p>
							</td>
							<td className="review">
								<button type="button" className="btn btn-primary">
									Review
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
