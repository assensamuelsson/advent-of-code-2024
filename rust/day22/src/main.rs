use itertools::Itertools;
use std::collections::hash_map::DefaultHasher;
use std::collections::HashMap;
use std::hash::{Hash, Hasher};
use std::time::Instant;

fn main() {
    let input = include_str!("input.txt");

    let start = Instant::now();
    part1(input);
    println!("part 1 in {:?}", start.elapsed());

    let start = Instant::now();
    part2(input);
    println!("part 2 in {:?}", start.elapsed());
}

fn part1(input: &str) {
    let result = input
        .lines()
        .map(|s| s.parse::<u64>().unwrap())
        .map(|s| evolve_n_times(s, 2000))
        .sum::<u64>();

    println!("{}", result);
}

fn part2(input: &str) {
    let mut map: HashMap<u64, i32> = HashMap::new();

    input
        .lines()
        .map(|s| s.parse::<u64>().unwrap())
        .for_each(|secret| {
            let mut first_found_map: HashMap<u64, i32> = HashMap::new();

            (0..2000)
                .scan(secret, |state, i| {
                    if i == 0 {
                        Some(secret)
                    } else {
                        *state = evolve(*state);
                        Some(*state)
                    }
                })
                .map(|digit| (digit % 10) as i32)
                .tuple_windows()
                .for_each(|(a, b, c, d, e)| {
                    let mut hasher = DefaultHasher::new();
                    hasher.write_i32(b - a);
                    hasher.write_i32(c - b);
                    hasher.write_i32(c - d);
                    hasher.write_i32(e - d);
                    let key = hasher.finish();
                    first_found_map.entry(key).or_insert(e);
                });

            for (key, value) in first_found_map {
                *map.entry(key).or_insert(0) += value;
            }
        });

    let result = map.values().max().unwrap_or(&0);
    println!("{}", result);
}

fn mix(value: u64, secret: u64) -> u64 {
    value ^ secret
}

fn prune(secret: u64) -> u64 {
    secret % 16777216
}

fn evolve(secret: u64) -> u64 {
    let secret = prune(mix(secret * 64, secret));
    let secret = prune(mix(secret / 32, secret));
    prune(mix(secret * 2048, secret))
}

fn evolve_n_times(mut secret: u64, n: usize) -> u64 {
    for _ in 0..n {
        secret = evolve(secret)
    }
    secret
}
