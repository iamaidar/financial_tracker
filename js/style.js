const loadEpisodes = function(showId, accordionId) {
    $.get('https://api.tvmaze.com/shows/' + showId+ '/episodes', function(data) {
        let episodesList = $(`#${accordionId}`);

        if (data.length === 0) {
            episodesList.append('<tr><td>No episodes available</td></tr>');
        }
        else {
            for (let i = 0; i < data.length; i++) {
                episodesList.append(`
                    <tr>
                        <td>${data[i].name}</td>
                        <td>${data[i].season}</td>
                        <td>${data[i].number}</td>
                        <td>${data[i].airdate}</td>
                    </tr>`);
            }
        }
    });
};

const showMovies = function(data) {
    for (let i = 0; i < data.length; i++) {
                let movie = data[i];

                let imageSrc = movie.show.image ? movie.show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';

                let accordionId = `episodes-${movie.show.id}`;

                let movieCard = 
                `
                <div class="border border-1 p-4 bg-secondary-subtle rounded-1 mb-5">
                    <div>
                        <div class="row">
                            <div class="col-12 col-lg-3">
                                <div class="mb-3 d-flex justify-content-center">
                                    <img src="${imageSrc}" alt="Movie Picture">
                                </div>
                            </div>
            
                            <div class="col-12 col-lg-9 d-flex justify-content-center flex-column">

                                <div class="text-center text-lg-start">
                                    <h3><a href="${movie.show.url}" target="_blank" class="text-decoration-none link-dark link-opacity-50-hover">${movie.show.name + ` ${movie.show.rating.average != null ? `(${movie.show.rating.average}/10)` : ''}`}</a></h3>

                                    <h5 class="my-3">About</h5>
                                </div>
                                <div class="row d-flex justify-content-center justify-content-lg-start">
                                    <div class="col-6">
                                        <table class="table table-borderless table-secondary">
                                            <tr>
                                                <td class="fw-semibold">Тип</td>
                                                <td>${movie.show.type}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-semibold">Дата премьеры</td>
                                                <td>${movie.show.premiered}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-semibold">Язык</td>
                                                <td>${movie.show.language}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-semibold">Продолжительность</td>
                                                <td>${movie.show.runtime != null ? `${movie.show.runtime} minutes` : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-semibold">Статус</td>
                                                <td>${movie.show.status}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-semibold">Жанры</td>
                                                <td>${movie.show.genres.length > 0 ? `${movie.show.genres.join(', ')}` : '-'}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                        <div class="p-2 bg-light rounded-2 mb-2">
                            <span class="fw-bold">Описание:</span>
                            ${movie.show.summary != null ? movie.show.summary : 'None'}
                        </div>

                        <div class="accordion accordion-flush" id="accordionFlushExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                    Эпизоды
                                </button>
                                </h2>
                                <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                <div class="accordion-body">
                                    <table class="table table-bordered">
                                        <thead>
                                            <th>Название</th>
                                            <th>Сезон</th>
                                            <th>Номер</th>
                                            <th>Дата</th>    
                                        </thead>
                                        <tbody id="${accordionId}">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                
        $('#movie-container').append(movieCard);

        loadEpisodes(movie.show.id, accordionId);
    }
};

$('#page-title').text('Введитеназвание фильма или сериала в поиск');

$('.navbar-brand').click(function() {
    $('#movie-container').empty();
    $('#page-title').text('Введите название фильма или сериала для поиска');
    $('#searchInput').val('');
});

$('#searchInput').on('input', function(event) {
    event.preventDefault();
    let query = $('#searchInput').val();

    $.get('https://api.tvmaze.com/search/shows?q=' + query, function(data) {
        $('#movie-container').empty();

        if (data.length === 0) {
            $('#page-title').text('Нет фильмов или сериалов с таким названием');
        }
        else {
            $('#page-title').empty();
            showMovies(data);
        }
    });
});
