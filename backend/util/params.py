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
    if x["living_income"] is None:
        return None
    if x["hh_income"]:
        return x["living_income"] - x["hh_income"]
    living_income = x["living_income"]
    for i in ["other_income", "net_income"]:
        if x[i]:
            living_income = living_income - x[i]
    return living_income


def get_share_income(x):
    for i in ["net_income", "hh_income"]:
        if i not in x:
            return None
        if not x[i]:
            return None
    return (x["net_income"] / x["hh_income"] * 100)


def get_percentage_li_gap(x):
    for i in ["living_income", "hh_income", "net_income"]:
        if i not in x:
            return None
        if not x[i]:
            return None
    return ((x["living_income"] - x["hh_income"]) / (x["living_income"]) * 100)


def get_percentage_hh_income(x):
    if "net_income" not in x:
        return None
    if x["net_income"] is None:
        return None
    other_income = 0
    if "other_income" in x:
        other_income = x["other_income"] if x["other_income"] else 0
    return (x["net_income"] / (x["net_income"] + other_income)) * 100


def with_extra_data(data):
    data.update({"revenue": get_revenue(data)})
    data.update({"total_prod_cost": get_total_prod_cost(data)})
    data.update({"living_income_gap": get_living_income_gap(data)})
    data.update({"share_income": get_share_income(data)})
    data.update({"percent_li_gap": get_percentage_li_gap(data)})
    data.update({"percent_hh_income": get_percentage_hh_income(data)})
    return data
