from pydantic_settings import BaseSettings ,SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DB_CONNECTION:str
    SECRET_KEY:str
    ALGORITHM:str
    FEATHERLESS_API_KEY : str
    GROQ_API_KEY : str
    HF_TOKEN : str
    GEOCODING_KEY : str
    SUPABASE_URL : str
    SUPABASE_KEY : str

settings = Settings()