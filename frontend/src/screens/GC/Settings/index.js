import React from 'react';
import Table from '../../../components/Table';

import './index.scss';

const Settings = () => {
	return (
		<div id="main">
			<div className="bg-body-light">
				<div className="content content-full">
					<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
						<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
							GC Profile and Settings
						</h1>
					</div>
				</div>
			</div>
			<div className="content">
				<Table
					tableName="ABC Construction Company, Inc."
					tableStyle="table-striped table-bordered"
				>
					<tbody>
						<tr className="text-center">
							<td style={{ width: '20%' }}>
								<p className="text-info">Contact name</p>
							</td>
							<td style={{ width: '80%' }} colSpan="2">
								Name Surname
							</td>
						</tr>
						<tr className="text-center">
							<td style={{ width: '20%' }}>
								<p className="text-info">Address</p>
							</td>
							<td style={{ width: '80%' }} colSpan="2">
								123 Main Street NY, NY 10001
							</td>
						</tr>
						<tr className="text-center">
							<td style={{ width: '20%' }}>
								<p className="text-info">Phone</p>
							</td>
							<td style={{ width: '80%' }} colSpan="2">
								555-555-5555
							</td>
						</tr>
						<tr className="text-center">
							<td style={{ width: '20%' }}>
								<p className="text-info">EIN #</p>
							</td>
							<td style={{ width: '80%' }} colSpan="2">
								61-512584
							</td>
						</tr>
						<tr className="text-center">
							<td>
								<p className="text-info">License number</p>
							</td>
							<td style={{ width: '20%' }}>GC-123456789</td>
							<td style={{ width: '80%' }}>Exp:1/23/19</td>
						</tr>
						<tr className="text-center">
							<td />
							<td style={{ width: '20%' }}>Plumbing - 123456789</td>
							<td style={{ width: '80%' }}>Exp:1/23/19</td>
						</tr>
						<tr className="text-center">
							<td />
							<td style={{ width: '20%' }}>Electrical - 123456789</td>
							<td style={{ width: '80%' }}>Exp:1/23/19</td>
						</tr>
						<tr className="text-center">
							<td>
								<p className="text-info">Password</p>
							</td>
							<td colSpan="2">
								<button type="button" className="btn btn-primary">
									Reset here
								</button>
							</td>
						</tr>
					</tbody>
				</Table>
			</div>
		</div>
	);
};
export default Settings;
