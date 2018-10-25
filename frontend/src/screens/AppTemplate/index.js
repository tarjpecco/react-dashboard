import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Route, Switch } from 'react-router-dom';
import GCDashboard from '../GC/Dashboard';
import MyInsurance from '../GC/MyInsurance';
import Team from '../GC/Team';
import SubDashboard from '../Sub/Dashboard';
import Projects from '../GC/Projects';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import GCBilling from '../GC/Billing';

const AppTemplate = ({ showSideBar }) => (
	<div
		id="page-container"
		className={classNames(
			'enable-page-overlay side-scroll page-header-fixed page-header-dark main-content-narrow side-trans-enabled',
			{ 'sidebar-o': showSideBar }
		)}
	>
		<Sidebar />

		<Header />
		<Switch>
			<Route exact path="/dashboard" component={GCDashboard} />
			<Route exact path="/billing" component={GCBilling} />
			<Route exact path="/insurance" component={MyInsurance} />
			<Route exact path="/projects" component={Projects} />
			<Route exact path="/team" component={Team} />
			<Route exact path="/subdashboard" component={SubDashboard} />
		</Switch>
	</div>
);

const mapStateToProps = state => ({
	showSideBar: state.global.showSideBar,
});

const { bool } = PropTypes;

AppTemplate.propTypes = {
	showSideBar: bool.isRequired,
};

export default connect(mapStateToProps)(AppTemplate);
