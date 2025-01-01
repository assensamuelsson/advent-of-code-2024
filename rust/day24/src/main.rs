use std::{collections::HashMap, time::Instant};

#[derive(Debug)]
struct Unknown<'a> {
    op: &'a str,
    from: (&'a str, &'a str),
}

fn main() {
    let example1 = include_str!("example1.txt");
    let example2 = include_str!("example2.txt");
    let input = include_str!("input.txt");
    let input_corrected = include_str!("input_corrected.txt");

    let start = Instant::now();
    part1(input);
    println!("part 1 in {:?}", start.elapsed());

    let start = Instant::now();
    part2(input_corrected);
    println!("part 2 in {:?}", start.elapsed());
}

fn part1(input: &str) {
    let (mut knowns, mut unknowns) = parse_wires(input);
    settle_wires(&mut knowns, &mut unknowns);
    let result = to_number(&knowns, "z");

    println!("{:?}", result);
}

fn part2(input: &str) {
    let (mut knowns, mut unknowns) = parse_wires(input);
    // let graph = print_mermaid_flow_graph(&unknowns);
    // println!("{graph}");
    // settle_wires(&mut knowns, &mut unknowns);

    // let x = to_number(&knowns, "x");
    // let y = to_number(&knowns, "y");
    // let z = to_number(&knowns, "z");

    // println!("0{:b}", x);
    // println!("0{:b}", y);
    // println!("{:b}", z);
    // println!("{:b}", x + y);

    let mut knowns: HashMap<String, bool> = HashMap::new();
    let x = (1u64 << 44) - 1;
    let y = 1;
    add_to_known(x, "x", 45, &mut knowns);
    add_to_known(y, "y", 45, &mut knowns);
    settle_wires(&mut knowns, &mut unknowns);
    let z = to_number(&knowns, "z");
    println!("{:b}", x);
    println!("{:b}", y);
    println!("{:b}", z);

    //444443333333333222222222211111111110000000000
    //432109876543210987654321098765432109876543210
    //011111100000000000000000000001000011111111111
    //100000000000001111111111111111111111111111111

    // Dessa är fel
    // dvh AND hnn -> z11 -> rpv
    // hnn XOR dvh -> rpv -> z11
    // y15 AND x15 -> ctg -> rpb
    // x15 XOR y15 -> rpb -> ctg
    // bvk OR trm -> z38 -> dvq
    // hhv XOR pqr -> dvq -> z38
    // x31 AND y31 -> z31 -> dmh
    // fgs XOR ctw -> dmh -> z31

    let mut swapped = ["rpv", "z11", "rpb", "ctg", "dvq", "z38", "dmh", "z31"];
    swapped.sort();

    println!("{}", swapped.join(","));
}

fn parse_wires(input: &str) -> (HashMap<String, bool>, HashMap<String, Unknown>) {
    let mut parts = input.split("\n\n");
    let knowns = parts
        .next()
        .unwrap()
        .lines()
        .map(|l| {
            let mut gate_iter = l.split(": ");
            let name = gate_iter.next().unwrap().to_string();
            let value = gate_iter.next().unwrap() == "1";
            (name, value)
        })
        .collect::<HashMap<_, _>>();

    let unknowns = parts
        .next()
        .unwrap()
        .lines()
        .map(|l| {
            let mut gate_iter = l.split(" -> ");
            let (inputs, name) = (
                gate_iter.next().unwrap(),
                gate_iter.next().unwrap().to_string(),
            );

            let mut unknown_iter = inputs.split_whitespace();
            let i1 = unknown_iter.next().unwrap();
            let op = unknown_iter.next().unwrap();
            let i2 = unknown_iter.next().unwrap();
            let unknown = Unknown { op, from: (i1, i2) };

            (name, unknown)
        })
        .collect::<HashMap<_, _>>();

    (knowns, unknowns)
}

fn settle_wires(knowns: &mut HashMap<String, bool>, unknowns: &mut HashMap<String, Unknown>) {
    while !unknowns.is_empty() {
        let mut to_remove = vec![];
        for (name, unknown) in unknowns.iter() {
            let (i1, i2) = unknown.from;
            if let (Some(&val1), Some(&val2)) = (knowns.get(i1), knowns.get(i2)) {
                let result = match unknown.op {
                    "AND" => val1 && val2,
                    "OR" => val1 || val2,
                    "XOR" => val1 ^ val2,
                    _ => false,
                };
                knowns.insert(name.clone(), result);
                to_remove.push(name.clone());
            }
        }
        for name in to_remove {
            unknowns.remove(&name);
        }
    }
}

fn to_number(knowns: &HashMap<String, bool>, prefix: &str) -> u64 {
    knowns
        .iter()
        .filter(|(name, _)| name.starts_with(prefix))
        .fold(0, |acc, (name, &value)| {
            let exp: u32 = name[1..].parse().unwrap();
            acc + if value { 2u64.pow(exp) } else { 0 }
        })
}

fn add_to_known(number: u64, prefix: &str, max_bit: u32, knowns: &mut HashMap<String, bool>) {
    let mut bit = 0;

    while bit < max_bit {
        let name = format!("{}{:02}", prefix, bit);
        let value = number & (2u64.pow(bit)) > 0;
        knowns.insert(name, value);
        bit += 1
    }
}

fn print_mermaid_flow_graph(unknowns: &HashMap<String, Unknown>) -> String {
    let mut result = String::from("graph TD\n");

    for (name, unknown) in unknowns {
        let (i1, i2) = unknown.from;
        result.push_str(&format!("    {} -->|{}| {}\n", i1, unknown.op, name));
        result.push_str(&format!("    {} -->|{}| {}\n", i2, unknown.op, name));
    }

    result
}
