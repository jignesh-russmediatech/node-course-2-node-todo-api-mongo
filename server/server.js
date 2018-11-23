require('./config/config.js'); 

const _ = require('lodash'); 
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var{mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todos');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

	//console.log(req.body.text);
	var todo = new Todo({
		text: req.body.text,
		completedAt: req.body.completedAt,
		completed: req.body.completed
	})
	
	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
})

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		
		res.send({todos});
	}, (e) => {
		res.status(400).send();
	});
})

app.get('/todos/:id', (req, res) => {
	
	var id = req.params.id;
	
	if (!ObjectID.isValid(id)) {
		return res.status(400).send('Invalid ID');
	}
	
	Todo.findById(id).then((todos) => {
		
		if (!todos) {
			res.status(400).send('Id not found');
		}
		res.send({todos});
	}).catch((e) => {
		res.status(400).send(e);
	});
})

app.delete('/todos/:id', (req, res) => {
	
	var id = req.params.id;
	
	if (!ObjectID.isValid(id)) {
		return res.status(400).send('Invalid ID');
	}
	
	Todo.findByIdAndRemove(id).then((todos) => {
		
		if (!todos) {
			res.status(400).send('Id not found');
		}
		res.send({todos});
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.patch('/todos/:id', (req, res) => {
	var id   = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);
	
	if (!ObjectID.isValid(id)) {
		return res.status(400).send('Invalid ID');
	}
	
	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}
	
	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		
		if (!todo) {
			res.status(400).send('Id not found');
		}
		
		res.send({todo});
	}).catch((e) => {
		res.status(400).send(e);
	})
});

app.listen(port, () => {
	console.log('Started at port', port);
});

module.exports = {app};

//var newTodo = new Todo({
//	text: 'Cook dinner'
//});
//
//newTodo.save().then((doc) => {
//	
//	console.log('Saved todo', doc)
//}, (e) => {
//	console.log('Unable to save todo');
//});

//var user1 = new User({
//	email: 'niraj@gmail.com',
//});
//
//user1.save().then((doc) => {
//	
//	console.log('Saved todo', doc)
//}, (e) => {
//	console.log('Unable to save todo', e);
//});

// User
// email - require - trim it - set type - set min length of 1