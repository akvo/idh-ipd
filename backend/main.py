import uvicorn
from fastapi import FastAPI

app = FastAPI(root_path="/api")


@app.get("/health-check")
def health_check():
    return "OK"


@app.get("/")
def read_main():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
