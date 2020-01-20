table! {
    users (id) {
        id -> Int4,
        username -> Varchar,
        passwordhash -> Nullable<Varchar>,
        emailaddress -> Nullable<Varchar>,
    }
}
