import React from 'react';
import Table from '../../components/Table';

const Billing = () => {
	return (
		<div id="main">
			<div className="bg-body-light">
				<div className="content content-full">
					<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
						<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
							GC Billing
						</h1>
					</div>
				</div>
			</div>

			<div className="content">
				<div className="row">
					<div className="col-md-6 col-xl-6">
						<a className="block block-rounded block-link-shadow  bg-gd-dusk">
							<div className="block-content block-content-full d-flex align-items-center justify-content-between">
								<div>
									<p className="text-white"> Card</p>
								</div>
								<div className="ml-3 text-right">
									<p className="text-white font-size-h3 font-w300 mb-0">14</p>
									<p className="text-white-75 mb-0">Active subs</p>
								</div>
							</div>
						</a>
					</div>
					<div className="col-md-6 col-xl-6">
						<Table tableName="Billing history">
							<thead>
								<th className="text-center" style={{ width: '20%' }}>
									Date
								</th>
								<th className="text-center" style={{ width: '20%' }}>
									Amount
								</th>
							</thead>
							<tbody>
								<tr>
									<td className="text-center">9/30/2018</td>
									<td className="text-center">$1503.25</td>
								</tr>
								<tr>
									<td className="text-center">8/31/2018</td>
									<td className="text-center">$2589.00</td>
								</tr>
								<tr>
									<td className="text-center">7/31/2018</td>
									<td className="text-center">$2233.00</td>
								</tr>
								<tr className="text-center">
									<button type="button" className="btn btn-primary">
										Download invoices
									</button>
								</tr>
							</tbody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Billing;
