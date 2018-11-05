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
import AgentDashboard from '../Agent/Dashboard';
import AgentSettings from '../Agent/Settings';
import AgentClients from '../Agent/Clients';
import AgentDetail from '../Agent/Detail';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

import './index.scss';

const AppTemplate = ({ showSideBar, location, username }) => (
	<div
		id="page-container"
		className={classNames(
			'enable-page-overlay side-scroll page-header-fixed page-header-dark main-content-narrow side-trans-enabled',
			{ 'sidebar-o': showSideBar }
		)}
	>
		<Sidebar location={location} />

		<Header />
		{username === 'gc' && (
			<Switch>
				<Route exact path="/dashboard" component={GCDashboard} />
				<Route exact path="/billing" component={GCBilling} />
				<Route exact path="/insurance" component={MyInsurance} />
				<Route exact path="/projects" component={Projects} />
				<Route exact path="/settings" component={Settings} />
				<Route exact path="/team" component={Team} />
			</Switch>
		)}
		{username === 'sub' && (
			<Switch>
				<Route exact path="/dashboard" component={SubDashboard} />
				<Route exact path="/insurance" component={SubInsurance} />
				<Route exact path="/settings" component={SubSettings} />
			</Switch>
		)}
		{username === 'agent' && (
			<Switch>
				<Route exact path="/dashboard" component={AgentDashboard} />
				<Route exact path="/clients" component={AgentClients} />
				<Route exact path="/agentdetail" component={AgentDetail} />
				<Route exact path="/settings" component={AgentSettings} />
			</Switch>
		)}
	</div>
);

const mapStateToProps = state => ({
	showSideBar: state.global.showSideBar,
	username: state.global.username,
	password: state.global.password,
});

const { bool } = PropTypes;

AppTemplate.propTypes = {
	showSideBar: bool.isRequired,
};

const { node, string } = PropTypes;
AppTemplate.propTypes = {
	location: node.isRequired,
	username: string.isRequired,
};
export default connect(mapStateToProps)(AppTemplate);
