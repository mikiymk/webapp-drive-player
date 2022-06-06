use crate::parse_audio::parse_error::Result;

const END_TAG_2: &str = "LYRICS200";

pub fn get_lyrics_header_length(reader: &[u8]) -> Result<usize> {
  use crate::parse_audio::read;

  if reader.len() >= 143 {
    let mut buf = [0; 15];
    read::read(reader, &mut buf, 0, 15, reader.len() - 143)?;
    let txt: String = buf.iter().map(|x| *x as char).collect();
    if &txt[6..] == END_TAG_2 {
      return Ok(txt[0..6].parse().unwrap_or(0) + 15);
    }
  }
  return Ok(0);
}
