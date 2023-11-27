from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_caching import Cache
import time
import json

from spotifyClient.spotifyclient import *

cache = Cache(config={'CACHE_TYPE': 'simple'})

app = Flask(__name__)
cache.init_app(app)

@app.errorhandler(404)
def page_not_found(e):
    return redirect(url_for('profile'))

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
    return [{'id': 'spotify:artist:' + artist['id'],
             'name': artist['name'], 
             'image_url': artist['images'][0]['url'],
             'url': artist['external_urls']['spotify']} for artist in data if len(artist['images']) > 0]

def filter_track_fields(data):
    return [{'id': 'spotify:track:' + track['id'],
             'title': track['name'], 
             'artists': ', '.join([artist['name'] for artist in track['artists']]),
             'image_url': track['album']['images'][0]['url'],
             'url': track['external_urls']['spotify']} for track in data]

@cache.memoize(timeout=3600)
def get_cached_results(method, *args):
    if args:
        return method(args[0])
    else:
        return method()
    

@app.route('/profile')
def profile():
    if 'client' not in globals():
        return redirect(url_for('login'))
    
    global client
    # Check if the user is logged in (for demonstration purposes)
    if not hasattr(client, '_code'):
        return redirect(url_for('login'))

    # Retrieve user data
    user_data = get_cached_results(client.get_user_info)
    user_data = filter_profile_fields(user_data)
    
    top_artists = get_cached_results(client.get_top_items, 'artists')
    top_artists = filter_artist_fields(top_artists['items'])
    
    top_tracks = get_cached_results(client.get_top_items, 'tracks')
    top_tracks = filter_track_fields(top_tracks['items'])

    # Pass user data to the template
    return render_template('profile.html', 
                           user_data=user_data, 
                           top_artists=top_artists, 
                           top_tracks=top_tracks)

@app.route('/recommendations', methods=['GET', 'POST'])
def recommendations():
    if 'client' not in globals():
        return redirect(url_for('login'))
    
    global client
    
    if not hasattr(client, '_code'):
        return redirect(url_for('login'))
    
    genres = get_cached_results(client.get_available_genres)
    playlists = get_cached_results(client.get_user_playlists)
    
    return render_template('recommendations.html', genres=genres, playlists=playlists)

@app.route('/generate_playlist', methods=['GET'])
def generate_playlist():
    global client 
    
    kwargs = {key: value for key, value in request.args.items()}


    recommendations = client.get_track_recommendations(**kwargs)
    
    tracks = filter_track_fields(recommendations['tracks'])
    
    # Return the result as JSON
    return jsonify(tracks)

@app.route('/create_playlist', methods=['GET'])
def create_playlist():
    global client
    
    title = request.args.get('playlistTitle')
    playlist = client.create_playlist(title)
    return jsonify(playlist)

@app.route('/save_tracks', methods=['GET'])
def save_tracks():
    global client
    
    playlist_id = request.args.get('playlistId')
    track_uris = json.loads(request.args.get('trackUris'))
    
    response = client.populate_playlist(playlist_id, track_uris)
    return jsonify(response)

@app.route('/track_suggestions', methods=['GET'])
def track_suggestions():
    global client
    query = request.args.get('query')

    tracks = client.search_for_item('track', query)
    tracks = filter_track_fields(tracks['tracks']['items'])
    
    return jsonify(tracks)

@app.route('/artist_suggestions', methods=['GET'])
def artist_suggestions():
    global client
    query = request.args.get('query')

    tracks = client.search_for_item('artist', query)
    tracks = filter_artist_fields(tracks['artists']['items'])
    
    return jsonify(tracks)

@app.route('/logout')
def logout():
    global client
    # Simulate a logout (for demonstration purposes)
    del client._code
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(port=8888, debug=True)
