import os.path

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

from Packages.constants import records_folder
from Packages.database_manager import read_xlsx, get_planes_list, create_new_record, delete_record
import pandas as pd

from Packages.send_excel_as_response import send_excel_as_response

app = Flask(__name__)
CORS(app)


@app.route("/get_xlsx", methods=["POST"])
def read_file():
    data = request.json
    type = data['type']
    path = f"{type}.xlsx"
    df = read_xlsx(path)
    return jsonify(df)


@app.route("/get_record", methods=["POST"])
def read_record():
    data = request.json
    filename = data['filename']
    path = os.path.join(records_folder, filename)
    df = read_xlsx(path)
    return jsonify(df)


@app.route("/get_planes_list", methods=["GET"])
def _get_planes():
    result = get_planes_list()
    return jsonify(result)


@app.route("/create_record", methods=["POST"])
def _create_record():
    data = request.json
    filename = data['filename']
    create_new_record(filename)
    return ''


@app.route("/delete_record", methods=["POST"])
def _delete_record():
    data = request.json
    filename = data["filename"]
    delete_record(filename)
    return ""


@app.route("/save_record", methods=["POST"])
def save_record():
    data = request.json
    filename = data["filename"]
    records_df = data["recordsTable"]
    records_df = pd.DataFrame.from_records(records_df)
    records_df.to_excel(os.path.join(records_folder, filename), index=False)
    return "Success"


@app.route("/download_table", methods=["POST"])
def download_table():
    data = request.json
    records_dict = data["recordsTable"]
    return send_excel_as_response(content_dict=records_dict)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=80)
