import pandas as pd
from .params import with_extra_data


def avg(data, col):
    data = [with_extra_data(d.serialize) for d in data]
    data = pd.DataFrame(data)
    data = data.groupby(col).mean()
    data = data.reset_index()
    data = data.astype(object).where(pd.notnull(data), None)
    return data.to_dict('records')
