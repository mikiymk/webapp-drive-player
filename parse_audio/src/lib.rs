// #![no_std]

use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn parse_audio(buffer: &[u8]) -> String {
    "".to_string()
}
