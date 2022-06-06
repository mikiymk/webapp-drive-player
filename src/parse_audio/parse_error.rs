#[derive(Debug)]
pub enum ParseError {
  CannotParse,
}

pub type Result<T> = std::result::Result<T, ParseError>;

impl From<std::io::Error> for ParseError {
  fn from(_: std::io::Error) -> ParseError {
    ParseError::CannotParse
  }
}
