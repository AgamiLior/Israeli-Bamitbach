const { google } = require('googleapis');
const { OAuth2 } = google.auth;


const oAuth2Client = new OAuth2(
	'486610820728-aedo8qt4e42bhgkq3eid2eefiiv7nnoh.apps.googleusercontent.com',
	'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'
	);

oAuth2Client.setCredentials({
	refresh_token: 
	'1//04oDMcjHC2-QICgYIARAAGAQSNwF-L9IrA7IqoH7Apzn7Y3OOrCjeMfxF5pwBC8UffhAoyscbeE4koyXvh8hOyIPe8dhwINFq9VI'
})


function newPastaClass(start_date_time, end_date_time, adress, more_info, pasta, sauce, tools, email) {
	let res;
	console.log('#@@@#@#@#@', start_date_time, end_date_time, adress, more_info, pasta, sauce, tools, email)
	function checkForTools() {
		if (tools) return 'Have'
		return "Don't have"
	} 
	function checkForInfo() {
		if (more_info) return `, Thanks for letting us know about: ${more_info}`
		return '!'
	}

	const calendar = google.calendar({
		version: 'v3',
		auth: oAuth2Client
	})
	
	const eventStart = new Date(start_date_time)
	const eventStartTime = eventStart.toISOString()
	const eventEnd = new Date(end_date_time)
	const eventEndTime = eventEnd.toISOString()
	

	
	const event = {
		summary: 'Learning how to make pasta',
		location: adress,
		description: `Your Pasta Class contains ${pasta} ${sauce} and you said you ${checkForTools()} tools ${checkForInfo()}`,
		start: {
			dateTime: eventStartTime,
			timeZone: 'America/New_York'
		},
		end: {
			dateTime: eventEndTime,
			timeZone: 'America/New_York'
		},
		colorId: 2,
		attendees: [
			{email: email},
			{email: 'israelibamitbach@gmail.com'}
		]
	}
	
	calendar.freebusy.query({
		resource: {
			timeMin: eventStartTime,
			timeMax: eventEndTime,
			timeZone: 'America/New_York',
			groupExpansionMax: 100,
			calendarExpansionMax: 50,
			items: [{id: 'primary' }]
		}
	}, (err,res) => {
		if(err) return console.error('Already Booked', err)
		
		const eventsArr = res.data.calendars.primary.busy
		if(eventsArr.length === 0) return calendar.events.insert({
			calendarId: 'primary',
			resource: event
		}, (err) => {
			if (err) return console.error('Calender Event Creation Error', err)
			// return 	console.log('Calender Event Created for:', eventStartTime)
			return res = true
		})
	
		// return console.log("Sorry we are busy, please pick a different Date and Time")
		return res = false
	})
	

}

module.exports = newPastaClass;
