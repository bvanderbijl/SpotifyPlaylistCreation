import requests
import random
import string
import json
import webbrowser
from datetime import datetime, timedelta

from urllib.parse import urlencode

from spotifyClient.track import Track
from spotifyClient.playlist import Playlist


class SpotifyClient:
    """SpotifyClient performs operations using the Spotify API."""
    
    USER_SCOPE = ['user-read-private', 
                  'user-read-email',
                  'playlist-modify-private', 
                  'playlist-modify-public', 
                  'user-read-recently-played', 
                  'user-top-read']
    
    def __init__(self, client_id, client_secret):
        """
        :param client_id (str): Spotify client ID
        :param client_secret (str): Spotify client secret
        :param redirect_uri (str): Redirect URI of the application
        """
        self.client_id = client_id
        self.client_secret = client_secret
        
        self.redirect_uri = "http://localhost:8888/callback/"
    
    def get_bearer_token(self):
        url = "https://accounts.spotify.com/api/token"
        payload = urlencode({
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret
        })
        headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        
        response.raise_for_status()
        body = response.json()
        self._bearer_token = body['access_token']
        
        return body
  
    def authorize(self):
        state = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(16))
        scope = ' '.join(self.USER_SCOPE)
        
        auth_headers = urlencode({
            "client_id": self.client_id,
            "response_type": "code",
            'redirect_uri': self.redirect_uri,
            'scope': scope,
            'state': state
        })
        webbrowser.open("https://accounts.spotify.com/authorize?" + auth_headers)
    
    def save_code(self, code):
        self._code = code
        
    def get_access_token(self):
        url = "https://accounts.spotify.com/api/token"
        payload = urlencode({
            "grant_type": "authorization_code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "code": self._code,
            "client_secret": self.client_secret})
        headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        response = requests.request("POST", url, headers=headers, data=payload)
        response.raise_for_status()
        
        body = response.json()
        
        self._access_token = body['access_token']
        self._refresh_token = body['refresh_token']
        
        self._expire_time = datetime.now() + timedelta(seconds=body['expires_in'])
        
        return body
    
    def refresh_token(self):
        url = "https://accounts.spotify.com/api/token"
        payload = urlencode({
            "grant_type": "refresh_token",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "refresh_token": self._refresh_token
        })
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        response.raise_for_status()
        
        body = response.json()
        
        self._access_token = body['access_token']
        self._expire_time = datetime.now() + timedelta(seconds=body['expires_in'])
        
        return body
    
    def user_authorization(self):
        if not hasattr(self, "_code"):
            self.authorize()
        
        if not hasattr(self, "_access_token"):
            self.get_access_token()
        
        if datetime.now() > self._expire_time:
            self.refresh_token()
    
    def get_user_info(self):
        self.user_authorization()
        
        url = "https://api.spotify.com/v1/me"
        headers = {
            'Authorization': f'Bearer {self._access_token}'
        }
        
        response = requests.request("GET", url, headers=headers)
        response.raise_for_status()
        
        body = response.json()
        self.user_id = body['id']
        
        return body
    
    def create_playlist(self, name):
        self.user_authorization()
        
        if not hasattr(self, "user_id"):
            self.get_user_info()
        
        url = f"https://api.spotify.com/v1/users/{self.user_id}/playlists"
        
        payload = json.dumps({
            "name": name,
            "public": "false"
        })
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self._access_token}'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        response.raise_for_status()
        
        return response.json()
    
    def get_track_recommendations(self, limit=50, **kwags):
        """Get a list of recommended tracks starting from a number of seed tracks.

        :param seed_tracks (list of Track): Reference tracks to get recommendations. Should be 5 or less.
        :param limit (int): Number of recommended tracks to be returned
        :return tracks (list of Track): List of recommended tracks
        """
        self.user_authorization()
        
        url = f"https://api.spotify.com/v1/recommendations?limit={limit}"
        
        for key, value in kwags.items():
            url += f"&{key}={value}"
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._access_token}"
        }
        
        response = requests.request("GET", url, headers=headers)
        response.raise_for_status()
        
        body = response.json()
        
        return body
    
    def populate_playlist(self, playlist, tracks):
        """Add tracks to a playlist.

        :param playlist (Playlist): Playlist to which to add tracks
        :param tracks (list of Track): Tracks to be added to playlist
        :return response: API response
        """
        self.user_authorization()
        
        track_uris = [track.create_spotify_uri() for track in tracks]
        
        data = json.dumps(track_uris)
        
        url = f"https://api.spotify.com/v1/playlists/{playlist.id}/tracks"
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._access_token}"
        }
        
        response = requests.request("POST", url, headers=headers, data=data)
        response.raise_for_status()
        
        return response.json()
    
    def get_last_played_tracks(self, limit=10):
        """Get the last n tracks played by a user

        :param limit (int): Number of tracks to get. Should be <= 50
        :return tracks (list of Track): List of last played tracks
        """
        self.user_authorization()
        
        url = f"https://api.spotify.com/v1/me/player/recently-played?limit={limit}"
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._access_token}"
        }
        
        response = requests.request("GET", url, headers=headers)
        response.raise_for_status()
        
        body = response.json()
        
        tracks = [Track(track["track"]["name"], track["track"]["id"], track["track"]["artists"][0]["name"]) for
                  track in body["items"]]
        
        return tracks
    
    def get_top_items(self, type, time_range='medium_term', limit=5, offset=0):
        self.user_authorization()
        
        if type not in ["artists", "tracks"]:
            raise Exception(f"Invalid type is given, type {type} is unknown")
        
        url = f"https://api.spotify.com/v1/me/top/{type}?time_range={time_range}&limit={limit}&offset={offset}"
        
        headers = {
            "Authorization": f"Bearer {self._access_token}"
        }
        
        response = requests.request("GET", url, headers=headers)
        response.raise_for_status()
        
        return response.json()
    
    def search_for_artist(self, artist_name):
        self.user_authorization()
        
        url = "https://api.spotify.com/v1/search"
        
        self.get_bearer_token()
        headers = {"Authorization": f'Bearer {self._bearer_token}'}
        query = f'?q={artist_name}&type=artist&limit=1'
        
        response = requests.request("GET", url + query, headers=headers)
        response.raise_for_status()
        
        if len(response.json()) == 0:
            print("No artists with this name were found.")
            return None
        
        return response.json()
    
    def get_user_playlists(self):
        self.user_authorization()
        
        url = 'https://api.spotify.com/v1/me/playlists?limit=50&offset=0'
        
        headers = {
            "Authorization": f"Bearer {self._access_token}"
        }
        
        response = requests.request("GET", url, headers=headers)
        response.raise_for_status()
        
        return response.json()
    
    def create_playlist(self, title):
        self.user_authorization()
        
        url = f"https://api.spotify.com/v1/users/{self.user_id}/playlists"
        
        headers = {
            "Authorization": f"Bearer {self._access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "name": title,
            "description": "This playlist is automatically generated by the Spotify playlist generator.",
            "public": False
        }
        
        response = requests.request("POST", url, headers=headers, data=payload)
        response.raise_for_status()
        
        return response.json()
    
    def populate_playlist(self, playlist_id, track_uris):
        self.user_authorization()
        
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        
        headers = {
            "Authorization": f"Bearer {self._access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "uris": track_uris,
            "position": 0
        }
        
        response = requests.request("POST", url, headers=headers, data=payload)
        response.raise_for_status()
        
        return response.json()
    
    def get_available_genres(self):
        self.user_authorization()
        
        url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds'
        
        self.get_bearer_token()
        headers = {"Authorization": f'Bearer {self._bearer_token}'}
        
        response = requests.request("GET", url, headers=headers)
        response.raise_for_status()
        
        return response.json()
