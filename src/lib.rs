use serde::Serialize;
use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Serialize)]
struct AudioInfo {
    title: String,
    artists: Vec<String>,
    album: String,
    albumartist: String,

    track: u32,
    track_of: u32,
    disk: u32,
    disk_of: u32,
    date: String,
    genre: Vec<String>,

    picture: Vec<Vec<u8>>,
}

#[wasm_bindgen]
pub fn parse_audio(buffer: &[u8]) -> Option<String> {
    let info = if let Some(info) = parse_id3(buffer) {
        Some(info)
    } else {
        None
    };

    info.and_then(|x| serde_json::to_string(&x).ok())
}

fn parse_id3(buffer: &[u8]) -> Option<AudioInfo> {
    use id3::{Tag, TagLike};

    let tag = Tag::read_from(buffer).ok()?;

    Some(AudioInfo {
        title: tag.title().unwrap_or("").to_string(),
        artists: tag
            .artists()
            .unwrap_or(vec![])
            .iter()
            .map(|x| x.to_string())
            .collect(),
        album: tag.album().unwrap_or("").to_string(),
        albumartist: tag.album_artist().unwrap_or("").to_string(),

        track: tag.track().unwrap_or(0),
        track_of: tag.total_tracks().unwrap_or(0),
        disk: tag.disc().unwrap_or(0),
        disk_of: tag.total_discs().unwrap_or(0),

        date: tag
            .date_released()
            .map_or("".to_string(), |x| x.to_string()),
        genre: tag
            .genres()
            .unwrap_or(vec![])
            .iter()
            .map(|x| x.to_string())
            .collect(),
        picture: tag.pictures().map(|x| x.data.clone()).collect(),
    })
}
