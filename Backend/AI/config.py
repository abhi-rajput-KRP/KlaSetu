from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from utils.settings import settings
from dotenv import load_dotenv

load_dotenv()

FEATHERLESS_API_KEY= settings.FEATHERLESS_API_KEY
GROQ_API_KEY= settings.GROQ_API_KEY

if not FEATHERLESS_API_KEY:
    raise RuntimeError("Missing FEATHERLESS_API_KEY in the environment")

if not GROQ_API_KEY:
    raise RuntimeError("Missing GROQ_API_KEY in the environment")

vlm = ChatOpenAI(
    api_key=FEATHERLESS_API_KEY,
    model="Qwen/Qwen3-VL-4B-Instruct",
    base_url="https://api.featherless.ai/v1",
)

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.3,
    disable_streaming=True,
    reasoning_effort="low"
)

REMBG_MODEL_NAME = "u2net"
TARGET_SAMPLE_RATE = 16000
MODEL_NAME = "ai4bharat/indic-conformer-600m-multilingual"