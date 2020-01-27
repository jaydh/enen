use rocket::State;
use rocket_contrib::json::{Json, JsonValue};
use diesel::prelude::*;
use super::schema::users::dsl::*;
use crate::db::PgPool;
use super::models::User;
use bcrypt::{DEFAULT_COST, hash, verify};
use diesel::result;
use rocket::http::{Cookie, Cookies};
use frank_jwt::{Algorithm, encode, decode};
extern crate bcrypt;

#[derive(Serialize, Deserialize)]
pub struct Credentials {
    username: String,
    password: String
}

#[derive(Serialize, Deserialize)]
pub struct EmailAddressPayload {
    email_address: String,
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

#[post("/auth/login", data = "<credentials>")]
pub fn login(pool: State<PgPool>, credentials: Json<Credentials>, mut cookies: Cookies) -> Result<JsonValue, InvadlidCredentialsError> {
    let connection = pool.get().unwrap();
    let user: Result<User, diesel::result::Error> = users.filter(username.eq(&credentials.0.username)).first(&connection);
    match user {
        Ok(db_user) => {
            let valid = verify(&credentials.0.password, &db_user.passwordhash);
            match valid {
                Ok(v) => {
                    if v {
                        let jwt: Result<String, frank_jwt::error::Error> = get_user_id_jwt(&db_user);
                        match jwt {
                            Ok(valid_jwt) => {
                                let cookie = Cookie::build("userIdJWT", valid_jwt)
                                                 .same_site(rocket::http::SameSite::None)
                                                 .path("/")
                                                 .secure(true)
                                                 .finish();

                                print!("{} ", &cookie);
                                cookies.add_private(cookie);
                                Ok(rocket_contrib::json!({
                                    "success": true,
                                }))
                            },
                            Err(_e) => {
                                Err(InvadlidCredentialsError {
                                    error: String::from("Invalid Credentials")
                                })
                            }
                        }
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

#[post("/user/connectEmail", format = "json", data = "<email_address_payload>")]
pub fn connect_email_for_user(pool: State<PgPool>, email_address_payload: Json<EmailAddressPayload>, mut cookies: Cookies) {
    let connection = pool.get().unwrap();
    let userIdJWT = cookies.get_private("userIdJWT").unwrap();
    let res: Result<(serde_json::Value, serde_json::Value), frank_jwt::error::Error>  = decode(&String::from(userIdJWT.value()), &String::from("secret123"), Algorithm::RS256, &frank_jwt::ValidationOptions::default());
    match res {
        Ok(value) => { 
            print!("{}", value.0);
            print!("{}", value.1) 
        },
        Err(_e) => {}
    }
   
}

pub fn get_user_id_jwt(user: &User) -> Result<String, frank_jwt::error::Error> {
    let payload = serde_json::json!({
        "userId": &user.id
    });

    let header = serde_json::json!({
        "blah": "blah"
    });
    let secret = "secret123";
    encode(header, &String::from(secret), &payload, Algorithm::HS256)
 }
