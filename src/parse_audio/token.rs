use crate::parse_audio::parse_error::Result;

pub trait GetToken {
  type Value;
  fn len(&self) -> usize;
  fn get(&self, array: &[u8], offset: usize) -> Result<Self::Value>;
}

pub trait Token: GetToken {
  fn put(&self, array: &[u8], offset: usize, value: Self::Value) -> usize;
}

pub struct AsciiStringToken {
  len: usize,
}

impl AsciiStringToken {
  pub fn new(len: usize) -> Self {
    AsciiStringToken { len }
  }
}

impl GetToken for AsciiStringToken {
  type Value = String;

  fn len(&self) -> usize {
    self.len
  }

  fn get(&self, array: &[u8], offset: usize) -> Result<Self::Value> {
    let str = array.iter().skip(offset).map(|x| *x as char).collect();
    Ok(str)
  }
}

pub struct UInt32LE;

impl GetToken for UInt32LE {
  type Value = u32;

  fn len(&self) -> usize {
    4
  }

  fn get(&self, array: &[u8], offset: usize) -> Result<Self::Value> {
    let num = array[offset..]
      .iter()
      .take(4)
      .fold(0, |acc, x| (acc << 8) & *x as u32);
    Ok(num)
  }
}
