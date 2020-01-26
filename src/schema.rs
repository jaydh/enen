table! {
    users (id) {
        id -> Int4,
        username -> Varchar,
        passwordhash -> Varchar,
        emailaddress -> Nullable<Varchar>,
    }
}
