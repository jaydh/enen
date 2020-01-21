use std::env;
use diesel::r2d2::ConnectionManager;
use r2d2::Pool;
use diesel::pg::PgConnection;

pub type PgPool = Pool<ConnectionManager<PgConnection>>;

fn init_pool(database_url: &str) -> PgPool {
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::new(manager).unwrap()
}

fn database_url() -> String {
    env::var("DATABASE_URL").expect("DATABASE_URL must be set")
}

pub fn get_connect() -> PgPool {
    init_pool(&database_url())
}
