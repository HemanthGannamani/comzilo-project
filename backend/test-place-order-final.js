async function testPlaceOrderFinal() {
  try {
    console.log('Logging in as gannamani@gmail.com...');
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

    console.log('\nPlacing order on Customer Portal (POST /api/v1/customer-portal/place-order)...');
    const orderRes = await fetch('http://localhost:5000/api/v1/customer-portal/place-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [
          { id: 2, productId: 2, quantity: 1, price: 500.0, productName: 'Physical Product Test' },
        ],
        paymentMethod: 'cod',
        shippingMethod: 'standard',
        couponCode: '',
        notes: 'Final Order Place Verification',
      }),
    });

    const orderData = await orderRes.json();
    console.log('Place Order Status:', orderRes.status);
    console.log('Place Order Data:', JSON.stringify(orderData, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testPlaceOrderFinal();
