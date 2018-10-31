import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Route, Switch } from 'react-router-dom';
import GCDashboard from '../GC/Dashboard';
import MyInsurance from '../GC/MyInsurance';
import Settings from '../GC/Settings';
import GCBilling from '../GC/Billing';
import Projects from '../GC/Projects';
import Team from '../GC/Team';
import SubDashboard from '../Sub/Dashboard';
import SubInsurance from '../Sub/MyInsurance';
import SubSettings from '../Sub/Settings';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

import './index.scss';

const AppTemplate = ({ showSideBar, location }) => (
	<div
		id="page-container"
		className={classNames(
			'enable-page-overlay side-scroll page-header-fixed page-header-dark main-content-narrow side-trans-enabled',
			{ 'sidebar-o': showSideBar }
		)}
	>
		<Sidebar location={location} />

		<Header />
		<Switch>
			<Route exact path="/dashboard" component={GCDashboard} />
			<Route exact path="/billing" component={GCBilling} />
			<Route exact path="/insurance" component={MyInsurance} />
			<Route exact path="/projects" component={Projects} />
			<Route exact path="/settings" component={Settings} />
			<Route exact path="/team" component={Team} />
			<Route exact path="/subdashboard" component={SubDashboard} />
			<Route exact path="/subinsurance" component={SubInsurance} />
			<Route exact path="/subsettings" component={SubSettings} />
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

const { node } = PropTypes;
AppTemplate.propTypes = {
	location: node.isRequired,
};
export default connect(mapStateToProps)(AppTemplate);
