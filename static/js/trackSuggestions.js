var debounceTimer;
var selectedTrackSuggestions = [];

function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
        func();
    }, delay);
}

function showTrackSuggestions(suggestions) {
    const suggestionsList = $('#track-suggestions-list');
    suggestionsList.empty();

    suggestions.forEach(function (suggestion) {
        const suggestionItem = $('<div>', {
            class: 'track-suggestion-item',
            'data-id': suggestion.id,
        });

        const suggestionImage = $('<img>', {
            src: suggestion.image_url,
            alt: 'Suggestion Image',
            class: 'track-suggestion-image',
        });
        suggestionItem.append(suggestionImage);

        const suggestionInfo = $('<div>', {
            class: 'track-suggestion-info',
        });
        
        const suggestionTitle = $('<span>', {
            class: 'track-suggestion-title',
            text: suggestion.title,
        });

        const suggestionArtists = $('<span>', {
            class: 'track-suggestion-artists',
            text: suggestion.artists,
        });
        suggestionInfo.append(suggestionTitle, suggestionArtists);
        suggestionItem.append(suggestionInfo)
        suggestionsList.append(suggestionItem);

        suggestionItem.on('click', function () {
            const suggestionId = $(this).data('id');
            const suggestionText = suggestion.title + ' - ' + suggestion.artists;
            hideTrackSuggestions();

            // Store the selected suggestion compactly under the search bar
            const selectedSuggestionContainer = $('#selected-track-suggestion-container');
            const selectedSuggestion = $('<div>', {
                class: 'selected-track-suggestion',
                'data-id': suggestionId,
            });

            const selectedSuggestionText = $('<span>', {
                class: 'selected-track-suggestion-text',
                text: suggestionText,
            });

            const removeButton = $('<span>', {
                class: 'remove-selected-track-suggestion',
                html: '&times;',
            });

            // Add click event listener to remove the selected suggestion
            removeButton.on('click', function () {
                selectedSuggestion.remove();
                const indexToRemove = selectedTrackSuggestions.indexOf(suggestionId);
                if (indexToRemove !== -1) {
                    selectedTrackSuggestions.splice(indexToRemove, 1);
                }
            });

            selectedSuggestion.append(selectedSuggestionText, removeButton);
            selectedSuggestionContainer.append(selectedSuggestion);

            selectedTrackSuggestions.push(suggestionId);

            $('.track-filter').val('');
        });

    });

    suggestionsList.show();
}

function hideTrackSuggestions() {
    $('#track-suggestions-list').hide();
}

function getTrackSuggestions(query) {
    debounce(function () {
        if (query.length > 0) {
            $.ajax({
                url: "/track_suggestions",
                data: { query: query },
                method: 'GET',
                success: function (data) {
                    if (data.length > 0) {
                        showTrackSuggestions(data);
                    } else {
                        hideTrackSuggestions();
                    }
                },
                error: function (error) {
                    console.error('Error fetching suggestions:', error);
                    hideTrackSuggestions();
                }
            });
        }
    }, 300);
}

$('#search-input').on('focus', function () {
    const inputValue = $(this).val();
    if (inputValue.length > 0) {
        // Show suggestions only if there is text in the input
        getTrackSuggestions(inputValue);
    }
});

// Close the suggestion list if the user clicks outside the suggestions container
$(document).on('click', function (event) {
    if (!$(event.target).closest('#suggestions-container').length) {
        hideTrackSuggestions();
    }
});