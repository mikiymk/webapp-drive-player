use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

mod parse_audio;

#[wasm_bindgen]
pub fn parse_audio(buffer: &[u8]) -> Option<u8> {
    parse_audio::scan_appending_headers(&buffer).unwrap();
    Some(buffer[0])
}
