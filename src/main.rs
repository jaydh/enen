#![feature(proc_macro_hygiene, decl_macro)]
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate diesel;

extern crate dotenv;
extern crate r2d2;
extern crate r2d2_diesel;


use dotenv::dotenv;
use rocket::response::NamedFile;
use std::io;
use std::path::{Path, PathBuf};

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


mod db;
mod schema;
mod auth;
mod models;

fn main() {
    dotenv().ok();

        
    print!("launch");
    let pool = db::get_connect();
    rocket::ignite()
        .manage(pool)
        .mount("/", routes![index, files, auth::login, auth::register_new_user])
        .launch();
}
