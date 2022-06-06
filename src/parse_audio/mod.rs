mod parse_error;
mod read;
mod token;

mod ape_v2;
mod id3v1;
mod lyrics3;

use crate::parse_audio::parse_error::Result;

pub fn scan_appending_headers(buf: &[u8]) -> Result<()> {
  let offset = buf.len()
    - if id3v1::has_id3v1_header(&buf)? {
      128 + lyrics3::get_lyrics_header_length(&buf)?
    } else {
      0
    };

  ape_v2::find_ape_footer_offset(&buf, offset)?;
  Ok(())
}
