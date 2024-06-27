(function(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            window['Subway'] = JSON.parse(xhr.response)
        }
    }
    xhr.open("GET", "./settings.json", false)
    xhr.send()
}())