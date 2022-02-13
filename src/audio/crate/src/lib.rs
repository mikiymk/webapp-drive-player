use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn read_from_slice(slice: &[u8]) -> String {
    match id3::Tag::read_from(slice) {
        Ok(tag) => tag_to_json(tag),
        Err(err) => error_to_json(err),
    }
}

fn tag_to_json(tag: id3::Tag) -> String {
    use id3::Version::{Id3v22, Id3v23, Id3v24};

    let version = match tag.version() {
        Id3v22 => "id3v2.2",
        Id3v23 => "id3v2.3",
        Id3v24 => "id3v2.4",
    };

    let frames: Vec<_> = tag
        .frames()
        .map(|frame| format!(r#""{}" : "{:?}""#, frame.id(), frame.content()))
        .collect();

    // let extended_texts: Vec<_> = tag.extended_texts().collect();
    // let extended_links: Vec<_> = tag.extended_links().collect();
    // let encapsulated_objects: Vec<_> = tag.encapsulated_objects().collect();
    // let comments: Vec<_> = tag.comments().collect();
    // let lyrics: Vec<_> = tag.lyrics().collect();
    // let synchronized_lyrics: Vec<_> = tag.synchronised_lyrics().collect();
    // let chapters: Vec<_> = tag.chapters().collect();

    // use id3::TagLike;
    // let title = tag.title();
    // let album = tag.album();
    // let album_artist = tag.album_artist();
    // let artist = tag.artist();
    // let year = tag.year();
    // let date_recorded = tag.date_recorded();
    // let date_released = tag.date_released();
    // let genre = tag.genre();
    // let disc = tag.disc();
    // let total_discs = tag.total_discs();
    // let track = tag.track();
    // let total_tracks = tag.total_tracks();
    // let duration = tag.duration();

    format!(
        r#""version": "{}", "contents": {{ {:?} }}"#,
        version, frames,
    )
}

fn error_to_json(error: id3::Error) -> String {
    match error.partial_tag {
        Some(tag) => {
            format!("error :{}", tag_to_json(tag))
        }
        None => r#"error"#.to_string(),
    }
}
