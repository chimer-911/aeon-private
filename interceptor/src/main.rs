use std::collections::HashMap;
use tokio::net::{TcpListener, TcpStream};
use tokio::io::AsyncReadExt;
use tungstenite::{connect, Message};
use url::Url;
use serde_json::json;

fn calculate_shannon_entropy(data: &[u8]) -> f64 {
    let mut frequency = HashMap::new();
    for &byte in data {
        *frequency.entry(byte).or_insert(0) += 1;
    }
    let mut entropy = 0.0;
    let len = data.len() as f64;
    for &count in frequency.values() {
        let p = count as f64 / len;
        entropy -= p * p.log2();
    }
    entropy
}

async fn handle_connection(mut stream: TcpStream) {
    let mut buffer = vec![0; 4096];
    let peer_addr = stream.peer_addr().unwrap();
    println!("Connection intercepted from: {}", peer_addr);

    loop {
        match stream.read(&mut buffer).await {
            Ok(0) => break,
            Ok(n) => {
                let payload = &buffer[..n];
                let entropy = calculate_shannon_entropy(payload);
                let hex_dump = hex::encode(payload);
                
                println!("Packet Size: {} bytes | Entropy: {:.4}", n, entropy);

                // Send to Core Control Plane via WebSocket
                if let Ok((mut socket, _response)) = connect(Url::parse("ws://127.0.0.1:4000").unwrap()) {
                    let msg = json!({
                        "event": "packet_intercepted",
                        "ip": peer_addr.ip().to_string(),
                        "port": peer_addr.port(),
                        "size": n,
                        "entropy": entropy,
                        "payload": hex_dump
                    });
                    let _ = socket.send(Message::Text(msg.to_string()));
                }
            }
            Err(_) => break,
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("AEON RUST INTERCEPTOR BOOTING...");
    println!("Initializing TCP Honeypot Bindings...");

    let listener = TcpListener::bind("0.0.0.0:8080").await?;
    println!("Listening for hostile inbound traffic on 0.0.0.0:8080");

    loop {
        let (stream, _) = listener.accept().await?;
        tokio::spawn(async move {
            handle_connection(stream).await;
        });
    }
}
