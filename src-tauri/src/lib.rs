#[tauri::command]
async fn audit(url: String, seed: String) -> Result<String, String> {
    Ok("OK".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![audit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
