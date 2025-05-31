from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, field_validator
import torch
from diffusers import StableDiffusionPipeline
import uuid
import os
import logging
import requests
import httpx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("generated", exist_ok=True)

if torch.cuda.is_available():
    device = torch.device("cuda")
elif torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

app.mount("/generated", StaticFiles(directory="generated"), name="generated")

model_id = "SG161222/Realistic_Vision_V5.1_noVAE"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    safety_checker=None
)
pipe = pipe.to(device)

class AvatarRequest(BaseModel):
    gender: str
    skin_color: str
    hair_color: str
    hairstyle: str
    accessories: str
    eye_color: str
    shirt_color: str
    background_color: str

    @field_validator('gender')
    def gender_must_be_valid(cls, v):
        allowed = {'male', 'female', 'other'}
        if v not in allowed:
            raise ValueError(f"gender must be one of {allowed}")
        return v

@app.post("/generate-avatar")
def generate_avatar(data: AvatarRequest):
    if data.accessories != "none":
        prompt = (
            f"A photorealistic portrait of a {data.gender} with {data.skin_color} skin, "
            f"{data.hair_color} {data.hairstyle} hairstyle, wearing {data.accessories} as accessories, "
            f"and striking {data.eye_color} eyes. They are dressed in a {data.shirt_color} shirt, "
            f"set against a {data.background_color} background. "
            "Captured with DSLR-quality sharpness, ultra-realistic details, 8k resolution, "
            "cinematic lighting, shallow depth of field, highly detailed skin texture, and sharp facial features."
        )
    else:
        prompt = (
            f"A photorealistic portrait of a {data.gender} with {data.skin_color} skin, "
            f"{data.hair_color} {data.hairstyle} hairstyle, "
            f"and striking {data.eye_color} eyes. They are dressed in a {data.shirt_color} shirt, "
            f"set against a {data.background_color} background. "
            "Captured with DSLR-quality sharpness, ultra-realistic details, 8k resolution, "
            "cinematic lighting, shallow depth of field, highly detailed skin texture, and sharp facial features."
        )

    negative_prompt = (
        "blurry, distorted face, deformed eyes, multiple heads, extra arms, extra fingers, "
        "bad anatomy, out of frame, low quality, low resolution, artifacts, text, watermark, "
        "oversaturated, unnatural skin, mutated hands, poorly drawn face, glitch"
    )

    logger.info(f"Prompt: {prompt}")  # <- To doda

    image = pipe(prompt, negative_prompt=negative_prompt, guidance_scale=7.5, num_inference_steps=50).images[0]

    filename = f"{uuid.uuid4()}.png"
    filepath = f"generated/{filename}"
    image.save(filepath)

    return {"image_url": f"http://localhost:8000/generated/{filename}"}

app.mount("/chat_avatars", StaticFiles(directory="chat_avatars"), name="chat_avatars")

@app.get("/random-face")
async def random_face():
    url = "https://thispersondoesnotexist.com/"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Request error: {e}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=response.status_code, detail=f"HTTP error: {e}")

    folder = "chat_avatars"
    os.makedirs(folder, exist_ok=True)

    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(folder, filename)
    with open(filepath, "wb") as f:
        f.write(response.content)

    avatar_url = f"chat_avatars/{filename}"
    return {"avatar_url": avatar_url}