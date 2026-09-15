(function () {
    'use strict';

    var frame = document.getElementById('gameFrame');
    var frameWrap = document.getElementById('gameFrameWrap');
    var gameTitle = document.getElementById('gameTitle');
    var status = document.getElementById('gameStatus');
    var form = document.getElementById('embedForm');
    var urlInput = document.getElementById('gameUrl');
    var urlMessage = document.getElementById('urlMessage');
    var gameCards = Array.prototype.slice.call(document.querySelectorAll('[data-game-url]'));

    function setStatus(message, loading) {
        status.lastChild.textContent = ' ' + message;
        status.classList.toggle('loading', Boolean(loading));
    }

    function loadGame(url, title) {
        setStatus('Loading game…', true);
        frame.title = title + ' game';
        frame.src = url;
        gameTitle.textContent = title;
        gameCards.forEach(function (card) {
            card.classList.toggle('selected', card.dataset.gameUrl === url);
        });
        document.getElementById('now-playing-title').textContent = title;
        document.getElementById('player').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    frame.addEventListener('load', function () {
        setStatus('Ready to play', false);
        try { frame.contentWindow.focus(); } catch (error) { /* Cross-origin frames may reject focus. */ }
    });

    gameCards.forEach(function (card) {
        card.addEventListener('click', function () {
            urlMessage.textContent = '';
            loadGame(this.dataset.gameUrl, this.dataset.gameTitle);
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        urlMessage.className = 'form-message';

        var rawUrl = urlInput.value.trim();
        var parsedUrl;
        try {
            parsedUrl = new URL(rawUrl);
        } catch (error) {
            urlMessage.textContent = 'Enter a complete URL beginning with https://';
            return;
        }

        if (parsedUrl.protocol !== 'https:') {
            urlMessage.textContent = 'For your safety, only HTTPS game URLs are allowed.';
            return;
        }

        var hostTitle = parsedUrl.hostname.replace(/^www\./, '');
        urlMessage.textContent = 'Game loaded. If it stays blank, that provider blocks iframe embedding.';
        urlMessage.classList.add('success');
        loadGame(parsedUrl.href, hostTitle);
    });

    document.getElementById('reloadGame').addEventListener('click', function () {
        setStatus('Reloading game…', true);
        frame.src = frame.src;
    });

    document.getElementById('fullscreenGame').addEventListener('click', function () {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (frameWrap.requestFullscreen) {
            frameWrap.requestFullscreen();
        }
    });

    document.getElementById('copyCode').addEventListener('click', function () {
        var button = this;
        var code = document.getElementById('embedCode').textContent;
        navigator.clipboard.writeText(code).then(function () {
            button.textContent = 'Copied!';
            window.setTimeout(function () { button.textContent = 'Copy code'; }, 1600);
        }).catch(function () {
            button.textContent = 'Select & copy';
        });
    });
})();
