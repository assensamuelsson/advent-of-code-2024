type FileSystem = {
  head: number,
  tail: number,
  buf: (number | null)[]
};

export function part1(input: string) {
  const fs = parse(input);
  while (!move(fs));
  const result = fs.buf
    .map((v, i) => v !== null ? v * i : 0)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function part2(input: string) {
  const fs = parse(input);
  while (!moveWhole(fs));
  const result = fs.buf
    .map((v, i) => v !== null ? v * i : 0)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function parse(input: string): FileSystem {
  const nums = input.split("").map(Number);
  const buf = nums
    .map((num, i) => i % 2 === 0 ? Array(num).fill(i / 2) : Array(num).fill(null))
    .flat();

  return {
    head: buf.indexOf(null),
    tail: buf.length - 1,
    buf,
  };
}

export function move(fs: FileSystem): boolean {
  while (fs.buf[fs.head] !== null) fs.head++;
  while (fs.buf[fs.tail] === null) fs.tail--;

  fs.buf[fs.head] = fs.buf[fs.tail];
  fs.buf[fs.tail] = null;
  fs.head++;
  fs.tail--;

  return fs.head >= fs.tail;
}

export function moveWhole(fs: FileSystem): boolean {
  while (fs.buf[fs.head] !== null) fs.head++;
  while (fs.buf[fs.tail] === null) fs.tail--;

  const tailValue = fs.buf[fs.tail];
  let fileLength = 1;
  while (fs.buf[fs.tail - 1] === tailValue) {
    fs.tail--;
    fileLength++;
  }

  while (fs.buf.slice(fs.head, fs.head + fileLength).some((v) => v !== null) && fs.head < fs.tail) fs.head++;
  if (fs.head < fs.tail) {
    while (fileLength) {
      fs.buf[fs.head + fileLength - 1] = fs.buf[fs.tail + fileLength - 1];
      fs.buf[fs.tail + fileLength - 1] = null;
      fileLength--;
    }
  }

  fs.head = fs.buf.indexOf(null);
  while (fs.buf[fs.tail] === null || fs.buf[fs.tail] === tailValue) fs.tail--;

  return fs.head >= fs.tail;
}
