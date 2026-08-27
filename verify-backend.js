
import http from 'http';

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: body ? JSON.parse(body) : {} });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function test() {
    console.log('Starting verification...');

    // 1. Check Root
    try {
        const root = await request('GET', '/');
        console.log('Root Check:', root.status === 200 ? 'PASS' : 'FAIL', root.body);
    } catch (e) {
        console.log('Root Check: FAIL (Server not running?)', e.message);
        process.exit(1);
    }

    // 2. Create Post
    let postId;
    try {
        const post = await request('POST', '/api/posts', { title: 'Test Post', content: 'Content', tags: ['test'] });
        console.log('Create Post:', post.status === 201 ? 'PASS' : 'FAIL');
        if (post.status === 201) postId = post.body._id;
    } catch (e) {
        console.log('Create Post: FAIL', e.message);
    }

    // 3. Get Posts
    try {
        const posts = await request('GET', '/api/posts');
        console.log('Get Posts:', posts.status === 200 && Array.isArray(posts.body) ? 'PASS' : 'FAIL', `Count: ${posts.body.length}`);
    } catch (e) {
        console.log('Get Posts: FAIL', e.message);
    }

    // 4. Delete Post
    if (postId) {
        try {
            const del = await request('DELETE', `/api/posts/${postId}`);
            console.log('Delete Post:', del.status === 200 ? 'PASS' : 'FAIL');
        } catch (e) {
            console.log('Delete Post: FAIL', e.message);
        }
    }

    // 5. Contact (Should fail due to missing token)
    try {
        const contact = await request('POST', '/api/contact', { name: 'Tester', email: 'test@example.com', message: 'Hello' });
        console.log('Contact Missing Token:', contact.status === 400 && contact.body.error === 'Turnstile token is missing' ? 'PASS' : 'FAIL', `Status: ${contact.status}, Error: ${contact.body.error}`);
    } catch (e) {
        console.log('Contact Missing Token: FAIL', e.message);
    }

    // 6. Contact (Should fail verification with fake token)
    try {
        const contact = await request('POST', '/api/contact', { name: 'Tester', email: 'test@example.com', message: 'Hello', token: 'fake-token' });
        // Note: Cloudflare might accept 'fake-token' with test keys depending on specific test key behavior, but usually verifies against specific test strings. 
        // If using the "always pass" site key, we need a valid dummy token structure or it might fail on format.
        // For now, testing that it reaches the verification stage (likely 400 'Captcha verification failed' or 500 if structure is bad)
        console.log('Contact Invalid Token:', contact.status === 400 ? 'PASS' : 'FAIL', `Status: ${contact.status}, Error: ${contact.body.error}`);
    } catch (e) {
        console.log('Contact Invalid Token: FAIL', e.message);
    }
}

test();
