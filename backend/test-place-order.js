async function testPlaceOrder() {
  try {
    console.log('Logging in as hemanth@gmail.com...');
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'hemanth@gmail.com',
        password: 'Hemanth@123',
      }),
    });

    const loginData = await loginRes.json();
    const token = loginData?.data?.accessToken || loginData?.accessToken;
    console.log('Login response:', JSON.stringify(loginData, null, 2));

    if (!token) {
      console.error('Login failed! Token not returned.');
      return;
    }

    console.log('Placing test order...');
    const orderRes = await fetch(
      'http://localhost:5000/api/v1/customer-portal/place-order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-tenant-id': '1',
          'x-store-id': '1',
        },
        body: JSON.stringify({
          items: [
            { id: 1, productId: 1, quantity: 1, price: 1499.0, productName: 'QA Verified Physical Product' },
            { id: 2, productId: 2, quantity: 1, price: 500.0, productName: 'Physical Product Test' },
          ],
          paymentMethod: 'cod',
          shippingMethod: 'standard',
          couponCode: '',
          notes: 'Test order verification',
        }),
      }
    );

    const orderData = await orderRes.json();
    console.log('Place order result:', JSON.stringify(orderData, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testPlaceOrder();
