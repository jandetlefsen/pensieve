import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as reviewActions from '../actions/reviewActions';
import * as itemActions from '../actions/itemActions';

const styles = {
	minHeight: '300px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	whiteSpace: 'pre-wrap',
};

const formatText = text => text.split('\n').join('<br/>').trim();

const SessionsPage = ({ children, title }) => (
	<div className='container'>
		<div className='row'>
			<div className='col-md-8 col-md-offset-2'>
				<h2 className='page-header'>{title}</h2>
				{children}
			</div>
		</div>
	</div>
);

const ProgressBar = ({ progress }) => (
	<div className='progress'>
		<div className='progress-bar'
			role='progressbar'
			aria-valuenow={progress}
			aria-valuemin='0'
			aria-valuemax='100'
			style={{ width: `${progress}%` }}
		>
			<span className="sr-only">{progress}% Complete</span>
		</div>
	</div>
);

const valueToClass = {
	hard: 'alert-danger',
	good: 'alert-info',
	easy: 'alert-success',
};

const SessionResults = ({ items }) => {
	const renderItem = (item) => (
		<li key={`${item._id}`} className='list-group-item'>
			{item.title}
			<span className={`badge ${valueToClass[item.value]}`}>
				<span className='glyphicon glyphicon-ok' aria-hidden='true'></span>
			</span>
		</li>
	);

	return (
		<div>
			<ul className='list-group'>
				{items.map(renderItem)}
			</ul>
			<div className='text-right'>
				<Link to='/activity' className='btn btn-primary'>Back</Link>
			</div>
		</div>
	);
};

class Session extends React.Component {
	constructor(props) {
		super(props);
		this.onItemClick = this.onItemClick.bind(this);
		this.onNextAction = this.onNextAction.bind(this);
		this.state = { index: 0, showAnswer: false, showNextOptions: false };
	}

	componentWillMount() {
		if (!this.props.session) {
			this.props.actions.fetchSession(this.props.params.sessionId);
		}
	}

	onNextAction(event) {
		const value = event.target.dataset.value;
		const { index } = this.state;
		const { session } = this.props;
		const { items } = session;

		// Set the response value of the item
		const selectedItem = items[index];
		selectedItem.value = value;

		// Send the review request
		this.props.actions.reviewItem({ value, itemId: items[index]._id });

		if (index === items.length - 1) {
			this.props.actions.finishSession(session._id);
		}

		// Update state
		this.setState({
			index: index + 1,
			showNextOptions: false,
			showAnswer: false,
		});
	}

	onItemClick() {
		this.setState({
			showNextOptions: true,
			showAnswer: !this.state.showAnswer,
		});
	}

	render() {
		const { index, showAnswer, showNextOptions } = this.state;
		const { session: { items } = {} } = this.props;

		if (!items) {
			return <h3>No items available</h3>;
		}

		if (this.props.session.finishedAt || index > items.length - 1) {
			return (
				<SessionsPage title='Results'>
					<SessionResults items={items} />
				</SessionsPage>
			);
		}

		const selectedItem = items[index];
		const itemContent = showAnswer ? selectedItem.description : selectedItem.title;

		return (
			<SessionsPage title='Review'>
				<ProgressBar progress={index / (items.length -1) * 100} />
				<div className='panel panel-default'>
					<div className='panel-body' style={styles} onClick={this.onItemClick}>
						<h3 className='text-center' style={{ margin: '0'}}>
							{itemContent}
						</h3>
					</div>
				</div>
				{showNextOptions ? (
					<div className='row'>
						<div className='col-xs-4 text-center'>
							<button onClick={this.onNextAction} type='button' data-value='hard' className='btn btn-primary'>Hard</button>
						</div>
						<div className='col-xs-4 text-center'>
							<button onClick={this.onNextAction} type='button' data-value='good' className='btn btn-primary'>Good</button>
						</div>
						<div className='col-xs-4 text-center'>
							<button onClick={this.onNextAction} type='button' data-value='easy' className='btn btn-primary'>Easy</button>
						</div>
					</div>
				) : (
					<div className='row'>
						<div className='col-xs-12 text-center'>
							<button onClick={this.onItemClick} type='button' className='btn btn-primary'>Show Answer</button>
						</div>
					</div>
				)}
			</SessionsPage>
		);
	}
}

const mapStateToProps = (state) => ({
	session: state.data.session,
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({...reviewActions, ...itemActions}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Session);
