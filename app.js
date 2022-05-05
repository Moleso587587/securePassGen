const express = require('express');
const app = express();
const passGen = require("./middleware/passGen");
const fs = require('fs');

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.post('/', (req, res) => {
	if (!req.body || !req.body.service || !req.body.url || !req.body.passLen) return res.redirect('/');
	const data = {
		service: req.body.service,
		url: req.body.url,
		password: passGen.generate(req.body.passLen, req.body.symbols || false, req.body.numbers || false, req.body.upperCase || false, req.body.lowerCase || false)
	}
	const accounts = JSON.parse(fs.readFileSync('./accounts.json'));
	accounts.push(data)
	fs.writeFileSync('./accounts.json', JSON.stringify(accounts));
	res.redirect('/');
})

app.use('/', (req, res) => {
	res.render('main', {
		accounts: JSON.parse(fs.readFileSync('./accounts.json'))
	});
});

app.listen(5000);