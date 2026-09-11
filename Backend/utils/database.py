from sqlalchemy.orm import sessionmaker,declarative_base
from sqlalchemy import create_engine
from utils.settings import settings

Base = declarative_base()

engine = create_engine(url=settings.DB_CONNECTION)
LocalSession = sessionmaker(bind=engine)

def get_db():
    db = LocalSession()
    try:
        yield db
    except Exception:
        raise
    finally:
        db.close()