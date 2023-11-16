from flask import Flask, render_template, request, redirect, url_for
import time

from spotifyClient.spotifyclient import *

app = Flask(__name__)

def custom_login_function(client_id, client_secret):
    """
    Custom login function that checks if the provided credentials are valid.
    Replace this with your actual login logic.
    """
    global client
    
    client.authorize()
    time.sleep(5)
    
    return hasattr(client, "_code")

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/validate_login', methods=['POST'])
def validate_login():
    global client
    
    client_id = request.form.get('client_id')
    client_secret = request.form.get('client_secret')
    
    client = SpotifyClient(client_id, client_secret)

    if custom_login_function(client_id, client_secret):
        # Redirect to the application home page or some other route
        return redirect(url_for('profile'))
    else:
        return render_template('login.html', error='Invalid credentials')
    
@app.route('/callback/', methods=['GET'])
def callback():
    global client
    # Capture query parameters
    query_params = request.args.to_dict()
    
    if 'code' in query_params.keys():
        client.save_code(query_params['code'])
        return "Data received successfully, this tab can be closed"
    else:
        return "Could not retrieve the required information"

def filter_profile_fields(data):
    return {'display_name': data['display_name'],
            'email': data['email'],
            'id': data['id'],
            'country': data['country'],
            'product': data['product'],
            'followers_total': data['followers']['total'],
            'url': data['external_urls']['spotify']}

def filter_artist_fields(data):
    return [{'name': artist['name'], 
             'image_url': artist['images'][0]['url'],
             'url': artist['external_urls']['spotify']} for artist in data['items']]

def filter_useful_track_fields(data):
    return [{'title': track['name'], 
             'artists': ', '.join([artist['name'] for artist in track['artists']]),
             'image_url': track['album']['images'][0]['url'],
             'url': track['external_urls']['spotify']} for track in data['items']]

@app.route('/profile')
def profile():
    global client
    # Check if the user is logged in (for demonstration purposes)
    if not hasattr(client, '_code'):
        return redirect(url_for('validate_login'))

    # Retrieve user data
    user_data = client.get_user_info()
    user_data = filter_profile_fields(user_data)
    
    top_artists = client.get_top_items('artists')
    top_artists = filter_artist_fields(top_artists)
    
    top_tracks = client.get_top_items('tracks')
    top_tracks = filter_useful_track_fields(top_tracks)

    # Pass user data to the template
    return render_template('profile.html', 
                           user_data=user_data, 
                           top_artists=top_artists, 
                           top_tracks=top_tracks)

@app.route('/recommendations')
def recommendations():
    return render_template('recommendations.html')

@app.route('/logout')
def logout():
    global client
    # Simulate a logout (for demonstration purposes)
    del client._code
    return redirect(url_for('login'))

@app.route('/home')
def home():
    global client
    return client.get_user_info()

if __name__ == '__main__':
    app.run(port=8888, debug=True)
