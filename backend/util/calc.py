import pandas as pd
from .params import with_extra_data


def avg(data, col):
    data = [d.serialize for d in data]
    data = pd.DataFrame(data)
    data = data[data['net_income'].notna()]
    data = data[data['other_income'].notna()]
    data = data.groupby(col).mean()
    data = data.reset_index()
    data = data.astype(object).where(pd.notnull(data), None)
    data = [with_extra_data(d) for d in data.to_dict('records')]
    for d in data:
        for param in d:
            if param != param:
                param = None
    return data
