def get_revenue(x):
    for i in ["land_size", "price", "yields"]:
        if i not in x:
            return None
        if not x[i]:
            return None
    return (x["land_size"] * x["price"] * x["yields"])


def get_total_prod_cost(x):
    for i in ["land_size", "prod_cost"]:
        if i not in x:
            return None
        if not x[i]:
            return None
    return (x["land_size"] * x["prod_cost"])


def get_living_income_gap(x):
    for i in ["living_income", "hh_income"]:
        if i not in x:
            return None
        if not x[i]:
            return None
    return x["living_income"] - x["hh_income"]


def get_share_income(x):
    for i in ["net_income", "hh_income"]:
        if i not in x:
            return None
        if not x[i]:
            return None
    return (x["net_income"] / x["hh_income"] * 100)


def get_percentage_hh_income(x):
    for i in ["net_income", "hh_income"]:
        if i not in x:
            return None
        if not x[i]:
            return None
    return (x["hh_income"] / (x["net_income"] + x["hh_income"]) * 100)


def with_extra_data(data):
    data.update({"revenue": get_revenue(data)})
    data.update({"total_prod_cost": get_total_prod_cost(data)})
    data.update({"living_income_gap": get_living_income_gap(data)})
    data.update({"share_income": get_share_income(data)})
    data.update({"percent_hh_income": get_percentage_hh_income(data)})
    return data
