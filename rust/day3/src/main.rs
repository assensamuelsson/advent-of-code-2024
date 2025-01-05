use regex::Regex;
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
    let result: u32 = find_instructions(input)
        .iter()
        .filter_map(|i| {
            if let Instruction::Mul(n1, n2) = i {
                Some(n1 * n2)
            } else {
                None
            }
        })
        .sum();

    println!("{:?}", result);
}

fn part2(input: &str) {
    let result: u32 = find_instructions(input)
        .iter()
        .scan(true, |enabled, instruction| match instruction {
            Instruction::Do => {
                *enabled = true;
                Some(0)
            }
            Instruction::Dont => {
                *enabled = false;
                Some(0)
            }
            Instruction::Mul(n1, n2) => {
                if *enabled {
                    Some(n1 * n2)
                } else {
                    Some(0)
                }
            }
        })
        .sum();

    println!("{:?}", result);
}

#[derive(Debug)]
enum Instruction {
    Mul(u32, u32),
    Dont,
    Do,
}

fn find_instructions(input: &str) -> Vec<Instruction> {
    let re = Regex::new(r"(mul|don't|do)\((?:(\d+),(\d+))?\)").unwrap();

    re.captures_iter(input)
        .filter_map(|cap| match &cap[1] {
            "mul" => {
                let n1 = cap[2].parse().unwrap();
                let n2 = cap[3].parse().unwrap();
                Some(Instruction::Mul(n1, n2))
            }
            "don't" => Some(Instruction::Dont),
            "do" => Some(Instruction::Do),
            _ => None,
        })
        .collect()
}
