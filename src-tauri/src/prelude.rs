use std::fmt::Display;

use anyhow::Context;

use crate::error::Error;

pub type Result<T> = std::result::Result<T, Error>;

pub trait WithErr<T, E>
where
    Self: Sized + Context<T, E>,
{
    fn with_err<M: Display>(self, msg: M) -> Result<T> {
        self.context(msg.to_string()).map_err(Into::into)
    }
}

impl<T, E, R> WithErr<T, E> for R
where
    Self: Sized + Context<T, E>,
    R: Into<std::result::Result<T, E>>,
{
}
