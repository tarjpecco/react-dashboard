import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter, Route, Switch } from 'react-router-dom';
import { isEmpty } from 'lodash';

import GCDashboard from '../GC/Dashboard';
import MyInsurance from '../GC/MyInsurance';
import Settings from '../GC/Settings';
import GCBilling from '../GC/Billing';
import Projects from '../GC/Projects';
import Detail from '../GC/Detail';
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

import {
	getUserSelector,
	actions as userActions,
} from '../../redux/ducks/user';
import './index.scss';

const AppTemplate = ({ showSideBar, location, history, user, getUserInfo }) => {
	if (isEmpty(user)) {
		getUserInfo();
	}
	const userRole = user && user.role ? user.role.toLowerCase() : '';
	return (
		<div
			id="page-container"
			className={classNames(
				'enable-page-overlay side-scroll page-header-fixed page-header-dark main-content-narrow side-trans-enabled',
				{ 'sidebar-o': showSideBar }
			)}
		>
			<Sidebar location={location} userRole={userRole} />

			<Header history={history} username={user && user.username || ''} />
			{userRole === 'gc' && (
				<Switch>
					<Route exact path="/dashboard" component={GCDashboard} />
					<Route exact path="/billing" component={GCBilling} />
					<Route exact path="/insurance" component={MyInsurance} />
					<Route exact path="/projects" component={Projects} />
					<Route exact path="/projects/:id" component={Detail} />
					<Route exact path="/settings" component={Settings} />
					<Route exact path="/team" component={Team} />
				</Switch>
			)}
			{userRole === 'sub' && (
				<Switch>
					<Route exact path="/dashboard" component={SubDashboard} />
					<Route exact path="/insurance" component={SubInsurance} />
					<Route exact path="/settings" component={SubSettings} />
				</Switch>
			)}
			{userRole === 'agent' && (
				<Switch>
					<Route exact path="/dashboard" component={AgentDashboard} />
					<Route exact path="/clients" component={AgentClients} />
					<Route exact path="/agentdetail" component={AgentDetail} />
					<Route exact path="/settings" component={AgentSettings} />
				</Switch>
			)}
		</div>
	);
};

const mapStateToProps = state => ({
	showSideBar: state.global.showSideBar,
	user: getUserSelector(state),
});

const { object, bool, func } = PropTypes;
AppTemplate.propTypes = {
	showSideBar: bool.isRequired,
	location: object.isRequired,
	history: object.isRequired,
	user: object.isRequired,
	getUserInfo: func.isRequired,
};


const mapDispatchToProps = dispatch => ({
	getUserInfo: () => dispatch(userActions.get_user()),
})

const enhance = compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(AppTemplate);
