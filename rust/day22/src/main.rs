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

fn part2(input: &str) {}

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
