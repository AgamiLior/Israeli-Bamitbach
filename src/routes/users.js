const express = require('express');
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require('../db')
const bcrypt = require('bcrypt')
router.use(express.json());
router.use(express.urlencoded({extended : true}));
const { BCRYPT_WORK_FACTOR } = require ('../../config');
const res = require('express/lib/response');
const { render } = require('express/lib/response');
const app = require('../app');
const { user } = require('pg/lib/defaults');
const Router = require('router');
const newPastaClass = require('../../event')

router.get('/search', async (req,res,next) => {
try {
	const { id } = req.query;
	const results = await db.query(`SELECT * FROM users WHERE id=$1`, [id])
	return res.json(results.rows)
}catch(e) {
return next(e)
}
})

router.post('/signup', async (req,res,	next) => {
	try {
		const { name, email, phone, password, password_confirm} = req.body;
		if (password != password_confirm) return (
			console.error(`password doesn't match`),
			res.send(`<h1>Password must match</h1>`)
			);
		
		const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
		const hashedPwConfirm = await bcrypt.hash(password_confirm, BCRYPT_WORK_FACTOR)
		const results = await db.query(`INSERT INTO users (name, email, phone, password, password_confirm, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [name, email, phone, hashedPw, hashedPwConfirm, 'user']);
		// res.json(req.body)
		const user = results.rows[0];
		app.locals = user;
		console.log('New USER!!!!', app.locals.id)
		const id = app.locals.id
		res.redirect(`/users/${id}`)
	}catch (e) {
		if (e.code === '23505') {
			return next(new ExpressError("Email or Phone number already in system, please use a different one", 400))
		}
		return next(e)

	}
})

router.post('/login', async (req, res, next) => {
		// return res.json('success')
		try {
		const {email, password} = req.body;
		if (!email || !password) {
			throw new ExpressError("Email and Password Required", 400)
		}
		const results = await db.query(
			`SELECT * FROM users where email = $1`, [email]);
		const user = results.rows[0];
		// console.log('user', user)
		if (user) {
			if (user.type == 'user'){
			if (await bcrypt.compare(password, user.password)) {
				app.locals = user
				console.log('USER loged in', app.locals.id)
				const id = app.locals.id
				res.redirect(`/users/${id}`)
				} 
			} else return res.json('admin log in')
		}
		else {
			throw new ExpressError("Invalid Email/Password", 400)
		}
	} catch (e) {
		return next(e)
	}
})

router.get('/:id', async (req,res,next) => {

	const results = await db.query(
		`SELECT * FROM users where id = $1`, [req.params.id]);
	const user = results.rows[0]
	app.locals = user
	console.log('USER loged in', app.locals.id)
	res.render('userPage', {'username':capitalizeFirstLetter(user.name)})
})

router.post('/forgotPassword', async (req,res,next) => {
	try {
		const {email} = req.body;
		const results = await db.query(
			`SELECT * FROM users where email = $1`, [email]);
		const user = results.rows[0];
		if (user){
			return res.json (`Look for an Email from us within 24 hours!`)
		} throw new ExpressError ("Email is not in the system", 400)
	} catch (e) {
		return next(e)
	}
})

router.post('/review', async (req, res, next) => {
	try {
		const user_id = app.locals.id
		const {review, rate} = req.body;
		const results = await db.query(
			`INSERT INTO reviews (user_id, review, stars) VALUES ($1, $2, $3)`, [user_id, review, rate]);
		const user = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
		app.locals = user.rows[0]
		res.redirect(`/users/${user_id}`)
		// res.render('userPage', {'username':capitalizeFirstLetter(user.rows[0].name)} )
	} catch (e) {
		return next(e)
	}

})

router.post('/class', async (req,res, next) => {
	try {
		const user_id = app.locals.id;
		const email = app.locals.email
		console.log('user_id', user_id)
		const {pasta, sauce, party, tools, date, start_time, end_time, location, more_info} = req.body;
		const start_date_time = date + 'T' + start_time
		const end_date_time = date + 'T' + end_time
		const results = await db.query(
			` INSERT INTO classes (user_id, pasta, sauce, party, tools, start_date_time, end_date_time, location, more_info) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`, [user_id, pasta, sauce, party, tools, start_date_time, end_date_time, location, more_info] );
		const user = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
		app.locals = user.rows[0]
		newPastaClass(start_date_time, end_date_time, location, more_info, pasta, sauce, tools, email)
		res.redirect(`/users/${user_id}`)
		// res.render('userPage', {'username':capitalizeFirstLetter(user.rows[0].name), 'message':'Success'})
	} catch (e) {
		return next(e)
	}
})

router.post('/uploadpicture', async (req,res,next) => {
	try {
		const user_id = app.locals.id;
		const {url} = req.body;
		const results = await db.query(
			` INSERT INTO images (user_id, url) VALUES ($1, $2) returning *`, [user_id, url]);
		const user = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
		// document.getElementById('message').innerHTML =  "Thanks for uploading your picture!";
		app.locals = user.rows[0]
		res.redirect(`/users/${user_id}`)
		// res.render('userPage', {'username':capitalizeFirstLetter(user.rows[0].name)})
	} catch (e) {
		return next(e)
	}
})


function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
  }

module.exports = router;