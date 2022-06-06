use crate::parse_audio::parse_error::Result;

pub fn has_id3v1_header(buf: &[u8]) -> Result<bool> {
  use crate::parse_audio::read;

  if buf.len() >= 128 {
    let mut tag = [0; 3];
    read::read(&buf, &mut tag, 0, 3, buf.len() - 128)?;
    Ok(&tag == b"TAG")
  } else {
    Ok(false)
  }
}
