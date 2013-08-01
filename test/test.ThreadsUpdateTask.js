var should = require('should');

ThreadUpdator = require('../lib/core/ThreadUpdateTask');
var u = require('../lib/Utils');

var DownloadReader;


describe('ThreadUpdateTask', function() {
	var open = 'open';
	var closed = 'closed';
	var failed = 'failed';
	var idle = 'idle';

	it('test execute for failed', function() {
		var thread = {
			connection: open
		};
		u.executor(ThreadUpdator)(thread, {});
		thread.connection.should.equal(failed);
	});

	it('test execute for open', function() {

		var thread = {
			connection: idle
		};

		u.executor(ThreadUpdator)(thread, null, {
			event: 'response'
		});

		thread.connection.should.equal(open);
	});

	it('test execute for position', function() {
		var thread = {
			connection: open,
			position: 10
		};

		u.executor(ThreadUpdator)(thread, null, {
			event: 'data',
			data: 'AAAA'
		});

		thread.position.should.equal(14);

	});

	it('test execute for callback on end', function(done) {


		var thread = {
			connection: open,
			position: 5,
			end: 10
		};

		u.executor(ThreadUpdator)(thread, null, {
			event: 'end'
		}, null, function() {
			thread.connection.should.equal(failed);
			done();
		});

	});

	it('test execute for connection closed', function() {
		var thread = {
			position: 11,
			end: 10,
			connection: open
		};

		u.executor(ThreadUpdator)(thread, null, {
			event: 'end'
		}, null, function() {});
		thread.connection.should.equal(closed);

	});

	it('test execute for destroyed', function(done) {

		var thread = {
			connection: open
		};

		u.executor(ThreadUpdator)(thread, null, {
			event: 'response',
			destroy: function() {
				done();
			}
		}, true);
	});

	it('test execute method for idle', function() {

		var thread = {
			connection: idle
		};

		u.executor(ThreadUpdator)(thread, null, {});
		thread.connection.should.equal(idle);

	});
});