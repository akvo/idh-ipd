import uvicorn
from fastapi import FastAPI
from route import routes

app = FastAPI(
    root_path="/api",
    title="Income Perfomance Dashboard (IPD) - IDH",
    description="Auth Client ID: 99w2F1wVLZq8GqJwZph1kE42GuAZFvlF",
    version="0.0.1",
    contact={
        "name": "Akvo",
        "url": "https://akvo.org",
        "email": "dev@akvo.org",
    },
    license_info={
        "name": "AGPL3",
        "url": "https://www.gnu.org/licenses/agpl-3.0.en.html",
    },
)
app.include_router(routes)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
