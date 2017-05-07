from flask import Flask
from flask import render_template
from flask import request, jsonify
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'studentdata3'
COLLECTION_NAME = 'dashboard'
FIELDS = {'state': True, 'category': True, 'sector': True, 'semester': True, 'salary': True, 'count': True, '_id': False}



@app.route("/")
def index():
    return render_template("index.html")

@app.route("/studentData/dashboard")
def dashboard():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find({},FIELDS, limit=50)

    json_projects = []
    for project in projects[1:]:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

@app.route("/network")
def test():
    return render_template("network.html");

@app.route("/test3")
def test1():
    return render_template("test3.html");

@app.route("/skills")
def test2():
    return render_template("skills.html");

@app.route("/data")
def test3():
    return render_template("data.html");

@app.route("/contact")
def test4():
    return render_template("contact.html");

@app.route("/api")
def runapi():
    return render_template("api.js")

@app.route('/_add_numbers')
def add_numbers():
    a = request.args.get('a', 0, type=int)
    b = request.args.get('b', 0, type=int)

    return jsonify(result=a + b)

@app.route('/signUp')
def signUp():
    return render_template('signUp.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
