# AEON: Autonomous Exploitation & Offensive Neutralization

AEON is a kernel-level autonomous cyber-defense infrastructure designed for real-time mitigation of AI-generated polymorphic exploits. It operates by intercepting network telemetry at the ingress point and performing high-speed heuristic analysis via Shannon entropy and Kolmogorov complexity metrics.

## System Architecture

### 1. Ingress Interceptor (Rust)
The interceptor is implemented in Rust for memory safety and zero-cost abstractions. It utilizes a high-performance asynchronous runtime to analyze packet payloads without introducing significant latency.
- **Binary Entropy Analysis:** Calculates the Shannon entropy of incoming payloads to detect packed or encrypted zero-day malware.
- **Telemetry Streaming:** Forwards analyzed metrics to the control plane via WebSockets.

### 2. Control Plane (Node.js)
The control plane orchestrates the distributed telemetry and interfaces with large language models (LLMs) for automated payload reverse engineering.
- **Heuristic Filtering:** Validates incoming threats based on statistical anomaly thresholds.
- **Autonomous Patch Generation:** Interfaces with specialized coding LLMs (Qwen-2.5-Coder) to decompile hostile bytecode and generate localized eBPF XDP hot-patches.

### 3. Command Center (Next.js 14 + WebGL)
The visualization layer provides a high-fidelity 3D representation of the active threat landscape using WebGL and WebGPU-compatible shaders.
- **Neural Core Visualization:** Renders a 3D MeshDistort core that reacts to the mathematical entropy of the intercepted traffic.
- **Bento Dashboard:** Compartmentalizes real-time kernel logs and AI reasoning streams.

## Technical Specifications
- **Language Stack:** Rust (Interception), TypeScript/Node.js (Orchestration), React (UI).
- **Communication Protocol:** Binary-serialized WebSockets for low-latency telemetry.
- **Heuristic Engine:** Shannon Entropy (H = -Σ p(x) log2 p(x)).
- **AI Model:** Qwen-2.5-Coder-32B (via Pollinations Inference).

## Deployment

### Prerequisites
- Node.js >= 20.0
- Rust / Cargo toolchain
- Npcap (Windows) or libpcap (Linux)

### Execution
1. **Control Plane:**
   ```bash
   cd core && npm install && node server.js
   ```
2. **Interceptor:**
   ```bash
   cd interceptor && cargo run
   ```
3. **Command Center:**
   ```bash
   cd ui && npm install && npm run dev
   ```

## License
MIT License. Distributed for research and defensive application development.
