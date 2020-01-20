use diesel::prelude::*;
use diesel::pg::PgConnection;
use std::env;
use diesel::r2d2::{ Pool, PooledConnection, ConnectionManager };
use r2d2_postgres::PostgresConnectionManager;

pub type PgPool = Pool<ConnectionManager<PgConnection>>;
pub type PgPooledConnection = PooledConnection<ConnectionManager<PgConnection>>;

fn init_pool(database_url: &str) -> PgPool {
    let manager = PostgresConnectionManager::new(database_url);
    let pool = r2d2::Pool::new(manager).unwrap();
    pool
}


fn database_url() -> String {
    env::var("DATABASE_URL").expect("DATABASE_URL must be set")
}

pub fn get_connect() -> PgPool {
        PgConnection::establish(&database_url())
        .expect(&format!("Error connecting to {}", database_url()));
        init_pool(&database_url()).expect("Failed to create pool")
}                
