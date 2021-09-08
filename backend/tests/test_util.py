import os
import sys
from util import params
from util import calc

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

data = {
    "land_size": 0.3,
    "price": 2,
    "yields": 6395,
    "prod_cost": 1300,
    "net_income": 166,
    "other_income": 199,
    "hh_income": 365,
    "living_income": 3288
}

incomplete = {
    "land_size": None,
    "price": 2,
    "yields": 6395,
    "prod_cost": 1300,
    "net_income": 166,
    "other_income": None,
    "hh_income": None,
    "living_income": 3288
}


def test_company_data_extra_parameter():
    result = params.with_extra_data(data)
    assert result["revenue"] == 0.3 * 2 * 6395
    assert result["total_prod_cost"] == 0.3 * 1300
    assert result["living_income_gap"] == 3288 - 365
    assert result["share_income"] == 166 / 365 * 100
    assert result["percent_li_gap"] == ((3288 - 365) / 3288) * 100
    assert result["percent_hh_income"] == (166 / (166 + 199)) * 100


def test_company_data_extra_parameter_with_incomplete_input():
    result = params.with_extra_data(incomplete)
    assert result["revenue"] is None
    assert result["total_prod_cost"] is None
    assert result["living_income_gap"] == 3288 - 166
    assert result["share_income"] is None
    assert result["percent_li_gap"] is None
    assert result["percent_hh_income"] == 100
