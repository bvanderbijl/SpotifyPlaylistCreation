$(document).ready(function () {
    var maxSelections = 5;

    function checkSelections(item) {
        var genreSelections = $('#genres').val() || [];
        var trackSelections = $('#selected-track-suggestion-container').children().length;
        var artistSelections = $('#selected-artist-suggestion-container').children().length;

        var totalSelections = genreSelections.length + trackSelections + artistSelections;
        
        var overflowType = '';
        if (totalSelections > maxSelections) {
            alert('Up to ' + maxSelections + 'Seed values may be provided in any combination of genres, artists and tracks. Remove one first before adding another item.');
            overflowType = item;
        }

        switch (overflowType) {
            case 'artist':
                $('#selected-artist-suggestion-container').children().last().remove();
                break;
            case 'track':
                $('#selected-track-suggestion-container').children().last().remove();
                break;
            case 'genre':
                var currentSelections = $('#genres').val() || [];
                $('#genres').val(currentSelections.slice(0, -1));
                break;
        }
    }

    $('#genres').on('input', function () {
        checkSelections('genre');
    });

    $(document).on('click', '.track-suggestion-item', function () {
        checkSelections('track');
    })

    $(document).on('click', '.artist-suggestion-item', function () {
        checkSelections('artist');
    })
});
