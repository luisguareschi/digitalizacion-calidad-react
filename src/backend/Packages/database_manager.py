import pandas as pd
import os
from Packages.constants import records_folder


def read_xlsx(file_path):
    data = pd.read_excel(file_path)
    df = pd.DataFrame(data)
    df = df.fillna('null')
    df = df.to_dict('records')
    return df


def get_planes_list():
    list = os.listdir(records_folder)
    result = {}
    for item in list:
        splitted = item.split('_')
        end = item.split('_')[-1]
        name = ''
        for i, part in enumerate(splitted):
            if i + 1 == len(splitted):
                break
            if len(splitted) == 2:
                name = name + part
                break
            elif i < len(splitted) - 2:
                name = name + part + '_'
            elif i == len(splitted) - 2:
                name = name + part
        type = end.split('.')[0]
        result[name] = type
    return result


def create_new_record(filename):
    cols = ['part_name', 'quality', 'id', 'problem_type', 'quadrant']
    df = pd.DataFrame(columns=cols)
    df.to_excel(os.path.join(records_folder, filename), index=False)


def delete_record(filename):
    os.remove(os.path.join(records_folder, filename))


if __name__ == '__main__':
    pass
