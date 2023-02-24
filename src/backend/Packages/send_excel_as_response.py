import io
import pandas as pd
from flask import Response


def send_excel_as_response(content_dict: list, filename: str = "output"):
    buffer = io.BytesIO()
    # create an Excel writer object
    with pd.ExcelWriter(buffer) as writer:
        df = pd.DataFrame.from_records(content_dict)
        df.to_excel(writer, index=False)
    headers = {
        f'Content-Disposition': f'attachment; filename={filename}.xlsx',
        'Content-type': 'application/vnd.ms-excel'
    }
    return Response(buffer.getvalue(), mimetype='application/vnd.ms-excel', headers=headers)