use crate::parse_audio::parse_error::{ParseError, Result};
use crate::parse_audio::token;

pub struct ApeHeader {
  footer: Footer,
  offset: usize,
}

struct TagFooter;
pub struct Footer {
  id: String,
  version: u32,
  size: usize,
  fields: usize,
  flags: TagFlags,
}

impl token::GetToken for TagFooter {
  type Value = Footer;
  fn len(&self) -> usize {
    32
  }

  fn get(&self, buffer: &[u8], offset: usize) -> Result<Self::Value> {
    Ok(Footer {
      id: token::AsciiStringToken::new(8).get(buffer, offset)?,
      version: token::UInt32LE.get(buffer, offset + 8)?,
      size: token::UInt32LE.get(buffer, offset + 12)? as usize,
      fields: token::UInt32LE.get(buffer, offset + 16)? as usize,
      flags: token::UInt32LE.get(buffer, offset + 20)?.into(),
    })
  }
}

pub struct TagFlags {
  containsHeader: bool,
  containsFooter: bool,
  isHeader: bool,
  readOnly: bool,
  dataType: DataType,
}

pub enum DataType {
  TextUtf8,
  Binary,
  ExternalInfo,
  Reserved,
}

impl From<u32> for TagFlags {
  fn from(flags: u32) -> TagFlags {
    TagFlags {
      containsHeader: is_bit_set(flags, 31),
      containsFooter: is_bit_set(flags, 30),
      isHeader: is_bit_set(flags, 31),
      readOnly: is_bit_set(flags, 0),
      dataType: match (flags & 6) >> 1 {
        0 => DataType::TextUtf8,
        1 => DataType::Binary,
        2 => DataType::ExternalInfo,
        _ => DataType::Reserved,
      },
    }
  }
}

fn is_bit_set(num: u32, bit: u32) -> bool {
  (num & (1 << bit)) != 0
}

pub fn find_ape_footer_offset(reader: &[u8], offset: usize) -> Result<ApeHeader> {
  use crate::parse_audio::read;
  use crate::parse_audio::token::GetToken;

  let mut ape_buf = vec![0; TagFooter.len()];
  read::read(
    reader,
    &mut ape_buf,
    0,
    TagFooter.len(),
    offset - TagFooter.len(),
  )?;
  let tag_footer = TagFooter.get(&ape_buf, 0)?;
  if tag_footer.id == "APETAGEX" {
    let offset = offset - tag_footer.size;
    Ok(ApeHeader {
      footer: tag_footer,
      offset,
    })
  } else {
    Err(ParseError::CannotParse)
  }
}
