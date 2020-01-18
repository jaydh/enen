#![feature(proc_macro_hygiene, decl_macro)]
#[macro_use]
extern crate rocket;

use std::io;
use std::path::{Path, PathBuf};

use rocket::response::NamedFile;

#[get("/")]
fn index() -> io::Result<NamedFile> {
    print!("get index");
    NamedFile::open("frontend/build/index.html")
}

#[get("/<file..>")]
fn files(file: PathBuf) -> Option<NamedFile> {
    print!("get file");
        NamedFile::open(Path::new("frontend/build/").join(file)).ok()
}

fn main() {
    print!("launch");
        rocket::ignite().mount("/", routes![index, files]).launch();
}
