var fs = require('fs');
var github = require('github');

// fileManager module that will deal with retrieving scss files from a central
// repository.
var fileManager = function() {
	this.githubApi = new github({
		version: "3.0.0"
	});

	this._files = {};
}

fileManager.prototype = {
	constants: {
		user: "balshamali",
		repo: "testing"
	},

	get files(){
		return this._files;
	},

	/**
	* Populates *files* array with the scss files retrieved from the repo.
	*/
	retrieveFileNames: function() {
		var _this = this;
		console.log("retrieving fileNames from central repo");
		// step 1: get last commmit sha
		_this.githubApi.repos.getCommits(
			{
				user: _this.constants.user, 
				repo: _this.constants.repo,
				sha: "master",
				per_page: 1 // to get the last commit
			}, function(err, data) {
				if (err) console.log(err);
				else {
					// get the commit hash and get the blob for the commit hash
					if (!data.length) return;
					// step 2: get the tree for the last commit sha
					_this._populateFilesFromCommit(data[0].sha);
				}
			}
		);
	},

	/**
	* @param {sha} (Number) - The commit hash to retrieve.
	*/
	_populateFilesFromCommit: function(sha)
	{
		var _this = this;
		_this.githubApi.gitdata.getTree(
			{
				user: _this.constants.user,
				repo: _this.constants.repo,
				sha: sha
			}, function(err, data) {
				if (err) console.log(err);
				else {
					// console.log(data);
					// get the names of the files and store them in *files*
					for (var i = 0, len = data.tree.length; i < len; ++i) {
						_this.files[data.tree[i].path] = data.tree[i].sha;
					}

					console.log(_this.files);
				}
			}
		);
	}
}

exports.fileManager = fileManager;