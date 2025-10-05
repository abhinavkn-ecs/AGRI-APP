# app.py
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from fastapi.middleware.cors import CORSMiddleware

# -------------------
# CORS setup
# -------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------
# Request model
# -------------------
class Query(BaseModel):
    text: str

# -------------------
# Load GPT2 model
# -------------------
model_name = "gpt2"  # Decoder-only, works with AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

# -------------------
# Prompt wrapper
# -------------------
def build_farming_prompt(user_input):
    """
    Wrap user input with context to make the AI respond as a professional farmer.
    """
    prompt = (
        "You are a professional farmer with years of experience. "
        "You only give advice or information related to farming, crops, "
        "livestock, and agriculture. Answer in a helpful, clear, and "
        "professional way.\n\n"
        f"User: {user_input}\n"
        "Farmer:"
    )
    return prompt

# -------------------
# API endpoint
# -------------------
@app.post("/generate")
def generate_text(query: Query):
    prompt = build_farming_prompt(query.text)
    result = generator(prompt, max_length=150, do_sample=True, temperature=0.7, top_p=0.9)
    return {"generated_text": result[0]["generated_text"]}

# -------------------
# Root endpoint
# -------------------
@app.get("/")
def read_root():
    return {"message": "Farming AI is running! Use /generate to get farming advice."}
