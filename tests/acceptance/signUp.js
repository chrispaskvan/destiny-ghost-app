import { Selector } from 'testcafe';

fixture `Sign Up`
	.page `http://localhost:1101/signUp`;  // specify the start page


//then create a test and place your code there
test('My first test', async t => {
	await t
		.typeText('#firstName1', 'John')
		.typeText('#lastName1', 'Smith')
		.typeText('#phoneNumber1', '6304807607') // ToDo import setting
		.typeText('#emailAddress1', 'john.smith@apricothill.com')
		.click('#submit-button')

		// Use the assertion to check if the actual header text is equal to the expected one
		.expect(Selector('#article-header').innerText).eql('Thank you, John Smith!');
});