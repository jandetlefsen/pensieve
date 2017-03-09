import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import {
	UserEntity,
	ItemEntity,
	ReviewSessionEntity,
} from './models/schema';

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function authenticateUser(req, res, next) {
	let token = req.headers.authorization;
	if (!token) {
		return res.status(404).json({
			error: true,
			message: 'Invalid authentication. Please include a JWT token',
		});
	}

	token = token.replace('Bearer ', '');

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(401).json({
				error: true,
				message: 'Invalid authentication. Please log in to make requests'
			});
		}
		req.user = user;
		next();
	});
}

export default function(app) {
	app.post('/users/signup', function (req, res, next) {
		const newUser = new UserEntity();
		const name = req.body.name.trim();
		const email = req.body.email.trim();
		const password = req.body.password.trim();
			
		UserEntity.findOne({ email: email }, (err, user) => {
			if (err) { return res.send(err); }

			if (user) {
				return res.status(404).json({
					error: true,
					message: 'That email is already taken'
				});
			}

			const newUser = new UserEntity();
			newUser.name = name;
			newUser.email = email;
			newUser.password = newUser.generateHash(password);

			newUser.save((err, user) => {
				if (err) { return res.send(err); }

				res.json({
					user: user.getCleanUser(user),
					token: user.generateToken(user),
				});
			});
		});
	});

	app.post('/users/login', function(req, res) {
		const email = req.body.email.trim();
		UserEntity.findOne({ email: email }, (err, user) => {
			if (err) { return res.send(err); }

			if (!user) {
				return res.status(404).json({
					error: true,
					message: 'No user found with that email and password'
				});
			}

			if (!user.validPassword(req.body.password.trim())) {
				return res.status(404).json({
					error: true,
					message: 'No user found with that email and password'
				});
			}

			res.json({
				user: user.getCleanUser(user),
				token: user.generateToken(user),
			});
		});
	});

	app.get('/self', function(req, res, next) {
		const token = req.body.token || req.query.token;

		if (!token) {
			return res.status(401).json({
				error: true,
				message: 'Must include token',
			});
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) { throw err; }

			UserEntity.findById(user._id, (err, user) => {
				if (err) throw err;

				res.json({
					user: user.getCleanUser(user),
					token: token // could renew token here
				});
			});
		});
	});

	app.get('/api/items', authenticateUser, (req, res) => {
		const user = req.user;
		ItemEntity.find({ user_id: user._id }, (err, items) => {
			if (err) { return console.log(err); }
			res.send(items);
		});
	});

	app.get('/api/items/:item_id', authenticateUser, (req, res) => {
		const itemId = req.params.item_id;
		const userId = req.user._id;
		ItemEntity.findOne({ _id: itemId, user_id: userId }, (err, item) => {
			if (err) { return console.log(err); }
			res.send(item);
		});
	});

	app.post('/api/items', authenticateUser, (req, res, next) => {
		const item = new ItemEntity({
			user_id: req.user._id,
			title: req.body.title,
			description: req.body.description,
		});

		item.save((err) => {
			if (err) {
				res.send({ error: err });
				return next(err);
			}

			return res.status(200).json({ message: 'Item successfully saved!', item: item });
		});
	});

	app.get('/api/sessions', authenticateUser, (req, res) => {
		const user = req.user;
		ReviewSessionEntity.find({ user_id: user._id }, (err, sessions) => {
			if (err) { return console.log(err); }
			res.send(sessions);
		});
	});

	app.get('/api/sessions/:session_id', authenticateUser, (req, res) => {
		const sessionId = req.params.session_id;
		const userId = req.user._id;
		ReviewSessionEntity.findOne({ _id: sessionId, user_id: userId }, (err, session) => {
			if (err) { return console.log(err); }

			ItemEntity.find()
				.where('_id')
				.in(session.items)
				.exec((err, items) => {
					if (err) { return console.log(err); }

					session.items = items;
					res.send(session);

				});
		});
	});

	app.post('/api/sessions', authenticateUser, (req, res, next) => {
		const userId = req.user._id;
		const itemQuery = ItemEntity.find({ user_id: userId }).limit(6);
		itemQuery.exec((err, items) => {
			if (err) { return console.log(err); }
			if (!items.length) {
				return console.log(`User ${userId} is missing items. Skipping.`);
			}

			const itemIds = items.map(item => item.id);
			const session = new ReviewSessionEntity({
				user_id: userId,
				items: itemIds,
			});

			session.save((err) => {
				if (err) {
					res.send({ error: err });
					return next(err);
				}

				return res.status(200).json({ message: 'Session successfully created!', session: session });
			});
		});
	});

	/*
	app.get('/sessions/:sessionId', isLoggedIn, (req, res) => {
		const sessionId = req.params.sessionId;
		ReviewSessionEntity.findById(sessionId, (err, session) => {
			if (err) { return console.log(err); }

			ItemEntity.find( { _id: { $in: session.items }, user_id: req.user.id }, (err, items) => {
				if (err) { return console.log(err); }

				res.render('sessions.ejs', {
					items: items,
				});
			});
		});
	});
	*/
}