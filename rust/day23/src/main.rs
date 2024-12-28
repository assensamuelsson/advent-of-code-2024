use std::{
    collections::{HashMap, HashSet},
    time::Instant,
};

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
    let computers = parse_computers(input);
    let result = find_triangle_network(&computers)
        .iter()
        .filter(|triangle| triangle.iter().any(|c| c.starts_with("t")))
        .count();

    println!("{:?}", result);
}

fn part2(input: &str) {
    let computers = parse_computers(input);
    let mut lan = find_largest_lan(&computers);
    lan.sort();
    let result = lan.join(",");

    println!("{:?}", result);
}

type Network<'a> = HashMap<&'a str, HashSet<&'a str>>;

fn parse_computers(input: &str) -> Network {
    input.lines().fold(HashMap::new(), |mut computers, line| {
        let c1 = &line[0..2];
        let c2 = &line[3..5];
        computers.entry(c1).or_default().insert(c2);
        computers.entry(c2).or_default().insert(c1);
        computers
    })
}

fn find_triangle_network<'a>(computers: &'a Network<'a>) -> Vec<Vec<&'a str>> {
    let mut triangles = Vec::new();

    for (&c1, neighbors1) in computers {
        for &c2 in neighbors1 {
            if c1 < c2 {
                if let Some(neighbors2) = computers.get(c2) {
                    for &c3 in neighbors2 {
                        if c2 < c3 && neighbors1.contains(c3) {
                            triangles.push(vec![c1, c2, c3]);
                        }
                    }
                }
            }
        }
    }

    triangles
}

fn find_largest_lan<'a>(computers: &'a Network) -> Vec<&'a str> {
    let mut largest_lan = HashSet::new();

    for (main_computer, connections) in computers {
        let mut lan = HashSet::from([*main_computer]);

        for connected_computer in connections {
            if lan
                .iter()
                .all(|c| computers[connected_computer].contains(c))
            {
                lan.insert(connected_computer);
            }
        }

        if lan.len() > largest_lan.len() {
            largest_lan = lan;
        }
    }

    largest_lan.into_iter().collect()
}
