use rocket::State;
use rocket_contrib::json::{Json, JsonValue};
use diesel::prelude::*;
use super::schema::users::dsl::*;

#[derive(Serialize, Deserialize)]
pub struct Credentials {
    username: String,
    password: String,
}


#[post("/auth/login", format = "json", data = "<credentials>")]
pub fn login(pool: State<Pool>, credentials: Json<Credentials>) -> JsonValue {
    let products_request = users.load(&*pool).expect(" blah"); 
    rocket_contrib::json!({
        "success": true,
        "username": credentials.0.username,
        "password": credentials.0.password
    })
}
