"use client";
import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Activity, Cpu, Hexagon } from "lucide-react";

// 3D Core Component
function NeuralCore({ isHostile }: { isHostile: boolean }) {
  const ref = useRef<any>();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Sphere ref={ref} args={[2, 64, 64]} scale={isHostile ? 1.05 : 1}>
      <MeshDistortMaterial
        color={isHostile ? "#ff1a1a" : "#ffffff"}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.9}
        roughness={0.1}
        distort={isHostile ? 0.6 : 0.3}
        speed={isHostile ? 5 : 1}
        wireframe={!isHostile}
      />
    </Sphere>
  );
}

export default function AEON() {
  const [logs, setLogs] = useState<any[]>([]);
  const [patch, setPatch] = useState<string>("");
  const [hostile, setHostile] = useState(false);
  const [interceptCount, setInterceptCount] = useState(0);
  const [killCount, setKillCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "INTERCEPT") {
        setInterceptCount(p => p + 1);
        setLogs(prev => [...prev.slice(-9), data.payload]);
        if (data.payload.entropy > 4.5) {
          setHostile(true);
          setPatch(""); // Clear old patch to show compiling state
        }
      }
      if (data.type === "PATCH_GENERATED") {
        setPatch(data.code);
        setKillCount(p => p + 1);
        setTimeout(() => setHostile(false), 2000);
      }
    };
    return () => ws.close();
  }, []);

  return (
    <div className="flex h-screen w-full bg-black text-gray-200 font-sans overflow-hidden selection:bg-white/10">
      
      {/* 3D Core Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={2} />
          <NeuralCore isHostile={hostile} />
        </Canvas>
      </div>

      {/* Main UI Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col p-6 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-xl">
              <Hexagon size={24} className={hostile ? "text-red-500" : "text-white"} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">AEON.OS</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono mt-1">Kernel-Level Cyber Warfare</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-5 py-2 rounded-full border text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ${hostile ? 'bg-red-500/10 border-red-500/30 text-red-500 glow-red' : 'bg-white/[0.02] border-white/10 text-white/40'}`}>
              {hostile ? "Threat Detected" : "System Secure"}
            </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          
          {/* Left Column: Telemetry */}
          <div className="col-span-4 flex flex-col gap-6 h-full">
            <div className="bento-card flex-1 flex flex-col p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity size={16} className="text-white/40" />
                <h2 className="text-xs font-semibold text-white/50 tracking-widest uppercase">Live Ring-0 Telemetry</h2>
              </div>
              
              <div className="flex-1 overflow-hidden relative flex flex-col justify-end space-y-3">
                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.div 
                      key={log.payload + i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-[11px] leading-relaxed border-l border-white/10 pl-4 py-1"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/40">[{log.ip}:{log.port}]</span>
                        <div className="flex gap-4">
                          <span className="text-white/30">SZ:{log.size}</span>
                          <span className={log.entropy > 4.5 ? "text-red-400 font-bold" : "text-gray-500"}>
                            ENT:{log.entropy.toFixed(3)}
                          </span>
                        </div>
                      </div>
                      <div className="text-white/20 break-all truncate opacity-60">
                        {log.payload}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Matrix Stats */}
            <div className="bento-card h-36 p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-2">Packets Intercepted</p>
                <p className="text-4xl font-light text-white tracking-tight">{interceptCount.toLocaleString()}</p>
              </div>
              <div className="h-full w-px bg-white/5" />
              <div className="text-right">
                <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-2">Zero-Days Killed</p>
                <p className="text-4xl font-light text-red-500 tracking-tight">{killCount}</p>
              </div>
            </div>
          </div>

          {/* Right Column: AI Engine */}
          <div className="col-span-8 bento-card p-6 flex flex-col relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Cpu size={16} className="text-white/40" />
                <h2 className="text-xs font-semibold text-white/50 tracking-widest uppercase">Autonomous Patch Generation</h2>
              </div>
              <div className="px-3 py-1.5 bg-white/5 rounded-md text-[10px] text-white/40 font-mono border border-white/5 tracking-wider">QWEN-32B CODER</div>
            </div>
            
            {hostile && !patch && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1a0505]/80 backdrop-blur-md z-20">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <ShieldAlert size={56} className="text-red-500 animate-pulse" />
                  <div className="text-red-500 tracking-[0.4em] font-bold text-sm">DECOMPILING POLYMORPHIC PAYLOAD</div>
                </motion.div>
              </div>
            )}

            <div className="flex-1 bg-[#020202] border border-white/[0.03] rounded-xl p-6 overflow-y-auto font-mono text-xs leading-loose relative shadow-inner">
              {!patch && !hostile && (
                <div className="absolute inset-0 flex items-center justify-center text-white/10 tracking-[0.2em]">
                  AWAITING HOSTILE ENTROPY SPIKE
                </div>
              )}
              {patch && (
                <motion.pre 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-white/60"
                >
                  <code dangerouslySetInnerHTML={{ __html: patch.replace(/\n/g, '<br/>').replace(/(XDP_DROP|return)/g, '<span class="text-red-400">$1</span>').replace(/(int|struct|void|char)/g, '<span class="text-blue-400">$1</span>') }} />
                </motion.pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
