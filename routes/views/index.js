var keystone = require('keystone'),
	moment = require('moment');

var Meetup = keystone.list('Meetup'),
	Post = keystone.list('Post');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'home';
	locals.meetup = false;
	
	
	// Load the first, NEXT meetup
	
	view.on('init', function(next) {
		Meetup.model.findOne()
			.where('state', 'active')
			.sort('publishedDate')
			.exec(function(err, activeMeetup) {
				locals.activeMeetup = activeMeetup;
				next();
			});

	});
	
	
	// Load the first, PAST meetup
	
	view.on('init', function(next) {
		Meetup.model.findOne()
			.where('state', 'past')
			.sort('publishedDate')
			.exec(function(err, pastMeetup) {
				locals.pastMeetup = pastMeetup;
				next();
			});

	});


	// Decide which to render

	view.on('render', function(next) {

		locals.meetup = locals.activeMeetup || locals.pastMeetup;
		locals.meetup.populateRelated('talks[who]', next);
	});
	
	view.render('site/index');
	
}
