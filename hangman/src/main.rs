use actix_web::{web, App, HttpServer, Result};
use actix_files as fs;
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Deserialize)]
struct CodeInput {
    code: String,
}

#[derive(Serialize)]
struct CodeOutput {
    output: String,
}

async fn run_code(code: web::Json<CodeInput>) -> Result<web::Json<CodeOutput>> {
    let temp_dir = tempfile::tempdir().unwrap();
    let file_path = temp_dir.path().join("temp.rs");
    std::fs::write(&file_path, &code.code).unwrap();

    let output = Command::new("rustc")
        .arg(&file_path)
        .arg("--out-dir")
        .arg(temp_dir.path())
        .output()
        .expect("Failed to compile");

    if !output.status.success() {
        return Ok(web::Json(CodeOutput {
            output: String::from_utf8_lossy(&output.stderr).to_string(),
        }));
    }

    let executable = temp_dir.path().join("temp");
    let output = Command::new(executable)
        .output()
        .expect("Failed to execute");

    Ok(web::Json(CodeOutput {
        output: String::from_utf8_lossy(&output.stdout).to_string(),
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting server at http://127.0.0.1:8090");
    HttpServer::new(|| {
        App::new()
            .service(fs::Files::new("/", "./static").index_file("index.html"))
            .route("/run", web::post().to(run_code))
    })
    .bind("127.0.0.1:8090")?
    .run()
    .await
}