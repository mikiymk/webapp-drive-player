pub fn read(
  read_from: &[u8],
  write_to: &mut [u8],
  offset: usize,
  length: usize,
  position: usize,
) -> std::io::Result<usize> {
  use std::io::Read;
  (&read_from[position..position + length]).read(&mut write_to[offset..])
}

#[test]
fn test_read() {
  let read_from = [1, 2, 3, 4, 5];
  let mut write_to = [0; 3];

  read(&read_from, &mut write_to, 0, 3, 1).expect("cant write");

  assert_eq!(&[2, 3, 4], &write_to)
}
