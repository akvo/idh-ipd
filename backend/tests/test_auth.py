import jwt
from middleware import verify_token
from datetime import datetime, timedelta

exp_date = (datetime.now() + timedelta(days=30)).timestamp()
account = {
    "email": "support@akvo.org",
    "name": "Akvo Support",
    "exp": exp_date,
    "email_verified": True
}
token = jwt.encode(account, "secret", algorithm="HS256")
decoded = jwt.decode(token, "secret", algorithms=["HS256"])


class TestAuthorizationSetup:
    def test_token_verification(self):
        assert token != ""
        assert decoded == account
        assert True if verify_token(decoded) else False
