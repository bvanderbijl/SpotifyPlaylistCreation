$(document).ready(function() {
    $('#generatePlaylist').on('click', function() {
        // Get parameter values from input fields
        var trackCount = $('#trackSlider').val();

        var genres = document.getElementById("genres");
        var selectedGenres = prepareGenres(genres)

        // Make an asynchronous request to the server with parameters
        $.ajax({
            type: 'GET',
            url: '/generate_playlist',
            contentType: 'application/json;charset=UTF-8',
            data: {'trackCount': trackCount, 'selectedGenres': selectedGenres},
            success: function(data) {
                // Update the resultDiv with the returned data
                updateRecommendations(data);
            }
        });
    });

    function prepareGenres(genres){
        var selectedGenres = [];
        for (var i = 0; i < genres.options.length; i++) {
            if (genres.options[i].selected) {
                selectedGenres.push(genres.options[i].value);
            }
        }

        selectedGenres = selectedGenres.join(",")

        return selectedGenres
    }

    function updateRecommendations(data) {
        // Clear previous results
        $('#recommendationsDiv').empty();

        $('#recommendationsDiv').append('<button id="selectAllButton">Select All</button>');
        $('#recommendationsDiv').append('<button id="saveButton">Save</button>');
        $('#recommendationsDiv').append('<button id="refreshButton" style="display: none;">Refresh</button>')
        $('#recommendationsDiv').append('<button id="deleteButton" style="display: none;">Delete</button>')

        // Iterate through the data and append it to the resultDiv
        data.forEach(function(track, index) {
            var html = '<div class="recommended-track-item" data-index="' + index + '" data-id="' + track.id + '">';
            html += '<span class="track-index">' + (index + 1) + '</span>';
            html += '<img src="' + track.image_url + '" alt="Track Image" class="recommended-track-image">';
            html += '<span class="recommended-track-title">' + track.title + '</span>';
            html += '<span class="recommended-track-artist">' + track.artists + '</span>';
            html += '<a href="' + track.url + '" target="_blank" class="play-button"><i style="font-size:20px" class="fa">&#xf04b;</i></a>';
            html += '</div>';

            // Append the HTML to the resultDiv
            $('#recommendationsDiv').append(html);
        });

        $('.recommended-track-item').hover(
            function() {
                $(this).find('.play-button').addClass('hovered');
                $(this).find('.track-index').addClass('hidden');
            },
            function() {
                $(this).find('.play-button').removeClass('hovered');
                $(this).find('.track-index').removeClass('hidden');
            }
        );
        
        var selectAllButton = $('#selectAllButton');
        selectAllButton.click(function() {
            var buttonText = selectAllButton.text();
            if (buttonText === 'Select All') {
                $('.recommended-track-item').addClass('selected');
                $('.play-button').addClass('selected');

                $('#refreshButton').show();
                $('#deleteButton').show();

                selectAllButton.text('Unselect All')
            } else {
                $('.recommended-track-item').removeClass('selected');
                $('.play-button').removeClass('selected');

                $('#refreshButton').hide();
                $('#deleteButton').hide();

                selectAllButton.text('Select All')
            }
        });

        $('#saveButton').click(function() {
            openPopup();
        });
    
        // Function to open the pop-up window
        function openPopup() {
            $('#popupContainer').show();
        }

        $('.recommended-track-item').click(function() {
            $(this).toggleClass('selected');
            $(this).find('.play-button').toggleClass('selected');

            var atLeastOneSelected = $('.recommended-track-item.selected').length > 0;

            // Show/hide the "Refresh" and "Delete" buttons accordingly
            $('#refreshButton').toggle(atLeastOneSelected);
            $('#deleteButton').toggle(atLeastOneSelected);
        });

        window.closePopup = function() {
            $('#popupContainer').hide();
        };

        function getSelectedTrackIds() {
            var selectedData = [];
            $('.recommended-track-item.selected').each(function() {
                var id = $(this).data('id');
                selectedData.push(id);
            });
            return selectedData;
        }

        $('#refreshButton').click(function() {
            var selectedTracks = $('.recommended-track-item.selected');
            
            var trackCount = $('#trackSlider').val();
            var genres = document.getElementById("genres");
            var selectedGenres = prepareGenres(genres)

            // Make an asynchronous request to the server with parameters
            $.ajax({
                type: 'GET',
                url: '/generate_playlist',
                contentType: 'application/json;charset=UTF-8',
                data: {'trackCount': trackCount, 'selectedGenres': selectedGenres},
                success: function(data) {
                    // Update the resultDiv with the returned data
                    updateSelectedRows(selectedTracks, data);
                }
            });
        });

        function updateSelectedRows(selectedTracks, newTracks) {
            selectedTracks.each(function(index, element) {
                var trackContainer = $(element);
                var newTrack = newTracks[index]; // Assuming the order matches
    
                // Update the content of the track container
                trackContainer.data('id', newTrack.id);

                trackContainer.find('.recommended-track-image').attr('src', newTrack.image_url);
                trackContainer.find('.recommended-track-title').text(newTrack.title);
                trackContainer.find('.recommended-track-artist').text(newTrack.artists);
                trackContainer.find('.play-button').data('url', newTrack.url);
            })
        };

        $('#deleteButton').click(function() {
            var selectedTracks = $('.recommended-track-item.selected');

            selectedTracks.each(function(element) {
                element.remove()
            })

            updateTrackIndices()

            $('#refreshButton').hide();
            $('#deleteButton').hide();
        });

        function updateTrackIndices() {
            // Get all track containers
            var allTracks = $('.recommended-track-item');
    
            // Update the indices of the remaining tracks
            allTracks.each(function(index, element) {
                var newIndex = index + 1;
    
                // Update the index in the DOM
                $(element).find('.track-index').text(newIndex);
            });
        }
    }
});
