const https = require('https');

const req = https.request('https://financeee-backend1.onrender.com/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'DATA:', data));
});

req.on('error', console.error);
req.write(JSON.stringify({ name: 'Test Deploy', email: 'testdeploy@example.com', password: 'password123' }));
req.end();
