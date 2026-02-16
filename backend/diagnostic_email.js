require('dotenv').config();
const { sendWelcomeEmail } = require('./services/emailService');

const testUser = {
    name: 'Test Runner',
    email: 'test@example.com'
};

console.log('Starting Email Diagnostic...');
sendWelcomeEmail(testUser)
    .then(info => {
        console.log('✅ Success! Welcome email sent to test account.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Diagnostic Failed:', err);
        process.exit(1);
    });
