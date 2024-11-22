let fiats = [];
let crypto = [];
let news = [];

async function fetchData() {
    let response = await fetch('https://api.coincap.io/v2/rates');
    let data = await response.json();

    fiats = data.data.filter(e => e.type === 'fiat');
    crypto = data.data.filter(e => e.type === 'crypto');
}

async function getNews() {
    let response = await fetch('https://api.thenewsapi.com/v1/news/all?api_token=IXECsMP4ppSESTTgDbQc8W3o9uy30BA2rYUDI21B&&categories=business&language=ru');
    let data = await response.json();

    news = data.data;
}

$(function() {
    fetchData().then(() => {
        fiats.forEach(f => {
            $('#from-select').append(`<option value="${f.rateUsd}">${f.symbol}</option>`);
            $('#to-select').append(`<option value="${f.rateUsd}">${f.symbol}</option>`);
        });

        let rateSom = fiats.find(f => f.symbol === 'KGS');
        let rateEur = fiats.find(f => f.symbol === 'EUR');

        crypto.sort((a, b) => b.rateUsd - a.rateUsd);

        crypto.forEach(f => {
            $('#crypto-table').append(`
                <tr>
                    <td>${f.currencySymbol ? f.currencySymbol : '-'}</td>
                    <td>${f.symbol}</td>
                    <td>${f.rateUsd}</td>
                    <td>${f.rateUsd / rateSom.rateUsd}</td>
                    <td>${f.rateUsd / rateEur.rateUsd}</td>
                </tr>`);
        });
    });

    getNews().then(() => {
        $('#article-block').empty();
        news.forEach(n => {
            let article = `
                <div class="rounded rounded-2 bg-secondary-subtle p-4 pb-2 text-black mb-3">
                    <h5><a href="${n.url}" target="_blank" class="link-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">${n.title}</a></h5>
                    <p>${n.description}</p>
                    <p class="text-end">Категории: ${n.categories.join(', ')} | <a href="https://${n.source}" target="_blank" class="text-decoration-none">Источник</a> | ${new Date(n.published_at).toLocaleDateString()}</p>
                </div>
            `;

            $('#article-block').append(article);
        });
    });
});

$('#from').on('input', function() {
    let selectedFromVal = parseFloat($('#from-select').val());
    let selectedToVal = parseFloat($('#to-select').val());
    let sum = parseFloat($('#from').val());

    $('#to').val((sum * selectedFromVal / selectedToVal).toFixed(3));
});

$('#to').on('input', function() {
    let selectedFromVal = parseFloat($('#from-select').val());
    let selectedToVal = parseFloat($('#to-select').val());
    let sum = parseFloat($('#to').val());

    $('#from').val((sum * selectedToVal / selectedFromVal).toFixed(3));
});