import React from 'react';
import Table from '../../../components/Table';

import './index.scss';

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
						<a className="block block-rounded block-link-shadow  bg-gd-dusk card-content">
							<div className="block-content block-content-full d-flex align-items-center justify-content-between">
								<div>
									<p className="text-white"> Card</p>
								</div>
								<div className="ml-3 text-right">
									<button
										type="button"
										className="btn btn-sm btn-hero-dark mr-1 mb-3"
									>
										<i className="fa fa-pencil-alt" /> Edit Card
									</button>
								</div>
							</div>
							<div className="block-content block-content-full d-flex align-items-center justify-content-center">
								<h1 className="text-white">XXXX XXXX XXXX 1234</h1>
							</div>
							<div className="block-content block-content-full d-flex align-items-center justify-content-around">
								<span>Name Surname</span>
								<span className="text-white">Valid till 10/22</span>
							</div>
							<div className="block-content-full d-flex align-items-center justify-content-around card-white">
								<span className="caption">
									<i className="fa fa-balance-scale" />
									<div>Current balance</div>
									<div>$1234.00</div>
								</span>
								<span className="caption">
									<i className="fa fa-calculator" />
									<div>Next charge date</div>
									<div>10/31/2018</div>
								</span>
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
									<td colSpan="2">
										<button type="button" className="btn btn-primary">
											Download invoices
										</button>
									</td>
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
