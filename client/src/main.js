/*jshint esversion: 6 */
let reposTemplate = $('#repos-template').html();
let renderRepos = Handlebars.compile(reposTemplate);

let historyTemplate = $('#searches-template').html();
let renderHistory = Handlebars.compile(historyTemplate);

let searchHistory = [];
let repoList = [];

function searchForRepos() {
	let searchBody = $('#searchBox').val();

	$.ajax({
		type: 'GET',
		url: 'http://api.github.com/users/' + searchBody + '/repos'
	}).then(function(response) {
		repoList = [];

		$.each(response, function(key, value) {
			repoList.push({
				"repoName": value.name,
				"url": value.html_url,
			});
		});

		updateSearchHistory(searchBody);
		repoList.shift();
		renderSearchList();
	}, function(error) {
		console.log(error);
	});
}


function renderSearchList() {
	let reposHTML = renderRepos({
		repos: repoList
	});
	$('#repos').html(reposHTML);

	$.ajax({
		type: 'GET',
		url: 'http://localhost:3000/api/searches'
	}).then(function(response) {
		searchHistory = [];

		$.each(response, function(key, value) {
			searchHistory.push({
				"searchName": value.term
			});
		});

		console.log(searchHistory);
		let searchesHTML = renderHistory({
			searches: searchHistory
		});
		$('#searches').html(searchesHTML);

	}, function(error) {
		console.log(error);
	});
}

function updateSearchHistory(username) {
	$.ajax({
		type: 'POST',
		url: 'http://localhost:3000/api/searches',
		data: {
			term: username,
			createdAt: new Date()
		}
	}).then(function(response) {
		searchHistory.push({
			"searchName": username
		});
		renderSearchList();
	}, function(error) {
		console.log(error);
	});
}

renderSearchList();

// Have search activate on "Enter" key
$("#searchBox").keyup(function(event) {
	if (event.keyCode == 13) {
		searchForRepos();
	}
});
