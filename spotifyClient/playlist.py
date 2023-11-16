class Playlist:
    """Playlist represents a Spotify playlist."""

    def __init__(self, name, id):
        """
        :param name (str): Playlist name
        :param id (int): Spotify playlist id
        """
        self.name = name
        self.id = id
        self.songs = []

    def __str__(self):
        return f"Playlist: {self.name}"
    
    def add_song(self, song):
        self.songs.append(song)
