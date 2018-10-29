const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');


app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false}));
app.use('/public', express.static(__dirname + '/public'));


//Route 1: get request that renders all your users
app.get('/', function(req, res) {
	fs.readFile('./users.json', function(err, data) {
		if (err) {
			console.log(err);
		}
		const parsedData = JSON.parse(data);
		res.render('index', {parsedData}
			);
		});
	});

//Route 2: renders a page and display form
app.get('/search', function(req, res) {  // Will render the search.ejs page
	res.render('search');
});

//Route 3: takes post request from form displaying matches on new page
app.post('/search', function(req, res) {
	fs.readFile('./users.json', (err,data) => {
		if (err) {throw err}

		const parsedData = JSON.parse(data);
		const output = [];

			for (let i = 0; i < parsedData.length; i++) {
				if (parsedData[i].firstname === req.body.input
					|| parsedData[i].lastname === req.body.input) {
					output.push(parsedData[i]);
					console.log(output);
				}
			}
		res.render('matches', {output});
	})
});

app.get('/matches', function(req, res) {
	res.render('matches');
});

//Route 4: renders a page with 3 inputs on it
app.get('/addUser', function(req, res) {
	res.render('addUser');
});

//Route 5: takes in a post request from the addUser file
app.post('/addUser', function (req, res) {
	fs.readFile('./users.json', (err, data) => {
		if (err) {throw err}

		let parsedData = JSON.parse(data);

		let newUser = { //adding a new user to the list
			firstname: req.body.inputfirst,
			lastname: req.body.inputlast,
			email: req.body.inputemail,
		}
//push new user to the array in .json file
		parsedData.push(newUser);

		let json = JSON.stringify(parsedData);

		fs.writeFile('./users.json', json, (err) => {
			if (err) {throw err}
		})
	})
	res.redirect('/');
});

//Autocomplete
app.post('/autocomplete', function(req, res) {
	fs.readFile('./users.json', (err,data) => {
		if (err) {throw err}

		const parsedData = JSON.parse(data);
		const output = [];

			for (let i = 0; i < parsedData.length; i++) {
				if (parsedData[i].firstname === req.body.input
					|| parsedData[i].lastname === req.body.input) {
					output.push(parsedData[i]);
					console.log(output);
				}
			}
		res.send(output);
	})
});


//Running server:
app.listen (port, () => console.log(`Listening on port: ${port}`));
