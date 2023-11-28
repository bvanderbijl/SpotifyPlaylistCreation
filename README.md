# Flask Spotify Playlist Generator

## Overview

This Flask web application allows users to generate and save Spotify playlists based on specified parameters. Users can customize the playlist by selecting genres, mood, and other criteria to tailor the playlist to their preferences.

## Features

- **Parameter Selection**: Choose from a variety of parameters such as genres, mood, and tempo to personalize the generated playlist.
  
- **Spotify Integration**: Seamless integration with Spotify API to access and create playlists directly from the user's Spotify account.
  
- **Save and Share**: Save your customized playlists to your Spotify account and share them with others.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/bvanderbijl/SpotifyPlaylistCreation
   cd SpotifyPlaylistCreation

2. **Install Dependencies**

   ```bash
   pip install -r requirements.txt

3. **Set Up Spotify API**

- Create a Spotify Developer account at https://developer.spotify.com/.
- Create an app in your developer environment with the Redirect URI: http://localhost:8888/callback/.
- Store the client id and the client secret in a .env file in the same format as in the .env.example.

5. **Run the Application**

   ```bash
   python spotifyRecommendationsWebApp.py

7. **Visit app and Login**
Visit https://localhost:8888 in your browser andauthenticate your Spotify account.

## Usage

- Visit the web app in your browser on https://localhost:8888.
- Authenticate with your Spotify account.
- Go to the Recommendations page.
- Adjust the parameters to your preferences.
- Generate and save your personalized playlist.
