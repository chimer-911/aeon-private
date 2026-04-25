const { execSync } = require('child_process');
const https = require('https');

const PAT = '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';
const REPO_NAME = 'aeon-private';
const USERNAME = 'chimer-911';

async function createRepo() {
    const data = JSON.stringify({
        name: REPO_NAME,
        private: true,
        description: 'Proprietary AEON Autonomous Cyber Warfare Engine'
    });

    const options = {
        hostname: 'api.github.com',
        port: 443,
        path: '/user/repos',
        method: 'POST',
        headers: {
            'Authorization': `token ${PAT}`,
            'User-Agent': 'Node.js',
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode === 201) resolve();
            else reject(new Error(`Failed to create repo: ${res.statusCode}`));
        });
        req.write(data);
        req.end();
    });
}

async function main() {
    try {
        console.log('Creating private repository...');
        await createRepo();
        console.log('Repository created.');

        const commands = [
            'git init',
            `git remote add origin https://${PAT}@github.com/${USERNAME}/${REPO_NAME}.git`,
            'git add .',
            'git commit -m "feat: initial proprietary deploy of AEON core architecture"',
            'git branch -M main',
            'git push -u origin main'
        ];

        console.log('Pushing to GitHub...');
        for (const cmd of commands) {
            execSync(cmd, { cwd: 'C:\\Users\\aryam\\aeon', stdio: 'inherit' });
        }
        console.log('Successfully deployed to private repository.');
    } catch (e) {
        console.error('Error:', e.message);
    }
}

main();
