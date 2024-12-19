use std::{collections::HashMap, time::Instant};

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
    let (mut v1, mut v2) = parse(input);
    v1.sort_unstable();
    v2.sort_unstable();

    let result = v1
        .iter()
        .zip(v2.iter())
        .map(|(a, b)| (a - b).abs())
        .fold(0, |acc, curr| acc + curr);

    println!("{result}");
}

fn part2(input: &str) {
    let (v1, v2) = parse(input);
    let occ = occurrences(&v2);

    let result = v1
        .iter()
        .fold(0, |acc, v| acc + v * occ.get(v).unwrap_or(&0));

    println!("{result}");
}

fn parse(input: &str) -> (Vec<i32>, Vec<i32>) {
    let mut v1: Vec<i32> = Vec::new();
    let mut v2: Vec<i32> = Vec::new();

    for line in input.lines() {
        let mut numbers = line.split_whitespace();
        if let (Some(num1), Some(num2)) = (numbers.next(), numbers.next()) {
            if let (Ok(n1), Ok(n2)) = (num1.parse(), num2.parse()) {
                v1.push(n1);
                v2.push(n2);
            }
        }
    }

    (v1, v2)
}

fn occurrences(v: &[i32]) -> HashMap<i32, i32> {
    v.iter().fold(HashMap::new(), |mut map, &value| {
        *map.entry(value).or_insert(0) += 1;
        map
    })
}
