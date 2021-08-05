def get_revenue(x):
    if x["land_size"] and x["price"] and x["yields"]:
        return (x["land_size"] * x["price"] * x["yields"])
    return None


def get_total_prod_cost(x):
    if x["land_size"] and x["prod_cost"]:
        return x["land_size"] * x["prod_cost"]
    return None


def get_net_income(x):
    total_prod_cost = x["total_prod_cost"] if x["total_prod_cost"] else 0
    revenue = x["revenue"] if x["revenue"] else 0
    return total_prod_cost - revenue


def get_actual_household_income(x):
    other_income = x["other_income"] if x["other_income"] else 0
    return x["revenue"] + other_income


def get_living_income_gap(x):
    living_income = x["living_income"] if x["living_income"] else 0
    return x["actual_household_income"] - living_income


def with_extra_data(data):
    data.update({"revenue": get_revenue(data)})
    data.update({"total_prod_cost": get_total_prod_cost(data)})
    data.update({"net_income": get_net_income(data)})
    data.update({"actual_household_income": get_actual_household_income(data)})
    data.update({"living_income_gap": get_living_income_gap(data)})
    data.update({
        "share_income":
        (data["net_income"] / data["actual_household_income"] * 100)
    })
    return data
