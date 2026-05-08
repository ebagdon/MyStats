# imports for mongoDB
from pymongo import MongoClient
from pymongo import server_api

# imports for flask
from flask import Flask, Response, request
from flask_cors import CORS
from bson.json_util import dumps, loads

# import the username module
import username as user

# import the set_statistics module
import set_statistics

# get the database
uri = 'your_database_URI_goes_here'
client = MongoClient(uri, server_api=server_api.ServerApi(version="1", strict=True, deprecation_errors=True))
collection = client['data']['app_data']

# create a username instance
username = user.Username()

# initialize the API and enable CORS on it so other applications can access it
app = Flask(__name__)
CORS(app)

# create the API's post response to a user logging in on the frontend
@app.route('/login', methods = ['POST'])
def login():
    # get the data sent by the post request
    data = request.json
    
    # attempt to find a user with the given username and password, if it can't be found return a response error, if it's found return a successful response
    user = collection.find_one({'username': data['username'], 'password': data['password']})
    if user == None:
        return Response(status=500)
    username.set_username(data['username'])
    return Response(status=201)

# create the API's post response to a user signing up on the frontend
@app.route('/signup', methods = ['POST'])
def signup():
    # get the data sent by the post request and try to send it to the database
    data = request.json

    user = collection.find_one({'username': data['username']})
    if user == None:
        username.set_username(data['username'])
        collection.insert_one(data)
        return Response(data, status=201)
    else:
        return Response(status=507)

# create the API's response to a calculate_statistics request
@app.route('/calculate_statistics', methods = ['GET', 'POST'])
def calculate_statistics():
    if (request.method == 'POST'):
        # the data contained in the post request
        data = request.json

        # if there is a user with the given username set its numberSet, if there isn't a user with the given username return an error
        user = collection.find_one({'username': username.get_username()})
        if not user == None:
            collection.update_one(user, {'$set': {'numberSet': tuple(set_statistics.number_set_from_string(data['numberSet'], ', '))}})
            return Response(status=201)
        else:
            return Response(status=500)
    elif (request.method == 'GET'):
        # if there is a user with the given username get and return its numberSet with its statistics, if there isn't a user with the given username return an error
        user = collection.find_one({'username': username.get_username()})
        if not user == None:
            statistics = set_statistics.number_set_statistics(user['numberSet'])
            number_set = {
                'set': user['numberSet'],
                'min': float(statistics['min']),
                'mean': float(statistics['mean']),
                'median': float(statistics['median']),
                'mode': float(statistics['mode']),
                'max': float(statistics['max'])
            };

            return Response(dumps(number_set), status=201)
        else:
            return Response(status=500)