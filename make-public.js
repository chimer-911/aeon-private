const https = require('https');

const PAT = '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';
const REPO_NAME = 'aeon-private';
const USERNAME = 'chimer-911';

async function makePublic() {
    const data = JSON.stringify({
        private: false
    });

    const options = {
        hostname: 'api.github.com',
        port: 443,
        path: `/repos/${USERNAME}/${REPO_NAME}`,
        method: 'PATCH',
        headers: {
            'Authorization': `token ${PAT}`,
            'User-Agent': 'Node.js',
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode === 200) resolve();
            else reject(new Error(`Failed: ${res.statusCode}`));
        });
        req.write(data);
        req.end();
    });
}

makePublic().then(() => console.log('Successfully made repository Open Source.')).catch(e => console.error(e.message));
