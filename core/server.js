const express = require('express');
const { WebSocketServer } = require('ws');
const fetch = require('node-fetch');

// WS for UI (port 4001)
const wssUI = new WebSocketServer({ port: 4001 });
let uiClients = [];
wssUI.on('connection', (ws) => {
    uiClients.push(ws);
    ws.on('close', () => { uiClients = uiClients.filter(c => c !== ws); });
});

function broadcastToUI(data) {
    uiClients.forEach(ws => {
        if (ws.readyState === 1) ws.send(JSON.stringify(data));
    });
}

// Real AI Decompiler Logic using a real LLM API
async function decompileWithAI(payload, entropy) {
    try {
        const prompt = `Analyze this raw hex payload from a cyber attack. Entropy: ${entropy}. Payload: ${payload}. 
        Reverse engineer its intent and write a minimal C code hot-patch for an eBPF XDP filter to neutralize it. 
        Return ONLY the C code. No conversation.`;
        
        // Using Pollinations.ai for a real, free AI text generation (Llama-3 based)
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
        const code = await response.text();
        return code;
    } catch (e) {
        return `// AI Engine Offline: Failed to generate patch\n// Error: ${e.message}`;
    }
}

// WS for Rust Interceptor (port 4000)
const wssRust = new WebSocketServer({ port: 4000 });
wssRust.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const data = JSON.parse(message.toString());
        if (data.event === 'packet_intercepted') {
            broadcastToUI({ type: 'INTERCEPT', payload: data });

            // Real Threat Threshold (based on Shannon entropy)
            if (data.entropy > 4.5) {
                broadcastToUI({ type: 'THREAT_DETECTED', entropy: data.entropy });

                // REAL AI Generation
                const realPatch = await decompileWithAI(data.payload, data.entropy);
                broadcastToUI({ type: 'PATCH_GENERATED', code: realPatch });
            }
        }
    });
});

console.log('AEON Core Plane Online. AI Engine: ACTIVE (Pollinations/Llama-3).');
