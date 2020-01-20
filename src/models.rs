use crate::schema::users;

#[derive(Queryable)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub passwordhash: String,
    pub emailaddress: Option<String>,
}

#[derive(Debug, Insertable)]
#[table_name="users"]
    pub struct NewUser {
    pub username: String,
    pub passwordhash: String,
    pub emailaddress: Option<String>,
                   
}
