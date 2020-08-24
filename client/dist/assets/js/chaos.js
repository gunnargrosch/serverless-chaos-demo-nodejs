function updateFunction1() {
    $.ajax({
        type: 'GET',
        url: function1,
        startTime: performance.now(),
        async: true,
        dataType: 'json',
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('jqXHR:');
            console.log(jqXHR);
            function11status.textContent = 'Status ' + jqXHR.status + ' ' + textStatus;
            function11content.textContent = errorThrown;
        },
        success: function (data, textStatus, jqXHR) {
            console.log('jqXHR:');
            console.log(jqXHR);
            var duration = performance.now() - this.startTime;
            duration = duration.toFixed(0);
            function11.textContent = 'Function 1 (' + duration + ' ms)';
            function11status.textContent = 'Status ' + jqXHR.status + ' ' + textStatus;
            function11img.src = data.itemUrl;
        }
    });
}
function updateFunction2() {
    $.ajax({
        type: 'GET',
        url: function2,
        startTime: performance.now(),
        async: true,
        dataType: 'json',
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('jqXHR error:');
            console.log(jqXHR);
            console.log(errorThrown);
            console.log(jqXHR.getAllResponseHeaders());
            function21status.textContent = 'Status ' + jqXHR.status + ' ' + textStatus;
            function21content.textContent = errorThrown;
        },
        success: function (data, textStatus, jqXHR) {
            console.log('jqXHR:');
            console.log(jqXHR);
            var duration = performance.now() - this.startTime;
            duration = duration.toFixed(0);
            function21.textContent = 'Function 2 (' + duration + ' ms)';
            function21status.textContent = 'Status ' + jqXHR.status + ' ' + textStatus;
            function21img.src = data.itemUrl;
        }
    });
}
function updateFunction3() {
    $.ajax({
        type: 'GET',
        url: function3,
        startTime: performance.now(),
        async: true,
        dataType: 'json',
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('jqXHR:');
            console.log(jqXHR);
            function31status.textContent = 'Status ' + jqXHR.status + ' ' + textStatus;
            function31content.textContent = errorThrown;
        },
        success: function (data, textStatus, jqXHR) {
            console.log('jqXHR:');
            console.log(jqXHR);
            var duration = performance.now() - this.startTime;
            duration = duration.toFixed(0);
            function31.textContent = 'Function 3 (' + duration + ' ms)';
            function31status.textContent = 'Status ' + jqXHR.status + ' ' + textStatus;
            function31img.src = data.itemUrl;
        }
    });
}

window.onload = function () {

    setInterval(updateFunction1, 5000);
    setInterval(updateFunction2, 5000);
    setInterval(updateFunction3, 5000);
}
