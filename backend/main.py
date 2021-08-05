import uvicorn
from fastapi import FastAPI
from route import routes

app = FastAPI(root_path="/api")
app.include_router(routes)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
