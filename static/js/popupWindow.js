$(document).ready(function() {
    window.togglePlaylistFields = function() {
        var playlistChoice = $('#playlistChoice').val();

        // Hide both fields initially
        $('#existingPlaylistFields').hide();
        $('#newPlaylistFields').hide();

        // Show the selected field
        if (playlistChoice === 'existing') {
            // Fetch and populate existing playlists dynamically from the server
            // Example: populateExistingPlaylists();
            $('#existingPlaylistFields').show();
        } else if (playlistChoice === 'new') {
            $('#newPlaylistFields').show();
        }
    };

    window.savePlaylist = function() {
        var playlistChoice = $('#playlistChoice').val();
        var playlistName;
        var playlistId;

        if (playlistChoice === 'existing') {
            playlistId = $('#existingPlaylist').val();

            populate_playlist(playlistId)
        } else if (playlistChoice === 'new') {
            playlistName = $('#newPlaylist').val();

            // Validate if the new playlist name is not empty
            if (playlistName.trim() === "") {
                alert("Please enter a valid new playlist name.");
                return;
            }

            $.ajax({
                type: 'GET',
                url: '/create_playlist',
                contentType: 'application/json;charset=UTF-8',
                data: {'playlistTitle': playlistName},
                success: function(response) {
                    playlistId = response['id']
                    populate_playlist(playlistId)
                }
            });
        }

        
        
    };

    function getTrackUris() {
        var trackUris = [];
        $('.recommended-track-item').each(function() {
            var uri = $(this).data('id');
            trackUris.push(uri);
        });
        return trackUris;
    }

    window.closePopup = function() {
        $('#popupContainer').hide();
    };

    function populate_playlist(playlist_id) {
        var trackUris = getTrackUris();

        $.ajax({
            type: 'GET',
            url: '/save_tracks',
            contentType: 'application/json;charset=UTF-8',
            data: {'playlistId': playlist_id, 'trackUris': JSON.stringify(trackUris)},
            success: function(response) {
                closePopup()
            }
        });
    }
});