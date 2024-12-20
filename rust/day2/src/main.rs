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
    let result = parse(input).iter().filter(|v| v.is_safe()).count();

    println!("{result}");
}

fn part2(input: &str) {
    let result = parse(input)
        .iter()
        .filter(|v| v.is_safe_with_dampening())
        .count();

    println!("{result}");
}

struct Report(Vec<i32>);
impl From<&str> for Report {
    fn from(s: &str) -> Self {
        Report(
            s.split_whitespace()
                .map(|num| num.parse().unwrap())
                .collect(),
        )
    }
}

impl Report {
    fn is_safe(&self) -> bool {
        let mut increasing: Option<bool> = None;
        for i in 1..self.0.len() {
            let diff = self.0[i] - self.0[i - 1];
            let abs_diff = diff.abs();
            if increasing.is_none() {
                increasing = Some(diff > 0);
            }
            if !(1..=3).contains(&abs_diff) || increasing.unwrap() != (diff > 0) {
                return false;
            }
        }
        true
    }

    fn is_safe_with_dampening(&self) -> bool {
        (0..self.0.len()).any(|i| {
            let mut modified = self.0.clone();
            modified.remove(i);
            Report(modified).is_safe()
        })
    }
}

fn parse(input: &str) -> Vec<Report> {
    input.lines().map(Report::from).collect()
}
