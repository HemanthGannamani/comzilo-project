async function testCustomerAddress() {
  try {
    console.log('Logging in as gannamani@gmail.com with Hemanth@123...');
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'gannamani@gmail.com',
        password: 'Hemanth@123',
      }),
    });

    const loginData = await loginRes.json();
    const token = loginData?.data?.accessToken;
    console.log('Login status:', loginRes.status, 'Token acquired:', !!token);

    if (!token) return;

    console.log('\nTesting GET /api/v1/customer-portal/addresses...');
    const getRes = await fetch('http://localhost:5000/api/v1/customer-portal/addresses', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    console.log('GET Addresses Status:', getRes.status);
    console.log('GET Addresses Data:', JSON.stringify(getData, null, 2));

    console.log('\nTesting POST /api/v1/customer-portal/addresses...');
    const postRes = await fetch('http://localhost:5000/api/v1/customer-portal/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: 'Gannamani Hemanth',
        phone: '7654765487',
        addressLine1: 'Abids Road',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postalCode: '500095',
        addressType: 'shipping',
      }),
    });

    const postData = await postRes.json();
    console.log('POST Address Status:', postRes.status);
    console.log('POST Address Data:', JSON.stringify(postData, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testCustomerAddress();
