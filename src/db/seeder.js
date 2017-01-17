/*
 * DB Seeder script. Adds default items to db
 * for testing.
 */
import { Item, User } from './schema';

const seedAddress = process.env.TEST_EMAIL_ADDRESS || 'test@example.com';

const testUser1 = new User({
	name: 'Jane Tester',
	email: seedAddress,
	is_email_on: true
});

const testItem1 = new Item({
	value: 'Test Title 1',
});

const testItem2 = new Item({
	value: 'Test Title 2',
});

testUser1.save((err, res) => {
	if (err) return console.error(err);

	testItem1.user_id = res.id;
	testItem2.user_id = res.id;

	testItem1.save();
	testItem2.save();
});
