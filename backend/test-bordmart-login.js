const http = require('http');

const req = http.request(
  {
    host: 'localhost',
    port: 5000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  (res) => {
    let body = '';
    res.on('data', (c) => (body += c));
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      const parsed = JSON.parse(body);
      console.log('Success:', parsed.success);
      console.log('User Email:', parsed.data?.user?.email);
      console.log('User Status:', parsed.data?.user?.status);
      console.log('Tenant Name:', parsed.data?.tenant?.name);
      console.log('Tenant Slug:', parsed.data?.tenant?.slug);
      console.log('Access Token Present:', !!parsed.data?.accessToken);
    });
  }
);

req.write(JSON.stringify({ email: 'bordmart0@gmail.com', password: 'Sel831Pass!570' }));
req.end();
