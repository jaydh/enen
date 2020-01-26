use rocket::State;
use rocket_contrib::json::{Json, JsonValue};
use diesel::prelude::*;
use super::schema::users::dsl::*;
use crate::db::PgPool;
use super::models::User;
use bcrypt::{DEFAULT_COST, hash, verify};
use diesel::result;
extern crate bcrypt;


#[derive(Serialize, Deserialize)]
pub struct Credentials {
    username: String,
    password: String
}

#[derive(Responder, Debug)]
#[response(status = 401, content_type = "json")]
pub struct InvadlidCredentialsError {
    error: String
}

#[derive(Responder, Debug)]
#[response(status = 400, content_type = "json")]
pub struct UserExistError {
    username: String
}

#[post("/auth/login", format = "json", data = "<credentials>")]
pub fn login(pool: State<PgPool>, credentials: Json<Credentials>) -> Result<JsonValue, InvadlidCredentialsError> {
    let connection = pool.get().unwrap();
    let user: Result<User, diesel::result::Error> = users.filter(username.eq(&credentials.0.username)).first(&connection);
    match user {
        Ok(v) => {
            let valid = verify(&credentials.0.password, &v.passwordhash);
            match valid {
                Ok(v) => {
                    if v == true {
                        Ok(rocket_contrib::json!({
                            "success": true,
                        }))
                    } else {
                        Err(InvadlidCredentialsError {
                            error: String::from("Invalid Credentials")
                        })
                    }
                }
                Err(_e) => Err(InvadlidCredentialsError {
                    error: String::from("Unable to verify Credentials")
                })
            }
        },
        Err(_e) => Err(InvadlidCredentialsError {
                    error: String::from("Unable to verify Credentials")
                })
    }
}

#[post("/auth/register", format = "json", data = "<credentials>")]
pub fn register_new_user(pool: State<PgPool>, credentials: Json<Credentials>) -> Result<JsonValue, UserExistError> {
    let connection = pool.get().unwrap();
    let user: Result<User, result::Error> = 
             users.filter(username.eq(&credentials.0.username)).first::<User>(&connection);
    match user {
        Ok(_v) => Err(UserExistError {
            username: credentials.0.username
        }),
        Err(_e) => { 
                let hashed_password = hash(&credentials.0.password, DEFAULT_COST).unwrap();
                let connection = pool.get().unwrap();
                let res = diesel::insert_into(users)
                    .values((&username.eq(&credentials.0.username), &passwordhash.eq(&hashed_password)))
                    .execute(&connection);
                match res {
                    Ok(_v) => Ok(rocket_contrib::json!({
                    "success": true,
                    "passwordhash": hashed_password
                    })),
                    Err(_e) => Err(UserExistError{ username: String::from(&credentials.0.username) })
                }
        }
    }
}
