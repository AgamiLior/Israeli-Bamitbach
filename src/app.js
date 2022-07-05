const express = require('express');
const app = express();
const ExpressError = require('./expressError')
const path = require('path');
const bodyParser = require('body-parser')
const db = require('./db')


app.use(express.json());

const uRoutes = require('./routes/users')


app.use('/users', uRoutes)


app.use(express.urlencoded({extended : true}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', __dirname + '/public/views')
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile)

app.use(function (req, res, next) {
	const err = new ExpressError("Not Found", 404);
	return next(err);
})

app.use(function (err, req, res, next) {
	let status = err.status || 500
	return res.status(status).json({
		error: {
			message: err.message,
			status: status
		}
	})
})

app.get('/', async (req, res) => {
	res.render('index.html')
})

let port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Server on Port 3000')
})