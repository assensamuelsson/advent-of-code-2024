use itertools::iproduct;
use std::time::Instant;

struct KeyLocks {
    keys: Vec<i32>,
    locks: Vec<i32>,
}

impl KeyLocks {
    fn n_keys(&self) -> usize {
        self.keys.len() / 5
    }

    fn n_locks(&self) -> usize {
        self.locks.len() / 5
    }

    fn nth_key(&self, n: usize) -> &[i32] {
        &self.keys[n * 5..n * 5 + 5]
    }

    fn nth_lock(&self, n: usize) -> &[i32] {
        &self.locks[n * 5..n * 5 + 5]
    }

    fn count_fitting(&self) -> usize {
        let keys = (0..self.n_keys()).map(|i| self.nth_key(i));
        let locks = (0..self.n_locks()).map(|i| self.nth_lock(i));

        iproduct!(keys, locks)
            .filter(|(key, lock)| {
                key.iter()
                    .zip(lock.iter())
                    .map(|(k, l)| k + l)
                    .all(|t| t < 6)
            })
            .count()
    }
}

fn main() {
    let example = include_str!("example.txt");
    let input = include_str!("input.txt");

    let start = Instant::now();
    part1(input);
    println!("part 1 in {:?}", start.elapsed());

    let start = Instant::now();
    part2(input);
    println!("part 2 in {:?}", start.elapsed());
}

fn part1(input: &str) {
    let keylocks = parse(input);

    let result = keylocks.count_fitting();

    println!("{}", result);
}

fn part2(input: &str) {
    let result = 0;

    println!("{:?}", result);
}

fn parse(input: &str) -> KeyLocks {
    let mut keys: Vec<i32> = Vec::new();
    let mut locks: Vec<i32> = Vec::new();

    input.split("\n\n").for_each(|keylock| {
        let rows: Vec<&str> = keylock.split("\n").collect();
        let scehmatic = (0..5).map(|c| {
            (0..7)
                .map(|r| rows[r].chars().nth(c).unwrap())
                .filter(|d| *d == '#')
                .count() as i32
                - 1
        });
        if rows[0].starts_with("#") {
            scehmatic.for_each(|d| locks.push(d));
        } else {
            scehmatic.for_each(|d| keys.push(d));
        }
    });

    KeyLocks { keys, locks }
}
