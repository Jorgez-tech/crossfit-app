// Smoke test: login as trainer and create a workout using fetch with retries
const fetch = global.fetch || require('node-fetch');

const API_BASE = 'http://localhost:3000/api/v1';
if (!process.env.DEV_TRAINER_PASSWORD) {
    console.error('ERROR: set DEV_TRAINER_PASSWORD in your environment before running smoke_test.js');
    process.exit(1);
}
const trainer = { email: 'carlos@box.com', password: process.env.DEV_TRAINER_PASSWORD };

async function waitForServer(url, retries = 20, delay = 500) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, { method: 'GET' });
            if (res.ok || res.status === 404) return true;
        } catch (e) { }
        await new Promise(r => setTimeout(r, delay));
    }
    throw new Error('Server not responding');
}

async function run() {
    try {
        console.log('Waiting for server...');
        await waitForServer(`${API_BASE}/workouts`);

        console.log('Logging in as trainer...');
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainer),
        });
        const loginBody = await loginRes.json();
        if (!loginRes.ok) {
            console.error('Login failed', loginRes.status, loginBody);
            process.exitCode = 2;
            return;
        }
        const token = loginBody.token || loginBody.data?.token || (loginBody.data && loginBody.data.token);
        console.log('Login ok, token length:', token ? token.length : 'no token');

        console.log('Creating a test workout (should be allowed for entrenador)...');
        const workoutPayload = {
            name: `Smoke WOD ${Date.now()}`,
            exercises: '10 burpees, 10 squats',
            description: 'Prueba automatizada',
            created_by: 1
        };
        const createRes = await fetch(`${API_BASE}/workouts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(workoutPayload)
        });
        const createBody = await createRes.text();
        console.log('Create workout status:', createRes.status);
        console.log('Create workout body:', createBody);

    } catch (err) {
        console.error('Smoke test error:', err.message || err);
        process.exitCode = 1;
    }
}

run();
