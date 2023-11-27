var debounceTimer;
var selectedArtistSuggestions = [];

function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
        func();
    }, delay);
}

function showArtistSuggestions(suggestions) {
    const suggestionsList = $('#artist-suggestions-list');
    suggestionsList.empty();

    suggestions.forEach(function (suggestion) {
        const suggestionItem = $('<div>', {
            class: 'artist-suggestion-item',
            'data-id': suggestion.id,
        });

        const suggestionImage = $('<img>', {
            src: suggestion.image_url,
            alt: 'Suggestion Image',
            class: 'artist-suggestion-image',
        });
        suggestionItem.append(suggestionImage);

        const suggestionInfo = $('<div>', {
            class: 'artist-suggestion-info',
        });

        const suggestionArtists = $('<span>', {
            class: 'artist-suggestion-name',
            text: suggestion.name,
        });
        suggestionInfo.append(suggestionArtists);
        suggestionItem.append(suggestionInfo)
        suggestionsList.append(suggestionItem);

        suggestionItem.on('click', function () {
            const suggestionId = $(this).data('id');
            const suggestionText = suggestion.name;
            hideArtistSuggestions();

            if (selectedArtistSuggestions.length < 5) {
                // Store the selected suggestion compactly under the search bar
                const selectedSuggestionContainer = $('#selected-artist-suggestion-container');
                const selectedSuggestion = $('<div>', {
                    class: 'selected-artist-suggestion',
                    'data-id': suggestionId,
                });

                const selectedSuggestionText = $('<span>', {
                    class: 'selected-artist-suggestion-text',
                    text: suggestionText,
                });

                const removeButton = $('<span>', {
                    class: 'remove-selected-artist-suggestion',
                    html: '&times;',
                });

                // Add click event listener to remove the selected suggestion
                removeButton.on('click', function () {
                    selectedSuggestion.remove();
                    const indexToRemove = selectedArtistSuggestions.indexOf(suggestionId);
                    if (indexToRemove !== -1) {
                        selectedArtistSuggestions.splice(indexToRemove, 1);
                    }
                });

                selectedSuggestion.append(selectedSuggestionText, removeButton);
                selectedSuggestionContainer.append(selectedSuggestion);

                selectedArtistSuggestions.push(suggestionId);

                $('.artist-filter').val('');
            }
        });

    });

    suggestionsList.show();
}

function hideArtistSuggestions() {
    $('#artist-suggestions-list').hide();
}

function getArtistSuggestions(query) {
    debounce(function () {
        if (query.length > 0) {
            $.ajax({
                url: "/artist_suggestions",
                data: { query: query },
                method: 'GET',
                success: function (data) {
                    if (data.length > 0) {
                        showArtistSuggestions(data);
                    } else {
                        hideArtistSuggestions();
                    }
                },
                error: function (error) {
                    console.error('Error fetching suggestions:', error);
                    hideArtistSuggestions();
                }
            });
        }
    }, 300);
}

$('#search-input').on('focus', function () {
    const inputValue = $(this).val();
    if (inputValue.length > 0) {
        // Show suggestions only if there is text in the input
        getArtistSuggestions(inputValue);
    }
});

// Close the suggestion list if the user clicks outside the suggestions container
$(document).on('click', function (event) {
    if (!$(event.target).closest('#suggestions-container').length) {
        hideArtistSuggestions();
    }
});