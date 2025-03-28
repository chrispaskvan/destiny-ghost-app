const path = require('path')
const chai = require('chai')
const { Pact } = require('pact')
const chaiAsPromised = require('chai-as-promised')

const expect = chai.expect
const MOCK_SERVER_PORT = 2202

chai.use(chaiAsPromised);

describe('Pact', () => {

	// (1) Create the Pact object to represent your provider
	const provider = new Pact({
		consumer: 'TodoApp',
		provider: 'TodoService',
		port: MOCK_SERVER_PORT,
		log: path.resolve(process.cwd(), 'logs', 'pact.log'),
		dir: path.resolve(process.cwd(), 'pacts'),
		logLevel: 'INFO',
		spec: 2
	})

	// this is the response you expect from your Provider
	const EXPECTED_BODY = [{
		id: 1,
		name: 'Project 1',
		due: '2016-02-11T09:46:56.023Z',
		tasks: [
			{id: 1, name: 'Do the laundry', 'done': true},
			{id: 2, name: 'Do the dishes', 'done': false},
			{id: 3, name: 'Do the backyard', 'done': false},
			{id: 4, name: 'Do nothing', 'done': false}
		]
	}]

	context('when there are a list of projects', () => {
		describe('and there is a valid user session', () => {
			before((done) => {
				// (2) Start the mock server
				provider.setup()
				// (3) add interactions to the Mock Server, as many as required
					.then(() => {
						provider.addInteraction({
							// The 'state' field specifies a "Provider State"
							state: 'i have a list of projects',
							uponReceiving: 'a request for projects',
							withRequest: {
								method: 'GET',
								path: '/projects',
								headers: { 'Accept': 'application/json' }
							},
							willRespondWith: {
								status: 200,
								headers: { 'Content-Type': 'application/json' },
								body: EXPECTED_BODY
							}
						})
					})
					.then(() => done())
			})

			// (4) write your test(s)
			it('should generate a list of TODOs for the main screen', () => {
				const todoApp = new TodoApp();
				todoApp.getProjects() // <- this method would make the remote http call
					.then((projects) => {
						expect(projects).to.be.a('array')
						expect(projects).to.have.deep.property('projects[0].id', 1)

						// (5) validate the interactions you've registered and expected occurred
						// this will throw an error if it fails telling you what went wrong
						expect(provider.verify()).to.not.throw()
					})
			})

			// (6) write the pact file for this consumer-provider pair,
			// and shutdown the associated mock server.
			// You should do this only _once_ per Provider you are testing.
			after(() => {
				provider.finalize()
			})
		})
	})
})