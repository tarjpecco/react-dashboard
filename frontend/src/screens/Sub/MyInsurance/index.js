import React from 'react';
import Table from '../../../components/Table';

import './index.scss';

const MyInsurance = () => {
	return (
		<div id="main">
			<div className="bg-body-light">
				<div className="content content-full">
					<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
						<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
							Sub My Insurance
						</h1>
						<button type="button" className="btn btn-success">
							+ Add New Policy
						</button>
						<button type="button" className="btn btn-dark">
							Send My COI
						</button>
					</div>
				</div>
			</div>
			<div className="content">
				<Table>
					<thead>
						<tr>
							<th className="text-center table-width-20">Agent/Broker name</th>
							<th className="text-center table-width-15">Policy type</th>
							<th className="text-center table-width-15">Policy number</th>
							<th className="text-center table-width-20">Renewal Date</th>
							<th className="text-center table-width-15">Status</th>
							<th className="text-center table-width-25" />
						</tr>
					</thead>
					<tbody>
						<tr className="text-center">
							<td>
								<p className="text-info">Agent 123</p>
							</td>
							<td>GL</td>
							<td>12345678</td>
							<td>12/12/2019</td>
							<td>
								<span className="badge badge-success">Active</span>
							</td>
							<td>
								<button type="button" className="btn btn-primary">
									View or Edit{' '}
								</button>
							</td>
						</tr>
						<tr className="text-center">
							<td>
								<p className="text-info">Broker 234</p>
							</td>
							<td>WC</td>
							<td>134567824</td>
							<td>1/1/2018</td>
							<td>
								<span className="badge badge-danger">Expired</span>
							</td>
							<td>
								<button type="button" className="btn btn-primary">
									View or Edit{' '}
								</button>
							</td>
						</tr>
					</tbody>
				</Table>
			</div>
		</div>
	);
};
export default MyInsurance;
