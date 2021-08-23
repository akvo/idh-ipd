def get_revenue(x):
    if x["land_size"] and x["price"] and x["yields"]:
        return (x["land_size"] * x["price"] * x["yields"])
    return None


def get_total_prod_cost(x):
    if x["land_size"] and x["prod_cost"]:
        return (x["land_size"] * x["prod_cost"])
    return None


def get_living_income_gap(x):
    if x["living_income"] and x["hh_income"]:
        return x["living_income"] - x["hh_income"]
    return None


def get_share_income(x):
    if x["net_income"] and x["hh_income"]:
        return (x["net_income"] / x["hh_income"] * 100)
    return None


def get_percentage_hh_income(x):
    if x["net_income"] and x["hh_income"]:
        return (x["hh_income"] / x["net_income"] * 100)


def with_extra_data(data):
    data.update({"revenue": get_revenue(data)})
    data.update({"total_prod_cost": get_total_prod_cost(data)})
    data.update({"living_income_gap": get_living_income_gap(data)})
    data.update({"share_income": get_share_income(data)})
    data.update({"percent_hh_income": get_percentage_hh_income(data)})
    return data
