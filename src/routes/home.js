const express = require('express');
const { database } = require('pg/lib/defaults');
const router = new express.Router();


// router.get('/', (req, res) => {
// 	 res.render('index.html')
// })

router.get('/', (req, res) => {
		res.send(`
		<form method="POST" action="/home">
			<input type="text" name="name" id="name" placeholder="name" />
			<input type="text" name="email" id="email" placeholder="email" />
			<input type="text" name="phone" id="phone" placeholder="number" />
			<button type="submit" name="submit_button" id="submit_button" />
		`);
	})

router.post('/addinguser', async (req, res) => {
	const body = req.body;
	await database.execute(`
	INSERT INTO users (
		name, email, phone
	)`)

})


module.exports = router;