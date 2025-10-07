from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from agent.reasoning_agent import ReasoningAgent
from config.settings import settings


app = FastAPI(title="Agent Care Bot", version="0.1.0")


class ChatRequest(BaseModel):
    user_input: str


class ChatResponse(BaseModel):
    output: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.environment}


@app.post("/chat", response_model=ChatResponse)
def chat(body: ChatRequest) -> ChatResponse:
    agent = ReasoningAgent()
    result = agent.run(body.user_input)
    return ChatResponse(output=result["output"]) 


