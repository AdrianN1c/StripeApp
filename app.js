/* 
-= App to return Stripe data based on the unique customer ID user field on each user record in Zendesk. 
-= Each user must have an entry in this field for the app to work.
*/

(function() {

  return {
	defaultState: 'loading', //Creates spinner to show loading
	events: {
		//On ticket open gets zendesk user ID and pass it into GetStripeID request
		'app.activated':'getZenInfo',

		//Returns the user data for that end user including the StripeID custom field
		'GetStripeID.done':'showZenInfo',
		//Else displays an error message the end user has no StripeID setup yet
		'GetStripeID.fail':'showError',
		
		//Returns the Stripe API data
		'ShowStripeID.done':'showInfo',
		//Else displays an error message that we had a problem contacting Stripe
		'ShowStripeID.fail':'showStripeError'

		/*
		Tab for Plan type? Active coupons? Trial?
		Tab for Invoices - Paid and pending (invoice number search?)
		Tab for Payments - 
		Tab for Details of customer - Full address
		Tab For full Card info - Card info
		Switch to using OAuth or contacting third party server for Stripe Data
		*/
	},

	requests: {
		GetStripeID: function(id) {
			return {
				url: 'https://z3nstripetest.zendesk.com/api/v2/users/'+ id + '.json',
				type:'GET',
				dataType: 'json',
				proxy_v2 : true
			};
		},

		ShowStripeID: function(test) {
			return {
				headers: {
					'Authorization': 'Bearer ' + this.setting('key')
				},
				url: 'https://api.stripe.com/v1/customers/'+ test,
				type:'GET',
				dataType: 'json',
				proxy_v2 : true
			};
		}

	},

	//Function to collect the user ID and pass it into an AJAX request to contact Zendesk for the user data
	getZenInfo: function() {
		var id = this.ticket().requester().id();
		this.ajax('GetStripeID',id);
	},

	//Function to pass the Custom field StripeID into the AJAX call of the stripe API
	showZenInfo: function(data) {
		var test = data.user.user_fields.stripe_id;
		this.ajax('ShowStripeID',test);
	},

	//Function to pass the Stripe API data into the requestor.hdbs file for display on the screen
	showInfo: function(data) {
		this.switchTo('requester', data);
	},

	//Error function for error getting user ID in Zendesk
	showError: function() {
		this.switchTo('error');
	},

	//Error function for problems getting the Stripe data
	showStripeError: function() {
		this.switchTo('stripeerror');
	}

  };

}());