import jwt
from fastapi import FastAPI, Request
from routes.user import user_route
from routes.crop import crop_route
from routes.country import country_route
from routes.driver_income import driver_income_route
from routes.company import company_route

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

app.include_router(user_route)
app.include_router(crop_route)
app.include_router(country_route)
app.include_router(driver_income_route)
app.include_router(company_route)


@app.get("/", tags=["Dev"])
def read_main():
    return "OK"


@app.get("/health-check", tags=["Dev"])
def health_check():
    return "OK"


@app.middleware("http")
async def route_middleware(request: Request, call_next):
    auth = request.headers.get('Authorization')
    if auth:
        auth = jwt.decode(auth.replace("Bearer ", ""),
                          options={"verify_signature": False})
        request.state.authenticated = auth
    response = await call_next(request)
    return response
