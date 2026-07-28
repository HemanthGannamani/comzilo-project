async function testIntegrationsApi() {
  console.log('--- Testing Integrations & Webhooks Test Credentials API ---');

  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@comzilo.com',
      password: 'SuperAdminSecurePassword2026!',
    }),
  });

  const loginData = await loginRes.json();
  const token = loginData?.data?.tokens?.accessToken || loginData?.data?.accessToken;
  console.log('Login Status:', loginRes.status);

  // 1. Stripe Test Mode API
  console.log('\n1. Testing Stripe Test Credentials API...');
  const stripeRes = await fetch('http://localhost:5000/api/v1/integrations/stripe/test-credentials', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ provider: 'stripe' }),
  });
  const stripeData = await stripeRes.json();
  console.log('Stripe Test Status:', stripeRes.status);
  console.log('Stripe Response:', stripeData);

  // 2. AWS S3 Local Storage API
  console.log('\n2. Testing AWS S3 / Local Storage Test Credentials API...');
  const awsRes = await fetch('http://localhost:5000/api/v1/integrations/aws_s3/test-credentials', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ provider: 'aws_s3' }),
  });
  const awsData = await awsRes.json();
  console.log('AWS Test Status:', awsRes.status);
  console.log('AWS Response:', awsData);

  // 3. OpenAI Graceful Disable API
  console.log('\n3. Testing OpenAI Graceful Disable Test Credentials API...');
  const openAiRes = await fetch('http://localhost:5000/api/v1/integrations/openai/test-credentials', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ provider: 'openai' }),
  });
  const openAiData = await openAiRes.json();
  console.log('OpenAI Test Status:', openAiRes.status);
  console.log('OpenAI Response:', openAiData);

  process.exit(0);
}

testIntegrationsApi().catch(err => {
  console.error(err);
  process.exit(1);
});
