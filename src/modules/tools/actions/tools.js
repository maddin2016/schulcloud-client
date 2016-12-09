import React from 'react';
import {browserHistory} from 'react-router';
import { Server } from '../../core/helpers';
var OAuth = require('oauth-1.0a');
var crypto = require('crypto');

const toolsConnectService = Server.service('/ltiTools/connect');
const toolService = Server.service('/ltiTools');

var createConsumer = (key, secret) => {
	return OAuth({
		consumer: {
			key: key,
			secret: secret
		},
		signature_method: 'HMAC-SHA1',
		hash_function: function(base_string, key) {
			return crypto.createHmac('sha1', key).update(base_string).digest('base64');
		}
	});
};

var sendRequest = (request_data, consumer) => {
	var name,
		form = document.createElement("form"),
		node = document.createElement("input");


	form.action = request_data.url;
	form.method = request_data.method;
	form.target = "_blank";

	var formData = consumer.authorize(request_data);

	for (name in formData) {
		node.name = name;
		node.value = formData[name].toString();
		form.appendChild(node.cloneNode());
	}

	// To be sent, the form needs to be attached to the main document.
	form.style.display = "none";
	document.body.appendChild(form);

	form.submit();

	// But once the form is sent, it's useless to keep it.
	document.body.removeChild(form);
};

export default {
	connect: (tool) => {
		var consumer = createConsumer(tool.key, tool.secret);

		var payload = {
			lti_version: tool.lti_version,
			lti_message_type: tool.lti_message_type,
			resource_link_id: tool.resource_link_id,
			user_id: '12345',
			roles: 'Instructor',
			launch_presentation_document_target: 'window',
			lis_person_name_full: 'John Logie Baird',
			lis_person_contact_email_primary: 'jbaird@uni.ac.uk',
			launch_presentation_locale: 'en'
		};

		var request_data = {
			url: tool.url,
			method: 'POST',
			data: payload
		};

		sendRequest(request_data ,consumer);
	},
	createNew: (tool) => {
		toolService.create(tool)
			.then(result => {
				// Todo: remove when subsmanager is implemented
				window.location.href = '/tools/'
			})
			.catch(err => {
				console.log(err);
			});
	}
};


