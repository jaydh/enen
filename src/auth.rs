use rocket::State;
use rocket_contrib::json::{Json, JsonValue};
use diesel::prelude::*;
use super::schema::users::dsl::*;
use crate::db::PgPool;

#[derive(Queryable, Serialize, Deserialize)]
pub struct Credentials {
    id: i32,
    username: String,
    passwordhash: Option<String>,
    emailaddress: Option<String>,
}

#[post("/auth/login", format = "json", data = "<credentials>")]
pub fn login(pool: State<PgPool>, credentials: Json<Credentials>) -> JsonValue {
    let connection = pool.get().unwrap();
    let products_request: Vec<Credentials> = users.load(&connection).expect(" blah");
    rocket_contrib::json!({
        "success": true,
        "username": credentials.0.username,
        "password": credentials.0.passwordhash
    })
}
